'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import {
  areas, buildBookingUrl, consultationPrices, formats, getTodayInMaceio,
  periods, professionals, validateBooking, whatsappUrl,
  type BookingErrors, type BookingField,
} from './booking';

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function BookingForm({ initialProfessional, minDate }: { initialProfessional: string; minDate: string }) {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [consultation, setConsultation] = useState<keyof typeof consultationPrices>('Consulta sem análise documental');
  const [errors, setErrors] = useState<BookingErrors>({});
  const [earliestDate, setEarliestDate] = useState(minDate);
  const [submitStatus, setSubmitStatus] = useState('');

  function refreshField(event: FormEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    const field = target.name as BookingField;
    const today = getTodayInMaceio();
    if (field === 'data') setEarliestDate(today);
    // Recheck the edited field without announcing errors in untouched fields.
    if (errors[field] || event.type === 'blur') {
      const nextError = validateBooking(new FormData(event.currentTarget), today)[field];
      setErrors((current) => ({ ...current, [field]: nextError }));
    }
    if (event.type === 'change') setSubmitStatus('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const today = getTodayInMaceio();
    setEarliestDate(today);
    const nextErrors = validateBooking(data, today);
    // Commit error descriptions before moving focus so they can be announced.
    flushSync(() => setErrors(nextErrors));
    if (Object.keys(nextErrors).length) {
      setSubmitStatus('Revise os campos destacados para continuar.');
      const firstInvalid = Array.from(form.elements).find(
        (element) => (element instanceof HTMLInputElement || element instanceof HTMLSelectElement)
          && nextErrors[element.name as BookingField],
      );
      if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
      return;
    }
    setSubmitStatus('Abrindo o WhatsApp. Revise a mensagem e envie por lá para concluir.');
    window.location.assign(buildBookingUrl(data, today));
  }

  function errorFor(field: BookingField) {
    return errors[field] ? <span className="field-error" id={field + '-error'}>{errors[field]}</span> : null;
  }

  function describedBy(field: BookingField, help?: string) {
    return [help, errors[field] ? field + '-error' : null].filter(Boolean).join(' ') || undefined;
  }

  return (
    <form className="booking-form" method="post" noValidate onSubmit={submit} onChange={refreshField} onBlur={refreshField} aria-describedby="booking-form-help">
      <p className="booking-form-help" id="booking-form-help">Preencha todos os campos. Você poderá revisar a mensagem no WhatsApp antes de enviá-la.</p>
      <noscript>
        <p className="privacy-note">Para preencher o formulário, ative o JavaScript. Você também pode <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">falar diretamente com a equipe pelo WhatsApp</a>.</p>
      </noscript>

      <fieldset className="form-section" disabled={!ready} aria-labelledby="booking-service-title">
        <span className="form-number" aria-hidden="true">01</span>
        <div>
          <h2 id="booking-service-title">Seu atendimento</h2>
          <div className="field-grid">
            <label>
              Área de interesse
              <select name="area" required defaultValue="" aria-invalid={!!errors.area} aria-describedby={describedBy('area')}>
                <option value="" disabled>Selecione uma área</option>
                {areas.map((area) => <option key={area}>{area}</option>)}
              </select>
              {errorFor('area')}
            </label>
            <label>
              Tipo de consulta
              <select name="consulta" required value={consultation} onChange={(event) => setConsultation(event.target.value as keyof typeof consultationPrices)} aria-invalid={!!errors.consulta} aria-describedby={describedBy('consulta', 'consultation-price')}>
                {Object.keys(consultationPrices).map((option) => <option key={option}>{option}</option>)}
              </select>
              {errorFor('consulta')}
            </label>
            <label>
              Profissional
              <select name="profissional" required defaultValue={initialProfessional} aria-invalid={!!errors.profissional} aria-describedby={describedBy('profissional')}>
                {professionals.map((professional) => <option key={professional}>{professional}</option>)}
              </select>
              {errorFor('profissional')}
            </label>
            <label>
              Formato
              <select name="formato" required aria-invalid={!!errors.formato} aria-describedby={describedBy('formato')}>
                {formats.map((format) => <option key={format}>{format}</option>)}
              </select>
              {errorFor('formato')}
            </label>
          </div>
          <p className="consultation-price" id="consultation-price" aria-live="polite" aria-atomic="true">
            <span>Valor da consulta</span><strong>{consultationPrices[consultation]}</strong><small>Sem cobrança pelo site</small>
          </p>
        </div>
      </fieldset>

      <fieldset className="form-section" disabled={!ready} aria-labelledby="booking-date-title">
        <span className="form-number" aria-hidden="true">02</span>
        <div>
          <h2 id="booking-date-title">Sua preferência de horário</h2>
          <div className="field-grid">
            <label>
              Data preferida
              <input name="data" type="date" min={earliestDate} required onFocus={() => setEarliestDate(getTodayInMaceio())} aria-invalid={!!errors.data} aria-describedby={describedBy('data', 'date-guidance')} />
              {errorFor('data')}
            </label>
            <label>
              Período
              <select name="periodo" required aria-invalid={!!errors.periodo} aria-describedby={describedBy('periodo')}>
                {periods.map((period) => <option key={period}>{period}</option>)}
              </select>
              {errorFor('periodo')}
            </label>
          </div>
          <p className="field-note" id="date-guidance">De segunda a sexta, no horário de Maceió. A equipe confirma a data e o horário conforme disponibilidade.</p>
        </div>
      </fieldset>

      <fieldset className="form-section" disabled={!ready} aria-labelledby="booking-contact-title">
        <span className="form-number" aria-hidden="true">03</span>
        <div>
          <h2 id="booking-contact-title">Seus dados de contato</h2>
          <div className="field-grid">
            <label>
              Nome completo
              <input name="nome" type="text" autoComplete="name" maxLength={120} required placeholder="Como devemos chamar você?" aria-invalid={!!errors.nome} aria-describedby={describedBy('nome')} />
              {errorFor('nome')}
            </label>
            <label>
              Telefone / WhatsApp
              <input name="telefone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} required placeholder="DDD + número ou código do país" aria-invalid={!!errors.telefone} aria-describedby={describedBy('telefone')} />
              {errorFor('telefone')}
            </label>
            <label className="field-full">
              E-mail
              <input name="email" type="email" autoComplete="email" maxLength={254} required placeholder="voce@exemplo.com.br" aria-invalid={!!errors.email} aria-describedby={describedBy('email')} />
              {errorFor('email')}
            </label>
          </div>
          <div className="privacy-note">
            <strong>Proteção desde o primeiro contato.</strong>
            <p>Não envie documentos ou detalhes sensíveis nesta etapa. Os dados acima serão incluídos na mensagem de agendamento que você abrirá no WhatsApp.</p>
          </div>
          <label className="consent-field">
            <input name="consentimento" type="checkbox" required aria-invalid={!!errors.consentimento} aria-describedby={describedBy('consentimento')} />
            <span>Li e concordo com o <Link href="/termo-de-consulta-juridica" target="_blank" rel="noopener noreferrer">Termo de Consulta Jurídica (nova aba)</Link> e com a <Link href="/politicas-de-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade (nova aba)</Link>.</span>
          </label>
          {errorFor('consentimento')}
          <div className="booking-total">
            <div><span>Valor da consulta</span><strong>{consultationPrices[consultation]}</strong></div>
            <motion.button
              className="button button-gold"
              type="submit"
              disabled={!ready}
              whileHover={ready ? { scale: 1.03 } : undefined}
              whileTap={ready ? { scale: 0.97 } : undefined}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >Continuar no WhatsApp <span aria-hidden="true">↗</span></motion.button>
          </div>
          <p className="submit-status" role="status" aria-atomic="true">{submitStatus}</p>
          <p className="field-note">A consulta depende de confirmação da equipe. O site não realiza cobrança.</p>
        </div>
      </fieldset>
    </form>
  );
}
