import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '../components/LegalPage';

export const metadata: Metadata = {
  title: 'Termo de Consulta Jurídica | Fôlha & Sousa Advogados',
  description: 'Condições da consulta jurídica individualizada do Fôlha & Sousa Advogados.',
  alternates: { canonical: '/termo-de-consulta-juridica' },
};

const sections: LegalSection[] = [
  {
    title: 'Considerações iniciais',
    paragraphs: ['Este Termo regula a prestação de consulta jurídica individualizada pelo Fôlha & Sousa Advogados, destinada à análise técnica e à orientação sobre o caso relatado pelo cliente. A consulta é um ato profissional pontual e não constitui mandato ou representação judicial ou extrajudicial, que dependem de contrato específico.'],
  },
  {
    title: 'Objeto da consulta',
    paragraphs: ['A consulta poderá ocorrer de forma presencial ou on-line, conforme escolha do cliente e disponibilidade da agenda. Ela compreende orientação técnica e análise preliminar dos fatos e, quando contratada essa modalidade, dos documentos apresentados com antecedência pelos canais indicados pela equipe.'],
  },
  {
    title: 'Valor e confirmação',
    paragraphs: ['A consulta sem análise documental tem o valor de R$ 350,00. A consulta com análise documental tem o valor de R$ 500,00. O envio da solicitação pelo site não confirma automaticamente o atendimento nem realiza cobrança. A contratação será confirmada pela equipe após verificação de disponibilidade e pagamento pelos meios seguros informados nos canais oficiais.'],
  },
  {
    title: 'Relação contratual limitada',
    paragraphs: ['A consulta possui natureza pontual e não continuada. Não inclui acompanhamento posterior, elaboração de parecer, contrato, petição ou outra peça, interposição de recurso, participação em audiência ou controle de prazos, salvo se houver contratação formal específica.'],
  },
  {
    title: 'Sigilo profissional',
    paragraphs: ['Informações, documentos e dados recebidos pelos canais oficiais são protegidos pelo sigilo profissional previsto no Estatuto da Advocacia e no Código de Ética e Disciplina da OAB. O dever de confidencialidade alcança os integrantes e colaboradores do escritório.'],
  },
  {
    title: 'Reagendamento e cancelamento',
    paragraphs: ['O cliente poderá solicitar um reagendamento sem custo mediante aviso com antecedência mínima de 24 horas. O não comparecimento sem aviso no prazo ou atraso superior a 15 minutos poderá ser considerado ausência. Situações de força maior serão avaliadas pela equipe. Valores pagos não são reembolsáveis após o início da consulta ou em caso de ausência sem aviso prévio.'],
  },
  {
    title: 'Proteção de dados pessoais',
    paragraphs: ['Os dados são tratados para identificação, agendamento, realização da consulta e cumprimento de obrigações legais e administrativas, conforme a LGPD e a Política de Privacidade. Documentos e detalhes sensíveis somente devem ser enviados após orientação da equipe por canal oficial.'],
  },
  {
    title: 'Conduta e comunicação',
    paragraphs: ['O escritório atua com técnica, respeito, independência, sigilo e boa-fé. A comunicação ocorrerá pelos canais oficiais para preservar autenticidade e rastreabilidade. A advocacia é atividade de meio: nenhuma consulta ou contratação implica promessa ou garantia de resultado.'],
  },
  {
    title: 'Disposições finais e contato',
    paragraphs: ['A leitura e o aceite deste Termo são condições para a confirmação da consulta. Dúvidas podem ser encaminhadas a contato@folhaesousa.adv.br ou ao telefone (82) 99410-4373.'],
  },
];

export default function ConsultationTermsPage() {
  return <LegalPage title="Termo de Consulta Jurídica" updated="26/08/2026" intro="O presente documento reforça o compromisso do escritório com a ética, a transparência, a boa-fé e o sigilo profissional." sections={sections} />;
}
