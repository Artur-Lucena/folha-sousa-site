import Image from 'next/image';
import Link from 'next/link';
import { WHATSAPP_BASE_URL, buildWhatsAppLink, WHATSAPP_GENERIC_MESSAGE } from '../lib/whatsapp';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Image src="/assets/logo-white.webp" alt="Fôlha & Sousa Advogados" width={199} height={50} />
          <p>Soluções jurídicas estratégicas para pessoas e empresas.</p>
        </div>
        <div>
          <p className="footer-label">Navegue</p>
          <Link href="/#atuacao">Áreas de atuação</Link>
          <Link href="/#escritorio">O escritório</Link>
          <Link href="/#equipe">Equipe</Link>
          <Link href="/agendar">Agendar consulta</Link>
          <Link href="/perguntas-frequentes">Perguntas frequentes</Link>
        </div>
        <div>
          <p className="footer-label">Informações</p>
          <Link href="/politicas-de-privacidade">Política de privacidade</Link>
          <Link href="/termo-de-consulta-juridica">Termo de consulta jurídica</Link>
          <Link href="/termos-de-uso">Termos de uso</Link>
        </div>
        <div>
          <p className="footer-label">Conecte-se</p>
          <a href="mailto:contato@folhaesousa.adv.br">contato@folhaesousa.adv.br</a>
          <a href={WHATSAPP_BASE_URL} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
          <a href="https://www.instagram.com/folhaesousa.adv/" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
          <a href="https://www.facebook.com/share/1AfALzayzH/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Facebook ↗</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Fôlha & Sousa Advogados. Todos os direitos reservados.</span>
        <span>Publicidade de caráter exclusivamente informativo.</span>
      </div>
      <a
        className="whatsapp-float"
        href={buildWhatsAppLink(WHATSAPP_GENERIC_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com o Fôlha & Sousa pelo WhatsApp"
      >
        <span>WhatsApp</span><b aria-hidden="true">↗</b>
      </a>
    </footer>
  );
}
