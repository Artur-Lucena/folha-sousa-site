import type { Metadata } from 'next';
import { FaqAccordion } from '../components/FaqAccordion';

const OG_IMAGE = {
  url: 'https://folhaesousa.adv.br/og.jpg',
  width: 1200,
  height: 630,
  alt: 'Fôlha & Sousa Advogados',
};

export const metadata: Metadata = {
  title: 'Perguntas Frequentes | Fôlha & Sousa Advogados',
  description: 'Valores de consulta, agendamento, atendimento presencial e on-line, reagendamento e proteção de dados.',
  alternates: { canonical: '/perguntas-frequentes' },
  openGraph: {
    title: 'Perguntas Frequentes | Fôlha & Sousa Advogados',
    description: 'Valores de consulta, agendamento e atendimento do Fôlha & Sousa Advogados.',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perguntas Frequentes | Fôlha & Sousa Advogados',
    description: 'Valores de consulta, agendamento e atendimento do Fôlha & Sousa Advogados.',
    images: [OG_IMAGE.url],
  },
};

const sections: { title: string; paragraphs: string[] }[] = [
  {
    title: 'Quanto custa a consulta?',
    paragraphs: ['A consulta sem análise documental tem o valor de R$ 350,00. A consulta com análise documental tem o valor de R$ 500,00. O site não realiza cobrança: a contratação é confirmada pela equipe após verificação de disponibilidade.'],
  },
  {
    title: 'Como solicito um agendamento?',
    paragraphs: ['Na página de agendamento, escolha a área, o formato e o profissional de preferência, indique uma data e informe seus dados de contato. Após o aceite dos termos, uma mensagem é preparada e você conclui o envio pelo WhatsApp oficial do escritório.'],
  },
  {
    title: 'O atendimento é presencial ou on-line?',
    paragraphs: ['Os dois. O atendimento presencial ocorre em Maceió/AL, e o on-line alcança todo o território nacional e clientes com interesses fora do país.'],
  },
  {
    title: 'Quais são os dias e horários de atendimento?',
    paragraphs: ['Segunda a sexta, das 9h às 18h, no horário de Maceió. A data e o horário indicados na solicitação dependem de confirmação da equipe conforme disponibilidade.'],
  },
  {
    title: 'A solicitação pelo site já confirma minha consulta?',
    paragraphs: ['Não. O envio da solicitação não confirma agendamento nem contratação. A consulta somente é confirmada após resposta da equipe e cumprimento das condições informadas nos canais oficiais.'],
  },
  {
    title: 'Posso reagendar ou cancelar?',
    paragraphs: ['Sim. O reagendamento pode ser solicitado sem custo com aviso de ao menos 24 horas. O não comparecimento sem aviso no prazo ou atraso superior a 15 minutos poderá ser considerado ausência, conforme o Termo de Consulta Jurídica.'],
  },
  {
    title: 'Devo enviar documentos pelo site?',
    paragraphs: ['Não. Não envie documentos ou detalhes sensíveis nesta etapa. Documentos somente devem ser enviados após orientação da equipe por canal oficial.'],
  },
  {
    title: 'Quais são as áreas de atuação?',
    paragraphs: ['Direito Tributário, Direito Civil e Sucessões, Direito Administrativo, Direito Empresarial, Direito Trabalhista e Direito Público, com atuação consultiva e contenciosa.'],
  },
  {
    title: 'O resultado do meu caso é garantido?',
    paragraphs: ['Não. A advocacia é atividade de meio: nenhuma consulta ou contratação implica promessa ou garantia de resultado.'],
  },
  {
    title: 'Como meus dados pessoais são tratados?',
    paragraphs: ['Conforme a Política de Privacidade e a LGPD: os dados informados servem para contato, triagem inicial e agendamento. Para dúvidas ou solicitações sobre dados pessoais, utilize contato@folhaesousa.adv.br ou (82) 99410-4373.'],
  },
];

const faqData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: sections.map((section) => ({
    '@type': 'Question',
    name: section.title,
    acceptedAnswer: { '@type': 'Answer', text: section.paragraphs.join(' ') },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <FaqAccordion
        intro="Respostas diretas sobre valores, agendamento, atendimento e proteção de dados. Para situações específicas, solicite uma consulta."
        sections={sections}
      />
    </>
  );
}
