import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLink } from './components/ArrowLink';
import { ClipReveal } from './components/ClipReveal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroTitle } from './components/HeroTitle';
import { HeroVisual } from './components/HeroVisual';
import { Pressable } from './components/Pressable';
import { Reveal, Stagger, StaggerItem } from './components/Reveal';
import { WHATSAPP_DISPLAY_NUMBER, WHATSAPP_INTERNATIONAL_NUMBER } from './lib/whatsapp';

const practiceAreas = [
  {
    number: '01',
    title: 'Direito Tributário',
    image: '/assets/tax.webp',
    description: 'Atuação na análise e planejamento tributário, consultoria para pessoas físicas e jurídicas, defesa em autos de infração e execuções fiscais, além da recuperação de créditos tributários. Suporte completo em questões administrativas e judiciais nas esferas municipal, estadual e federal.',
  },
  {
    number: '02',
    title: 'Direito Civil e Direito das Sucessões',
    image: '/assets/civil.webp',
    description: 'Atuação abrangendo relações entre pessoas físicas e jurídicas, negócios jurídicos, direitos reais e obrigações, contratos, responsabilidade civil, direito do consumidor, ações de família, dentre outros.',
  },
  {
    number: '03',
    title: 'Direito Administrativo',
    image: '/assets/administrative.webp',
    description: 'Assessoria e consultoria jurídica, incluindo licitações, contratos com o Poder Público, servidores e concursos públicos, além de representar os clientes em inquéritos e processos administrativos e judiciais, contenciosos ou não, nos âmbitos federal, estadual ou municipal.',
  },
  {
    number: '04',
    title: 'Direito Empresarial',
    image: '/assets/business.webp',
    description: 'Assessoria jurídica na constituição e estruturação de empresas, elaboração e análise de contratos empresariais, resolução de conflitos societários, proteção de ativos e marcas, além de suporte jurídico em processos de fusões, aquisições e reestruturações empresariais.',
  },
  {
    number: '05',
    title: 'Direito Trabalhista',
    image: '/assets/labor.webp',
    description: 'Atendimento de demandas contenciosas e consultivas, na área dos direitos individuais e coletivos, na defesa dos interesses de empregados e entregadores, na reestruturação de passivos trabalhistas e negociações no âmbito extrajudicial e judicial.',
  },
  {
    number: '06',
    title: 'Direito Público',
    image: '/assets/public-law.webp',
    description: 'Consultoria jurídica especializada para agentes políticos, órgãos legislativos e instituições públicas, com atuação em assessoria parlamentar, análise de proposições legislativas, projetos de lei, e interface estratégica entre os Poderes.',
  },
];

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const legalServiceData = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'Fôlha & Sousa Advogados',
  url: 'https://folhaesousa.adv.br/',
  image: 'https://folhaesousa.adv.br/og.jpg',
  telephone: `+55 ${WHATSAPP_DISPLAY_NUMBER}`,
  email: 'contato@folhaesousa.adv.br',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida Menino Marcelo, 9350, Empresarial Humberto Lobo, sala 104',
    addressLocality: 'Maceió',
    addressRegion: 'AL',
    postalCode: '57046-000',
    addressCountry: 'BR',
  },
  areaServed: ['Brasil', 'Atendimento internacional'],
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  }],
  employee: [
    { '@type': 'Attorney', name: 'Cosmélia Fôlha', jobTitle: 'Sócia · Especialista em Direito de Família' },
    { '@type': 'Attorney', name: 'Domingos Sávio de Sousa', jobTitle: 'Sócio · Direito Civil e Tributário' },
    { '@type': 'Attorney', name: 'Rubenício Izidro', jobTitle: 'Advogado · Direito Trabalhista e Previdenciário' },
  ],
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceData) }}
        />
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <Reveal as="p" className="eyebrow" delay={0}>Advocacia estratégica · Maceió e todo o Brasil</Reveal>
            <HeroTitle text="Precisa de orientação jurídica segura?" />
            <Reveal as="p" className="hero-lead" delay={0.16}>
              Técnica, experiência e atendimento próximo para proteger pessoas,
              patrimônios e negócios com segurança.
            </Reveal>
            <Reveal delay={0.24}>
              <div className="hero-actions">
                <Pressable><a className="button button-gold" href="/agendar">Agendar consulta</a></Pressable>
                <a className="text-link" href="#atuacao">Conheça nossa atuação <span aria-hidden="true">↘</span></a>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="hero-proof" aria-label="Diferenciais">
                <span>Atendimento nacional e internacional</span>
                <span>Presencial e on-line</span>
                <span>Maceió · Paulo Afonso</span>
              </div>
            </Reveal>
          </div>

          <HeroVisual />
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {Array.from({ length: 12 }).map((_, i) => <span key={i}>Fôlha &amp; Sousa Advogados</span>)}
          </div>
        </div>

        <section className="manifesto section-shell">
          <Reveal as="p" className="eyebrow">O Direito como instrumento de segurança</Reveal>
          <Reveal delay={0.1}>
            <h2>Estratégia antes do conflito.<br />Presença quando ele acontece.</h2>
            <p>Oferecemos assessoria especializada, análise cuidadosa e soluções eficazes, unindo técnica, experiência, ética e transparência para orientar decisões seguras e sustentáveis.</p>
          </Reveal>
        </section>

        <section className="practice-section" id="atuacao">
          <div className="practice-title section-shell">
            <Reveal>
              <p className="eyebrow">Áreas de atuação</p>
              <h2>Conhecimento técnico.<br />Visão de longo prazo.</h2>
            </Reveal>
            <Reveal as="p" delay={0.1}>Atuação consultiva e contenciosa, com soluções construídas para a realidade de cada cliente.</Reveal>
          </div>
          <Stagger className="practice-grid section-shell">
            {practiceAreas.map((area) => (
              <StaggerItem as="article" className="area-card" key={area.number}>
                <div className="area-image">
                  {/* Imagem ilustrativa: o título adjacente já nomeia a área (evita anúncio duplicado). */}
                  <Image src={area.image} alt="" fill sizes="(max-width: 720px) 100vw, (max-width: 1050px) 50vw, 33vw" />
                  <span>{area.number}</span>
                </div>
                <div className="area-copy">
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section className="about-section" id="escritorio">
          <ClipReveal className="about-image">
            <Image src="/assets/team.webp" alt="Equipe Fôlha & Sousa Advogados" fill sizes="(max-width: 1050px) 100vw, 50vw" quality={90} />
          </ClipReveal>
          <Reveal className="about-copy" delay={0.1}>
            <p className="eyebrow">O escritório</p>
            <h2>Uma advocacia moderna, segura e parceira.</h2>
            <p>Unimos técnica, experiência e visão de futuro para oferecer um suporte jurídico completo, focado na resolução de conflitos, na estruturação patrimonial e na prevenção de riscos legais.</p>
            <p>Atuamos com pessoas físicas e jurídicas com um propósito claro: transformar o Direito em um instrumento de proteção, crescimento e segurança. Oferecemos soluções sólidas, personalizadas e com visão de longo prazo, ajudando nossos clientes a tomar decisões estratégicas com confiança.</p>
            <ul className="pillars">
              <li><span>01</span> Excelência técnica</li>
              <li><span>02</span> Ética e transparência</li>
              <li><span>03</span> Compromisso com resultados sustentáveis</li>
            </ul>
          </Reveal>
        </section>

        <section className="values-section section-shell" aria-labelledby="values-heading">
          <div className="values-intro">
            <Reveal as="p" className="eyebrow">Nossa forma de atuar</Reveal>
            <Reveal delay={0.1}><h2 id="values-heading">Rigor técnico com escuta humana.</h2></Reveal>
          </div>
          <Stagger className="values-grid">
            <StaggerItem as="article"><b aria-hidden="true">I</b><span>Missão</span><p>Oferecer soluções jurídicas personalizadas e eficazes, com excelência técnica e atendimento humanizado. Atuamos com compromisso e transparência, garantindo segurança e confiança em cada decisão.</p></StaggerItem>
            <StaggerItem as="article"><b aria-hidden="true">II</b><span>Visão</span><p>Ser referência em advocacia moderna e ética, unindo técnica e empatia para transformar desafios em resultados. Buscamos promover o crescimento e a proteção de pessoas e empresas.</p></StaggerItem>
            <StaggerItem as="article"><b aria-hidden="true">III</b><span>Valores</span><p>Atuamos com integridade, compromisso, empatia e inovação. Nossa conduta reflete responsabilidade, colaboração e busca constante por excelência.</p></StaggerItem>
          </Stagger>
        </section>

        <section className="team-section section-shell" id="equipe">
          <div className="team-heading">
            <Reveal as="p" className="eyebrow">Quem conduz cada estratégia</Reveal>
            <Reveal delay={0.1}><h2>Experiência que se transforma em orientação clara.</h2></Reveal>
          </div>
          <Stagger className="lawyer-grid">
            <StaggerItem as="article" className="lawyer-card">
              <div className="lawyer-photo"><Image src="/assets/cosmelia.webp" alt="Cosmélia Fôlha" fill sizes="(max-width: 1050px) 100vw, 45vw" quality={90} /></div>
              <div className="lawyer-info">
                <p className="eyebrow">Sócia · Especialista em Direito de Família</p>
                <h3>Cosmélia Fôlha</h3>
                <p>Com formação sólida pela UFAL e pós-graduação em Direito Civil e Processo Civil, alia excelência técnica e sensibilidade para lidar com questões delicadas que envolvem relações familiares e civis.</p>
                <p>Sua trajetória inclui atuação em comissões da OAB/AL e conselhos estaduais, com liderança institucional e compromisso com a cidadania.</p>
                <ArrowLink href="/agendar?profissional=cosmelia">Agendar com Cosmélia ↗</ArrowLink>
              </div>
            </StaggerItem>
            <StaggerItem as="article" className="lawyer-card lawyer-card-reverse">
              <div className="lawyer-photo"><Image src="/assets/savio.webp" alt="Domingos Sávio de Sousa" fill sizes="(max-width: 1050px) 100vw, 45vw" quality={90} /></div>
              <div className="lawyer-info">
                <p className="eyebrow">Sócio · Direito Civil e Tributário</p>
                <h3>Domingos Sávio<br />de Sousa</h3>
                <p>Com sólida formação pela UFPE, atua com excelência nas áreas Cível e Tributária, com profundo conhecimento das normas fiscais e do funcionamento da Administração Pública.</p>
                <p>Foi Analista Tributário do Ministério da Receita Federal, é professor de Direito e participa de iniciativas da OAB/AL e do Direito de Família em Alagoas.</p>
                <ArrowLink href="/agendar?profissional=savio">Agendar com Domingos Sávio ↗</ArrowLink>
              </div>
            </StaggerItem>
            <StaggerItem as="article" className="lawyer-card">
              <div className="lawyer-photo"><Image src="/assets/rubenicio.webp" alt="Rubenício Izidro" fill sizes="(max-width: 1050px) 100vw, 45vw" quality={90} /></div>
              <div className="lawyer-info">
                <p className="eyebrow">Advogado · Direito Trabalhista e Previdenciário</p>
                <h3>Rubenício Izidro</h3>
                <p>Atua nas áreas Trabalhista e Previdenciária, com orientação pautada pela técnica, segurança e atenção às particularidades de cada demanda.</p>
                <p>Conduz cada caso com objetividade, responsabilidade e rigor técnico, no consultivo e no contencioso, com atendimento personalizado e ético.</p>
                <ArrowLink href="/agendar?profissional=rubenicio">Agendar com Rubenício ↗</ArrowLink>
              </div>
            </StaggerItem>
          </Stagger>
        </section>

        <section className="reach-section">
          <Image className="reach-map" src="/assets/world-map.png" alt="" aria-hidden="true" width={1600} height={900} sizes="(max-width: 720px) 150vw, 72vw" />
          <Reveal className="reach-copy section-shell">
            <p className="eyebrow">Atendimento sem fronteiras</p>
            <h2>Nacional e internacional.</h2>
            <p>Atuamos em todo o território nacional e assessoramos clientes que vivem, investem ou possuem interesses fora do país, considerando os aspectos documentais, culturais e jurídicos de cada contexto.</p>
            <ul className="reach-points">
              <li>Presencial em Maceió e Paulo Afonso, com agendamento prévio</li>
              <li>On-line para todo o Brasil e para clientes no exterior</li>
              <li>Sigilo profissional em todas as etapas do atendimento</li>
            </ul>
            <Pressable><a className="button button-outline-light" href="/agendar">Falar com nossa equipe</a></Pressable>
          </Reveal>
        </section>

        <section className="contact-section" id="contato">
          <ClipReveal className="contact-photo">
            <Image src="/assets/hero-office.webp" alt="Ambiente do escritório Fôlha & Sousa" fill sizes="(max-width: 1050px) 100vw, 45vw" />
          </ClipReveal>
          <Reveal className="contact-copy" delay={0.1}>
            <p className="eyebrow">Contato</p>
            <h2>Vamos conversar sobre o seu próximo passo.</h2>
            <div className="unit-grid">
              <div className="unit-card">
                <div className="unit-photo"><Image src="/assets/fachada-maceio.webp" alt="Fachada do Empresarial Humberto Lobo, em Maceió" fill sizes="(max-width: 1050px) 100vw, 25vw" /></div>
                <p className="unit-city">Maceió · AL</p>
                <a href="https://maps.app.goo.gl/4PRsv8cXWust6KXk6" target="_blank" rel="noopener noreferrer">Av. Menino Marcelo, 9350<br />Empresarial Humberto Lobo, sala 104<br />Serraria · CEP 57046-000 ↗</a>
              </div>
              <div className="unit-card">
                <div className="unit-photo"><Image src="/assets/fachada-paulo-afonso.webp" alt="Fachada do Empresarial Cliomel, em Paulo Afonso" fill sizes="(max-width: 1050px) 100vw, 25vw" /></div>
                <p className="unit-city">Paulo Afonso · BA</p>
                <a href="https://share.google/FfHzEWqiCcEHMclkE" target="_blank" rel="noopener noreferrer">Rua Marechal Floriano Peixoto, 549<br />Empresarial Cliomel, sala 301<br />Centro · CEP 48601-210 ↗</a>
              </div>
            </div>
            <div className="contact-row">
              <span>Telefone</span>
              <a href={`tel:+${WHATSAPP_INTERNATIONAL_NUMBER}`}>{WHATSAPP_DISPLAY_NUMBER}</a>
            </div>
            <div className="contact-row">
              <span>E-mail</span>
              <a href="mailto:contato@folhaesousa.adv.br">contato@folhaesousa.adv.br</a>
            </div>
            <div className="contact-row">
              <span>Horário</span>
              <p>9h às 18h, de segunda a sexta-feira<br />Atendimento presencial ou on-line com agendamento prévio.</p>
            </div>
            <Pressable><a className="button button-gold" href="/agendar">Agendar consulta</a></Pressable>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
