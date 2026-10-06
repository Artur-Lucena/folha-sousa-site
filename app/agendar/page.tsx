import type { Metadata } from 'next';
import { BookingForm } from './BookingForm';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal';
import { getTodayInMaceio, professionals } from './booking';

export const metadata: Metadata = {
  title: 'Agendar Consulta | Fôlha & Sousa Advogados',
  description: 'Solicite uma consulta jurídica presencial em Maceió ou on-line com o Fôlha & Sousa Advogados.',
  alternates: { canonical: '/agendar' },
  openGraph: {
    title: 'Agendar Consulta | Fôlha & Sousa Advogados',
    description: 'Solicite uma consulta jurídica presencial em Maceió ou on-line.',
    images: [{ url: 'https://folhaesousa.adv.br/og.jpg', width: 1200, height: 630, alt: 'Fôlha & Sousa Advogados' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agendar Consulta | Fôlha & Sousa Advogados',
    description: 'Solicite uma consulta jurídica presencial em Maceió ou on-line.',
    images: ['https://folhaesousa.adv.br/og.jpg'],
  },
};

type BookingPageProps = {
  searchParams: Promise<{ profissional?: string | string[] }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const requestedProfessional = (await searchParams).profissional;
  const professionalKey = Array.isArray(requestedProfessional) ? requestedProfessional[0] : requestedProfessional;
  const initialProfessional = professionalKey === 'cosmelia'
    ? professionals[1]
    : professionalKey === 'savio'
      ? professionals[2]
      : professionalKey === 'rubenicio'
        ? professionals[3]
        : professionals[0];

  return (
    <>
      <Header />
      <main className="booking-page" id="main-content" tabIndex={-1}>
        <section className="booking-hero">
          <Reveal className="booking-heading">
            <p className="eyebrow">Atendimento jurídico</p>
            <h1>Solicite sua consulta.</h1>
            <p>Escolha o atendimento e indique sua preferência de horário. Nossa equipe confirma os detalhes pelo WhatsApp.</p>
            <div className="booking-badges"><span>Presencial ou on-line</span><span>Segunda a sexta · 9h às 18h</span></div>
          </Reveal>
          <Stagger as="ol" className="booking-steps" label="Como funciona a solicitação de consulta">
            <StaggerItem as="li" hoverLift={false}><span>01</span><div><strong>Escolha o atendimento</strong><small>Área, formato e profissional de preferência.</small></div></StaggerItem>
            <StaggerItem as="li" hoverLift={false}><span>02</span><div><strong>Indique uma data</strong><small>A equipe confirma o melhor horário disponível.</small></div></StaggerItem>
            <StaggerItem as="li" hoverLift={false}><span>03</span><div><strong>Continue no WhatsApp</strong><small>A mensagem é preparada sem enviar documentos ou cobrar.</small></div></StaggerItem>
          </Stagger>
        </section>
        <BookingForm key={initialProfessional} initialProfessional={initialProfessional} minDate={getTodayInMaceio()} />
      </main>
      <Footer />
    </>
  );
}
