import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '../components/LegalPage';

export const metadata: Metadata = {
  title: 'Termos de Uso | Fôlha & Sousa Advogados',
  description: 'Condições de uso do site Fôlha & Sousa Advogados.',
  alternates: { canonical: '/termos-de-uso' },
  openGraph: {
    title: 'Termos de Uso | Fôlha & Sousa Advogados',
    description: 'Condições de uso do site Fôlha & Sousa Advogados.',
    images: [{ url: 'https://folhaesousa.adv.br/og.jpg', width: 1200, height: 630, alt: 'Fôlha & Sousa Advogados' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Termos de Uso | Fôlha & Sousa Advogados',
    description: 'Condições de uso do site Fôlha & Sousa Advogados.',
    images: ['https://folhaesousa.adv.br/og.jpg'],
  },
};

const sections: LegalSection[] = [
  {
    title: 'Finalidade do site',
    paragraphs: ['Este site apresenta informações institucionais e jurídicas gerais sobre o Fôlha & Sousa Advogados e disponibiliza canais para contato e solicitação de consulta. O conteúdo possui caráter exclusivamente informativo e não constitui aconselhamento jurídico, parecer, promessa de resultado ou formação automática de relação advogado-cliente.'],
  },
  {
    title: 'Uso das informações',
    paragraphs: ['O conteúdo não substitui a análise individualizada de fatos, documentos, prazos e circunstâncias de cada caso. Nenhuma decisão jurídica deve ser tomada exclusivamente com base nas informações publicadas neste site.'],
  },
  {
    title: 'Solicitação de atendimento',
    paragraphs: ['O envio de uma solicitação pelo site ou WhatsApp não confirma agendamento, contratação ou aceitação de caso. A consulta somente será confirmada após resposta da equipe, verificação de disponibilidade e cumprimento das condições informadas nos canais oficiais.'],
  },
  {
    title: 'Propriedade intelectual',
    paragraphs: ['Textos, identidade visual, fotografias, marcas, elementos gráficos e demais conteúdos são protegidos pela legislação aplicável. A reprodução, adaptação ou exploração comercial depende de autorização prévia, salvo usos permitidos por lei.'],
  },
  {
    title: 'Links externos',
    paragraphs: ['O site pode conter links para WhatsApp, redes sociais, mapas e outros serviços de terceiros, submetidos a seus próprios termos e políticas. O escritório não controla o conteúdo, a disponibilidade ou as práticas desses serviços.'],
  },
  {
    title: 'Privacidade e segurança',
    paragraphs: ['O tratamento de dados pessoais segue a Política de Privacidade. O usuário deve evitar o envio de documentos ou informações sigilosas antes de receber orientação da equipe por um canal oficial e seguro.'],
  },
  {
    title: 'Atualizações e contato',
    paragraphs: ['Estes Termos poderão ser atualizados para refletir alterações legais, técnicas ou operacionais. Para dúvidas, entre em contato pelo e-mail contato@folhaesousa.adv.br ou pelo telefone (82) 99410-4373.'],
  },
];

export default function TermsPage() {
  return <LegalPage title="Termos de Uso" updated="26/08/2026" intro="Ao navegar neste site, você declara ter lido e compreendido as condições abaixo." sections={sections} />;
}
