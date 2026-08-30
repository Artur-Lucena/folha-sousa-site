'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const prices: Record<string, string> = {
  'Consulta sem análise documental': 'R$ 350,00',
  'Consulta com análise documental': 'R$ 500,00',
};

export function BookingForm({ initialProfessional, minDate }: { initialProfessional: string; minDate: string }) {
  const [consultation, setConsultation] = useState('Consulta sem análise documental');
  const [professional, setProfessional] = useState(initialProfessional);
  const price = useMemo(() => prices[consultation], [consultation]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const rawDate = String(data.get('data') ?? '');
    const formattedDate = rawDate ? rawDate.split('-').reverse().join('/') : 'A combinar';
    const message = [
      'Olá, gostaria de solicitar um agendamento com o Fôlha & Sousa Advogados.',
      '',
      `Área: ${data.get('area')}`,
      `Consulta: ${consultation} — ${price}`,
      `Profissional: ${professional}`,
      `Formato: ${data.get('formato')}`,
      `Data preferida: ${formattedDate}`,
      `Período: ${data.get('periodo')}`,
      '',
      `Nome: ${data.get('nome')}`,
      `Telefone: ${data.get('telefone')}`,
      `E-mail: ${data.get('email')}`,
    ].join('\n');
    window.location.assign(`https://wa.me/5582994104373?text=${encodeURIComponent(message)}`);
  }

  return (
    <form className="booking-form" onSubmit={submit}>
      <div className="form-section">
        <span className="form-number">01</span>
        <div>
          <h2>Como podemos orientar você?</h2>
          <div className="field-grid">
            <label>
              Área de interesse
              <select name="area" required defaultValue="">
                <option value="" disabled>Selecione uma área</option>
                <option>Direito Civil e Sucessões</option>
                <option>Direito Tributário</option>
                <option>Direito Administrativo</option>
                <option>Direito Empresarial</option>
                <option>Direito Trabalhista</option>
                <option>Direito Público</option>
                <option>Orientação inicial</option>
              </select>
            </label>
            <label>
              Tipo de consulta
              <select value={consultation} onChange={(event) => setConsultation(event.target.value)}>
                {Object.keys(prices).map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              Profissional
              <select value={professional} onChange={(event) => setProfessional(event.target.value)}>
                <option>Primeiro profissional disponível</option>
                <option>Cosmélia Fôlha</option>
                <option>Domingos Sávio de Sousa</option>
              </select>
            </label>
            <label>
              Formato
              <select name="formato" required>
                <option>On-line</option>
                <option>Presencial em Maceió</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <span className="form-number">02</span>
        <div>
          <h2>Quando prefere ser atendido?</h2>
          <div className="field-grid">
            <label>
              Data preferida
              <input name="data" type="date" min={minDate} required />
            </label>
            <label>
              Período
              <select name="periodo" required>
                <option>Manhã · 9h às 12h</option>
                <option>Tarde · 13h às 18h</option>
                <option>Primeiro horário disponível</option>
              </select>
            </label>
          </div>
          <p className="field-note">A data e o horário serão confirmados pela equipe conforme disponibilidade.</p>
        </div>
      </div>

      <div className="form-section">
        <span className="form-number">03</span>
        <div>
          <h2>Seus dados para contato</h2>
          <div className="field-grid">
            <label>
              Nome completo
              <input name="nome" type="text" autoComplete="name" required placeholder="Como devemos chamar você?" />
            </label>
            <label>
              Telefone / WhatsApp
              <input name="telefone" type="tel" inputMode="tel" autoComplete="tel" minLength={10} maxLength={20} required placeholder="(00) 00000-0000" />
            </label>
            <label className="field-full">
              E-mail
              <input name="email" type="email" autoComplete="email" required placeholder="voce@exemplo.com.br" />
            </label>
          </div>
          <div className="privacy-note">
            <strong>Proteção desde o primeiro contato.</strong>
            <p>Não envie documentos ou detalhes sensíveis nesta etapa. Ao continuar, os dados acima serão usados apenas para iniciar a conversa de agendamento no WhatsApp.</p>
          </div>
          <label className="consent-field">
            <input type="checkbox" required />
            <span>Li e concordo com o <Link href="/termo-de-consulta-juridica" target="_blank" rel="noreferrer">Termo de Consulta Jurídica</Link> e com a <Link href="/politicas-de-privacidade" target="_blank" rel="noreferrer">Política de Privacidade</Link>.</span>
          </label>
          <div className="booking-total">
            <div><span>Valor da consulta</span><strong>{price}</strong></div>
            <button className="button button-gold" type="submit">Solicitar pelo WhatsApp ↗</button>
          </div>
          <p className="field-note">O envio não confirma automaticamente a consulta nem realiza cobrança.</p>
        </div>
      </div>
    </form>
  );
}
