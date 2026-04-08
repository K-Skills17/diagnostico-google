import { useState } from 'react';
import { sendToSheet } from '../utils/sheets';

export default function TeaserGate({ results, onSubmit }) {
  const [form, setForm] = useState({
    nome: '',
    clinica: '',
    email: '',
    whatsapp: '',
    cidade: '',
  });
  const [sending, setSending] = useState(false);

  const isValid = form.nome && form.clinica && form.email;

  const circumference = 2 * Math.PI * 45;
  const scoreOffset = circumference - (results.totalScore / 100) * circumference;

  const getBarColor = (percent) => {
    if (percent <= 30) return '#E74C3C';
    if (percent <= 50) return '#E67E22';
    if (percent <= 70) return '#F39C12';
    return '#27AE60';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || sending) return;
    setSending(true);

    // Send lead + score data to Google Sheets
    await sendToSheet({
      ...form,
      totalScore: results.totalScore,
      grade: results.gradeLabel,
      ...(results.answers || {}),
    });

    setSending(false);
    onSubmit(form);
  };

  return (
    <div className="teaser-page">
      <div className="container">
        <div className="progress-bar">
          <div className="progress-step active" />
          <div className="progress-step active" />
          <div className="progress-step active" />
          <div className="progress-step" />
        </div>

        <div className="teaser-header fade-up">
          <h2>Seu Diagnóstico Está Pronto!</h2>
          <p>Veja seu score e desbloqueie o plano de ação completo.</p>
        </div>

        {/* Score gauge */}
        <div className="score-gauge-card fade-up fade-up-delay-1">
          <svg width="160" height="160" viewBox="0 0 100 100" className="score-ring">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E8E4DC" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={results.gradeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={scoreOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="score-center">
            <div className="score-number" style={{ color: results.gradeColor }}>{results.totalScore}</div>
            <div className="score-max">/100</div>
          </div>
          <div className="score-grade" style={{ color: results.gradeColor }}>
            {results.gradeLabel}
          </div>
        </div>

        {/* Category scores (visible) */}
        <div className="teaser-categories fade-up fade-up-delay-2">
          {results.sectionScores.map((s) => (
            <div className="section-score-card" key={s.id}>
              <div className="section-score-header">
                <span>{s.title}</span>
                <span style={{ color: getBarColor(s.percent), fontWeight: 700 }}>{s.score}/{s.maxPoints}</span>
              </div>
              <div className="section-bar-track">
                <div
                  className="section-bar-fill"
                  style={{ width: `${s.percent}%`, background: getBarColor(s.percent) }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Blurred action plan preview */}
        <div className="teaser-blurred fade-up fade-up-delay-3">
          <div className="blurred-overlay">
            <div className="blurred-content">
              <h3>Plano de Ação Prioritário</h3>
              <div className="blurred-item">1. Otimize suas fotos de perfil e capa para atrair mais cliques</div>
              <div className="blurred-item">2. Responda todas as avaliações para melhorar o engajamento</div>
              <div className="blurred-item">3. Atualize horários e informações de contato regularmente</div>
            </div>
            <div className="blurred-lock">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Preencha seus dados para desbloquear</span>
            </div>
          </div>
        </div>

        {/* Lead capture form */}
        <div className="teaser-gate fade-up fade-up-delay-4">
          <h3>Desbloqueie Seu Plano de Ação Completo</h3>
          <p>Preencha seus dados para ver as recomendações detalhadas e receber um link compartilhável do resultado.</p>

          <form className="lead-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Nome da clínica"
              value={form.clinica}
              onChange={(e) => setForm({ ...form, clinica: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="WhatsApp (opcional)"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cidade (opcional)"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            />
            <button type="submit" className="btn-primary" disabled={!isValid || sending}>
              {sending ? 'Enviando...' : 'Ver Resultado Completo'}
            </button>
          </form>
        </div>

        <div className="footer">
          Ferramenta gratuita por{' '}
          <a href="https://lkdigital.odo.br" target="_blank" rel="noopener noreferrer">
            LK Digital
          </a>{' '}
          — Sistemas que funcionam para dentistas
        </div>
      </div>
    </div>
  );
}
