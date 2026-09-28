import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '../components/LegalPage';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Fôlha & Sousa Advogados',
  description: 'Conheça como o Fôlha & Sousa Advogados trata e protege dados pessoais.',
  alternates: { canonical: '/politicas-de-privacidade' },
  openGraph: {
    title: 'Política de Privacidade | Fôlha & Sousa Advogados',
    description: 'Conheça como o Fôlha & Sousa Advogados trata e protege dados pessoais.',
    images: [{ url: 'https://folhaesousa.adv.br/og.jpg', width: 1200, height: 630, alt: 'Fôlha & Sousa Advogados' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Política de Privacidade | Fôlha & Sousa Advogados',
    description: 'Conheça como o Fôlha & Sousa Advogados trata e protege dados pessoais.',
    images: ['https://folhaesousa.adv.br/og.jpg'],
  },
};

const sections: LegalSection[] = [
  {
    title: 'Coleta de dados pessoais',
    paragraphs: ['Podemos tratar os dados fornecidos voluntariamente quando você solicita contato ou inicia um agendamento por nossos canais oficiais.'],
    items: ['Nome completo', 'E-mail', 'Número de telefone ou WhatsApp', 'Área jurídica de interesse e preferência de atendimento', 'Outras informações fornecidas posteriormente e necessárias ao atendimento solicitado'],
  },
  {
    title: 'Finalidades do tratamento',
    paragraphs: ['Os dados são utilizados para responder solicitações, realizar triagem inicial, organizar agendamentos, prestar serviços jurídicos contratados, manter a comunicação com o cliente e cumprir obrigações legais, regulatórias e éticas aplicáveis à advocacia.'],
  },
  {
    title: 'Compartilhamento dos dados',
    paragraphs: ['O escritório não comercializa dados pessoais. O compartilhamento poderá ocorrer com prestadores essenciais ao funcionamento dos canais e sistemas utilizados, sob dever de confidencialidade; mediante consentimento; ou quando necessário ao cumprimento de obrigação legal, regulatória ou ordem de autoridade competente.'],
  },
  {
    title: 'Armazenamento e segurança',
    paragraphs: ['Adotamos medidas técnicas e administrativas adequadas para proteger os dados contra acesso não autorizado, perda, destruição, alteração ou divulgação indevida. Os dados são mantidos pelo período necessário às finalidades informadas e ao cumprimento de obrigações legais e éticas.'],
  },
  {
    title: 'Direitos do titular',
    paragraphs: ['Nos termos da Lei nº 13.709/2018 (LGPD), o titular poderá solicitar, conforme aplicável:'],
    items: ['Confirmação da existência de tratamento e acesso aos dados', 'Correção de dados incompletos, inexatos ou desatualizados', 'Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos', 'Informações sobre compartilhamento', 'Revogação do consentimento e demais direitos previstos em lei'],
  },
  {
    title: 'Cookies e dados técnicos',
    paragraphs: ['Este site utiliza apenas os recursos técnicos necessários ao seu funcionamento. A infraestrutura de hospedagem pode processar registros técnicos mínimos, como endereço IP, tipo de dispositivo e horário de acesso, para segurança, disponibilidade e prevenção de abuso. Não utilizamos rastreadores próprios para publicidade comportamental.'],
  },
  {
    title: 'Atualizações desta política',
    paragraphs: ['Esta Política poderá ser atualizada para refletir alterações legais, técnicas ou operacionais. A versão vigente estará sempre disponível nesta página, acompanhada da data de atualização.'],
  },
  {
    title: 'Contato',
    paragraphs: ['Para dúvidas ou solicitações relacionadas a dados pessoais, entre em contato pelo e-mail contato@folhaesousa.adv.br ou pelo telefone (82) 99410-4373. Fôlha & Sousa Advogados — CNPJ 28.306.731/0001-89 — Av. Menino Marcelo, 9350, Empresarial Humberto Lobo, sala 309, Serraria, Maceió/AL, CEP 57046-000.'],
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Política de Privacidade" updated="26/08/2026" intro="Esta Política explica o compromisso do Fôlha & Sousa Advogados com a privacidade e a proteção dos dados pessoais tratados em seus canais, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD)." sections={sections} />;
}
