import Image from 'next/image';
import type { Metadata } from 'next';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const practiceAreas = [
  {
    number: '01',
    title: 'Direito Tributário',
    image: '/assets/tax.webp',
    description: 'Planejamento, consultoria, defesa em autos de infração e execuções fiscais, recuperação de créditos e atuação administrativa ou judicial nas esferas municipal, estadual e federal.',
  },
  {
    number: '02',
    title: 'Direito Civil e Sucessões',
    image: '/assets/civil.webp',
    description: 'Contratos, responsabilidade civil, relações de consumo, família, sucessões, direitos reais e obrigações para pessoas físicas e jurídicas.',
  },
  {
    number: '03',
    title: 'Direito Administrativo',
    image: '/assets/administrative.webp',
    description: 'Licitações, contratos com o Poder Público, servidores, concursos e representação em inquéritos e processos administrativos ou judiciais.',
  },
  {
    number: '04',
    title: 'Direito Empresarial',
    image: '/assets/business.webp',
    description: 'Constituição e estruturação de empresas, contratos, conflitos societários, proteção de ativos e suporte em fusões, aquisições e reestruturações.',
  },
  {
    number: '05',
    title: 'Direito Trabalhista',
    image: '/assets/labor.webp',
    description: 'Demandas consultivas e contenciosas, direitos individuais e coletivos, reestruturação de passivos e negociações judiciais ou extrajudiciais.',
  },
  {
    number: '06',
    title: 'Direito Público',
    image: '/assets/public-law.webp',
    description: 'Consultoria a agentes políticos, órgãos legislativos e instituições públicas, com assessoria parlamentar e análise de proposições e projetos de lei.',
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
  image: 'https://folhaesousa.adv.br/og.png',
  telephone: '+55 82 99410-4373',
  email: 'contato@folhaesousa.adv.br',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida Menino Marcelo, 9350, Empresarial Humberto Lobo, sala 309',
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
            <p className="eyebrow">Advocacia estratégica · Maceió e todo o Brasil</p>
            <h1>Precisa de orientação jurídica segura?</h1>
            <p className="hero-lead">
              Técnica, experiência e atendimento próximo para proteger pessoas,
              patrimônios e negócios com segurança.
            </p>
            <div className="hero-actions">
              <a className="button button-gold" href="/agendar">Agendar consulta</a>
              <a className="text-link" href="#atuacao">Conheça nossa atuação <span aria-hidden="true">↘</span></a>
            </div>
            <div className="hero-proof" aria-label="Diferenciais">
              <span>Atendimento nacional e internacional</span>
              <span>Presencial e on-line</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Sócios do escritório Fôlha & Sousa">
            <Image className="hero-office" src="/assets/hero-office.jpg" alt="Escritório Fôlha & Sousa" fill priority sizes="(max-width: 900px) 100vw, 55vw" />
            <div className="hero-shade" />
            <Image className="hero-people" src="/assets/hero-people.webp" alt="Cosmélia Fôlha e Domingos Sávio de Sousa" width={615} height={659} priority />
            <div className="hero-caption">
              <span>Fôlha & Sousa</span>
              <small>Advogados</small>
            </div>
          </div>
        </section>

        <section className="manifesto section-shell weighted-reveal">
          <p className="eyebrow">O Direito como instrumento de segurança</p>
          <div>
            <h2>Estratégia antes do conflito.<br />Presença quando ele acontece.</h2>
            <p>Oferecemos assessoria especializada, análise cuidadosa e soluções eficazes, unindo técnica, experiência, ética e transparência para orientar decisões seguras e sustentáveis.</p>
          </div>
        </section>

        <section className="practice-section" id="atuacao">
          <div className="practice-title section-shell weighted-reveal">
            <div>
              <p className="eyebrow">Áreas de atuação</p>
              <h2>Conhecimento técnico.<br />Visão de longo prazo.</h2>
            </div>
            <p>Atuação consultiva e contenciosa, com soluções construídas para a realidade de cada cliente.</p>
          </div>
          <div className="practice-grid section-shell">
            {practiceAreas.map((area) => (
              <article className="area-card weighted-reveal" key={area.number}>
                <div className="area-image">
                  <Image src={area.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
                  <span>{area.number}</span>
                </div>
                <div className="area-copy">
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="escritorio">
          <div className="about-image weighted-reveal">
            <Image src="/assets/team.webp" alt="Equipe Fôlha & Sousa Advogados" fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div className="about-copy weighted-reveal">
            <p className="eyebrow">O escritório</p>
            <h2>Uma advocacia moderna, segura e parceira.</h2>
            <p>Unimos técnica, experiência e visão de futuro para oferecer suporte jurídico completo, focado na resolução de conflitos, na estruturação patrimonial e na prevenção de riscos legais.</p>
            <p>Atuamos com pessoas físicas e jurídicas para transformar o Direito em um instrumento de proteção, crescimento e segurança.</p>
            <ul className="pillars">
              <li><span>01</span> Excelência técnica</li>
              <li><span>02</span> Ética e transparência</li>
              <li><span>03</span> Resultados sustentáveis</li>
            </ul>
          </div>
        </section>

        <section className="values-section section-shell" aria-labelledby="values-heading">
          <div className="values-intro weighted-reveal">
            <p className="eyebrow">Nossa forma de atuar</p>
            <h2 id="values-heading">Rigor técnico com escuta humana.</h2>
          </div>
          <div className="values-grid">
            <article className="weighted-reveal"><b aria-hidden="true">I</b><span>Missão</span><p>Oferecer soluções jurídicas personalizadas e eficazes, com excelência técnica, compromisso, transparência e atendimento humanizado.</p></article>
            <article className="weighted-reveal"><b aria-hidden="true">II</b><span>Visão</span><p>Ser referência em advocacia moderna e ética, unindo técnica e empatia para transformar desafios em resultados.</p></article>
            <article className="weighted-reveal"><b aria-hidden="true">III</b><span>Valores</span><p>Integridade, responsabilidade, colaboração, inovação e busca constante por excelência em cada relação.</p></article>
          </div>
        </section>

        <section className="team-section section-shell" id="equipe">
          <div className="team-heading weighted-reveal">
            <p className="eyebrow">Quem conduz cada estratégia</p>
            <h2>Experiência que se transforma em orientação clara.</h2>
          </div>
          <div className="lawyer-grid">
            <article className="lawyer-card weighted-reveal">
              <div className="lawyer-photo"><Image src="/assets/cosmelia.webp" alt="Cosmélia Fôlha" fill sizes="(max-width: 700px) 100vw, 45vw" /></div>
              <div className="lawyer-info">
                <p className="eyebrow">Sócia · Direito Civil e de Família</p>
                <h3>Cosmélia Fôlha</h3>
                <p>Graduada pela UFAL e pós-graduada em Direito Civil e Processo Civil, alia excelência técnica e sensibilidade na condução de questões familiares e civis.</p>
                <p>Sua trajetória inclui atuação em comissões da OAB/AL e conselhos estaduais, com liderança institucional e compromisso com a cidadania.</p>
                <a href="/agendar?profissional=cosmelia">Agendar com Cosmélia ↗</a>
              </div>
            </article>
            <article className="lawyer-card lawyer-card-reverse weighted-reveal">
              <div className="lawyer-photo"><Image src="/assets/savio.webp" alt="Domingos Sávio de Sousa" fill sizes="(max-width: 700px) 100vw, 45vw" /></div>
              <div className="lawyer-info">
                <p className="eyebrow">Sócio · Direito Civil e Tributário</p>
                <h3>Domingos Sávio<br />de Sousa</h3>
                <p>Graduado pela UFPE, possui sólida experiência nas áreas Cível e Tributária e profundo conhecimento das normas fiscais e do funcionamento da Administração Pública.</p>
                <p>Foi Analista Tributário do Ministério da Receita Federal, é professor de Direito e participa de iniciativas da OAB/AL e do Direito de Família em Alagoas.</p>
                <a href="/agendar?profissional=savio">Agendar com Domingos Sávio ↗</a>
              </div>
            </article>
          </div>
        </section>

        <section className="reach-section">
          <Image className="reach-map" src="/assets/world-map.png" alt="Mapa-múndi" width={1600} height={900} />
          <div className="reach-copy section-shell weighted-reveal">
            <p className="eyebrow">Atendimento sem fronteiras</p>
            <h2>Nacional e internacional.</h2>
            <p>Atuamos em todo o território nacional e assessoramos clientes que vivem, investem ou possuem interesses fora do país, considerando os aspectos documentais, culturais e jurídicos de cada contexto.</p>
            <a className="button button-outline-light" href="/agendar">Falar com nossa equipe</a>
          </div>
        </section>

        <section className="contact-section" id="contato">
          <div className="contact-photo weighted-reveal">
            <Image src="/assets/hero-office.jpg" alt="Ambiente do escritório Fôlha & Sousa" fill sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
          <div className="contact-copy weighted-reveal">
            <p className="eyebrow">Contato</p>
            <h2>Vamos conversar sobre o seu próximo passo.</h2>
            <div className="contact-row">
              <span>Endereço</span>
              <a href="https://maps.app.goo.gl/4PRsv8cXWust6KXk6" target="_blank" rel="noreferrer">Av. Menino Marcelo, 9350<br />Empresarial Humberto Lobo, sala 309<br />Serraria · Maceió/AL · 57046-000 ↗</a>
            </div>
            <div className="contact-row">
              <span>Telefone</span>
              <a href="tel:+5582994104373">(82) 99410-4373</a>
            </div>
            <div className="contact-row">
              <span>E-mail</span>
              <a href="mailto:contato@folhaesousa.adv.br">contato@folhaesousa.adv.br</a>
            </div>
            <div className="contact-row">
              <span>Horário</span>
              <p>Segunda a sexta, das 9h às 18h<br />Atendimento presencial ou on-line com agendamento.</p>
            </div>
            <a className="button button-gold" href="/agendar">Agendar consulta</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
