import Link from 'next/link';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="not-found" id="main-content" tabIndex={-1}>
        <p className="eyebrow">Erro 404</p>
        <h1>Esta página não foi encontrada.</h1>
        <p>O endereço pode ter mudado ou não estar mais disponível.</p>
        <div>
          <Link className="button button-gold" href="/">Voltar ao início</Link>
          <Link className="text-link-dark" href="/agendar">Agendar uma consulta ↗</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
