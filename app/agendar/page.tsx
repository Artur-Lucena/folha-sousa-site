import type { Metadata } from 'next';
import { BookingForm } from './BookingForm';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export const metadata: Metadata = {
  title: 'Agendar Consulta | Fôlha & Sousa Advogados',
  description: 'Solicite uma consulta jurídica presencial em Maceió ou on-line com o Fôlha & Sousa Advogados.',
  alternates: { canonical: '/agendar' },
};

type BookingPageProps = {
  searchParams: Promise<{ profissional?: string | string[] }>;
};

function getTodayInMaceio() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Maceio',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const requestedProfessional = (await searchParams).profissional;
  const professionalKey = Array.isArray(requestedProfessional) ? requestedProfessional[0] : requestedProfessional;
  const initialProfessional = professionalKey === 'cosmelia'
    ? 'Cosmélia Fôlha'
    : professionalKey === 'savio'
      ? 'Domingos Sávio de Sousa'
      : 'Primeiro profissional disponível';

  return (
    <>
      <Header />
      <main className="booking-page" id="main-content" tabIndex={-1}>
        <section className="booking-hero">
          <p className="eyebrow">Atendimento jurídico</p>
          <h1>Vamos entender o que você precisa.</h1>
          <p>Preencha as informações essenciais e conclua a solicitação diretamente pelo nosso WhatsApp oficial.</p>
          <div className="booking-badges"><span>Presencial ou on-line</span><span>Segunda a sexta · 9h às 18h</span></div>
        </section>
        <BookingForm initialProfessional={initialProfessional} minDate={getTodayInMaceio()} />
      </main>
      <Footer />
    </>
  );
}
