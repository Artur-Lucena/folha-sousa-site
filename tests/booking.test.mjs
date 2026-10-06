import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBookingUrl, getDateError, getTodayInMaceio, validateBooking } from '../app/agendar/booking.ts';

function validData(overrides = {}) {
  const data = new FormData();
  const fields = {
    area: 'Direito Tributário', consulta: 'Consulta sem análise documental',
    profissional: 'Cosmélia Fôlha', formato: 'On-line', data: '2026-09-09',
    periodo: 'Manhã · 9h às 12h', nome: 'Pessoa de Teste', telefone: '+55 (82) 99999-0000',
    email: 'teste+consulta@example.com', consentimento: 'on', ...overrides,
  };
  for (const [field, value] of Object.entries(fields)) data.set(field, value);
  return data;
}

test('dia de Maceió respeita a virada de data, independentemente do fuso do computador', () => {
  assert.equal(getTodayInMaceio(new Date('2026-09-10T02:59:59Z')), '2026-09-09');
  assert.equal(getTodayInMaceio(new Date('2026-09-10T03:00:00Z')), '2026-09-10');
});

test('data válida passa hoje, mas deixa de passar depois da meia-noite', () => {
  assert.deepEqual(validateBooking(validData(), '2026-09-09'), {});
  assert.match(validateBooking(validData(), '2026-09-10').data, /futura/);
  assert.throws(() => buildBookingUrl(validData(), '2026-09-10'));
});

test('sábado, domingo, data impossível e data vazia são recusados', () => {
  for (const date of ['2026-09-12', '2026-09-13', '2026-02-30', '2026-13-01', '09/09/2026', '']) {
    assert.notEqual(getDateError(date, '2026-01-01'), '', date);
  }
  assert.equal(getDateError('2028-02-29', '2026-01-01'), '');
});

test('nome em branco e conteúdo excessivo são recusados sem exigir sobrenome', () => {
  for (const nome of ['', '   ', 'x'.repeat(121)]) assert.ok(validateBooking(validData({ nome }), '2026-09-09').nome);
  assert.equal(validateBooking(validData({ nome: ' Ana ' }), '2026-09-09').nome, undefined);
});

test('telefone exige dígitos e aceita formatos nacionais e internacionais', () => {
  for (const telefone of ['abcdefghij', '----------', '1234567', '1'.repeat(16), '82+999990000']) {
    assert.ok(validateBooking(validData({ telefone }), '2026-09-09').telefone, telefone);
  }
  for (const telefone of ['82999990000', '(82) 3333-0000', '+351 912 345 678', '+1 (202) 555-0100']) {
    assert.equal(validateBooking(validData({ telefone }), '2026-09-09').telefone, undefined, telefone);
  }
});

test('e-mail rejeita domínio malformado e aceita aliases', () => {
  for (const email of ['', 'teste', 'ana@dominio/com.br', 'ana@dominio..com', 'ana@-dominio.com', 'ana@dominio-.com', 'a b@example.com']) {
    assert.ok(validateBooking(validData({ email }), '2026-09-09').email, email);
  }
  assert.equal(validateBooking(validData(), '2026-09-09').email, undefined);
});

test('termos não aceitos ou opções adulteradas impedem a geração do link', () => {
  for (const overrides of [{ consentimento: '' }, { consulta: 'Consulta gratuita' }, { profissional: 'Outro nome' }, { area: '' }, { periodo: '' }, { formato: '' }]) {
    assert.throws(() => buildBookingUrl(validData(overrides), '2026-09-09'));
  }
});

test('mensagem preserva acentos e caracteres reservados sem criar parâmetros extras', () => {
  const url = new URL(buildBookingUrl(validData({ nome: '  José & Ana  ' }), '2026-09-09'));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5582994104373');
  assert.deepEqual([...url.searchParams.keys()], ['text']);
  const message = url.searchParams.get('text');
  assert.match(message, /Nome: José & Ana\n/);
  assert.match(message, /Profissional: Cosmélia Fôlha/);
  assert.match(message, /Data preferida: 09\/09\/2026/);
  assert.match(message, /E-mail: teste\+consulta@example.com/);
  assert.match(message, /R\$ 350,00/);
});

test('novas opções do site atual passam na validação', () => {
  const data = validData({
    area: 'Direito Previdenciário',
    profissional: 'Rubenício Izidro',
    formato: 'Presencial em Paulo Afonso',
  });
  assert.deepEqual(validateBooking(data, '2026-09-09'), {});
  const message = new URL(buildBookingUrl(data, '2026-09-09')).searchParams.get('text');
  assert.match(message, /Rubenício Izidro/);
  assert.match(message, /Presencial em Paulo Afonso/);
  assert.match(message, /Direito Previdenciário/);
});

test('consulta com documentos usa o valor correto em sua mensagem', () => {
  const url = new URL(buildBookingUrl(validData({ consulta: 'Consulta com análise documental' }), '2026-09-09'));
  assert.match(url.searchParams.get('text'), /Consulta com análise documental — R\$ 500,00/);
});
