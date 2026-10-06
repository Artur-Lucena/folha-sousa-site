export const consultationPrices = {
  'Consulta sem análise documental': 'R$ 350,00',
  'Consulta com análise documental': 'R$ 500,00',
} as const;

export const professionals = ['Primeiro profissional disponível', 'Cosmélia Fôlha', 'Domingos Sávio de Sousa', 'Rubenício Izidro'] as const;
export const areas = ['Direito Civil e Direito das Sucessões', 'Direito Tributário', 'Direito Administrativo', 'Direito Empresarial', 'Direito Trabalhista', 'Direito Previdenciário', 'Direito Público', 'Orientação inicial'] as const;
export const formats = ['On-line', 'Presencial em Maceió', 'Presencial em Paulo Afonso'] as const;
export const periods = ['Manhã · 9h às 12h', 'Tarde · 13h às 18h', 'Primeiro horário disponível'] as const;
// Mantido igual a WHATSAPP_BASE_URL em app/lib/whatsapp.ts (fonte canônica do número).
// A igualdade é verificada por tests/whatsapp.test.mjs; sem import direto para
// que este módulo continue carregável pelo runner de testes do Node.
export const whatsappUrl = 'https://wa.me/5582994104373';

export type BookingField = 'area' | 'consulta' | 'profissional' | 'formato' | 'data' | 'periodo' | 'nome' | 'telefone' | 'email' | 'consentimento';
export type BookingErrors = Partial<Record<BookingField, string>>;

export function getTodayInMaceio(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Maceio', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getDateError(value: string, today: string) {
  if (!value) return 'Escolha uma data de preferência.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Informe uma data válida.';
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return 'Informe uma data válida.';
  if (value < today) return 'Escolha hoje ou uma data futura.';
  if (parsed.getUTCDay() === 0 || parsed.getUTCDay() === 6) return 'Escolha uma data de segunda a sexta-feira.';
  return '';
}

export function readBookingField(data: FormData, field: BookingField) {
  const value = data.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

export function validateBooking(data: FormData, today = getTodayInMaceio()): BookingErrors {
  const errors: BookingErrors = {};
  const choices: [BookingField, readonly string[]][] = [
    ['area', areas], ['consulta', Object.keys(consultationPrices)],
    ['profissional', professionals], ['formato', formats], ['periodo', periods],
  ];
  for (const [field, options] of choices) {
    if (!options.includes(readBookingField(data, field))) errors[field] = 'Selecione uma das opções disponíveis.';
  }
  const dateError = getDateError(readBookingField(data, 'data'), today);
  if (dateError) errors.data = dateError;
  const name = readBookingField(data, 'nome');
  if (!name || name.length > 120) errors.nome = 'Informe seu nome (até 120 caracteres).';
  const phone = readBookingField(data, 'telefone');
  const digits = phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 8 || digits.length > 15 || phone.length > 30) {
    errors.telefone = 'Informe de 8 a 15 dígitos. Inclua o DDD ou o código do país para números internacionais.';
  }
  const email = readBookingField(data, 'email');
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
  if (!emailPattern.test(email) || email.length > 254) errors.email = 'Informe um e-mail válido, como nome@exemplo.com.br.';
  if (data.get('consentimento') !== 'on') errors.consentimento = 'Leia e aceite os termos para continuar.';
  return errors;
}

export function buildBookingUrl(data: FormData, today = getTodayInMaceio()) {
  if (Object.keys(validateBooking(data, today)).length) throw new Error('Revise os dados antes de preparar o agendamento.');
  const consultation = readBookingField(data, 'consulta') as keyof typeof consultationPrices;
  const value = (field: BookingField) => readBookingField(data, field).replace(/\s+/g, ' ');
  const message = [
    'Olá, gostaria de solicitar um agendamento com o Fôlha & Sousa Advogados.', '',
    `Área: ${value('area')}`, `Consulta: ${consultation} — ${consultationPrices[consultation]}`,
    `Profissional: ${value('profissional')}`, `Formato: ${value('formato')}`,
    `Data preferida: ${value('data').split('-').reverse().join('/')}`, `Período: ${value('periodo')}`, '',
    `Nome: ${value('nome')}`, `Telefone: ${value('telefone')}`, `E-mail: ${value('email')}`,
  ].join('\n');
  return `${whatsappUrl}?text=${encodeURIComponent(message)}`;
}
