import { useState, useEffect, useRef } from 'react'
import {
  Activity, DollarSign, Cpu, Megaphone, TrendingUp,
  ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle,
  Target, RotateCcw, BarChart3, Award, Zap, ArrowRight,
  Loader2, ShieldCheck, Lock, Crown,
} from 'lucide-react'
import Logo from './components/Logo'
import { T, FONTS } from './utils/tokens'
import { isPremium, hasUsedFreeTrial, markFreeTrialUsed } from './utils/subscription'

/* ─── STATIC DATA ──────────────────────────────────────────────────────────── */
const SECTION_KEYS = ['financial', 'operations', 'marketing', 'growth']

const SECTION_META = {
  financial:  { label: 'Financial Health',  Icon: DollarSign, color: T.accent,    tint: T.accentTint },
  operations: { label: 'Operations',         Icon: Cpu,         color: T.blue,      tint: T.blueTint   },
  marketing:  { label: 'Marketing',          Icon: Megaphone,   color: T.gold,      tint: T.goldTint   },
  growth:     { label: 'Growth',             Icon: TrendingUp,  color: T.accentMid, tint: T.accentTint },
}

const QUESTIONS = {
  financial: [
    { id: 'revenue',      label: 'What is your average monthly revenue?',              type: 'select',
      options: ['Below ₦100k', '₦100k – ₦500k', '₦500k – ₦2M', '₦2M – ₦10M', 'Above ₦10M'] },
    { id: 'expenses',     label: 'Do you track your expenses regularly?',               type: 'select',
      options: ['Never', 'Sometimes', 'Monthly', 'Weekly', 'Daily'] },
    { id: 'profit_aware', label: 'Do you know your current profit margin?',             type: 'select',
      options: ['No idea', 'Rough estimate', 'I know it exactly'] },
    { id: 'savings',      label: 'Do you save a portion of business revenue?',          type: 'select',
      options: ['No', 'Occasionally', 'Yes, consistently'] },
    { id: 'debt',         label: 'Does your business carry any debt or loans?',         type: 'select',
      options: ['Yes, struggling to pay', 'Yes, manageable', 'No debt at all'] },
  ],
  operations: [
    { id: 'staff',       label: 'How many people work in your business?',               type: 'select',
      options: ['Just me', '1–3', '4–10', '11–30', '30+'] },
    { id: 'processes',   label: 'Do you have documented processes or SOPs?',            type: 'select',
      options: ['Nothing written down', 'Some informal notes', 'Basic documentation', 'Full SOPs'] },
    { id: 'tools',       label: 'Which tools do you use to run your business?',         type: 'multicheck',
      options: ['Spreadsheets', 'WhatsApp', 'Accounting software', 'CRM', 'Project management app', 'None'] },
    { id: 'bottleneck',  label: 'What is your biggest operational challenge?',          type: 'select',
      options: ['Staff management', 'Customer delivery', 'Inventory', 'Cash flow timing', 'Communication', 'All of the above'] },
    { id: 'delegation',  label: 'Can your business run for a week without you?',        type: 'select',
      options: ['Absolutely not', 'Maybe barely', 'Yes with some check-ins', 'Yes completely'] },
  ],
  marketing: [
    { id: 'channels',      label: 'Where do most of your customers come from?',          type: 'multicheck',
      options: ['Word of mouth', 'Instagram', 'WhatsApp', 'Facebook', 'Google', 'Walk-in', 'Referral program'] },
    { id: 'posting_freq',  label: 'How often do you post on social media?',              type: 'select',
      options: ['Never', 'Rarely (once a month)', 'Weekly', '3–5x per week', 'Daily'] },
    { id: 'follow_up',     label: 'Do you follow up with past customers?',               type: 'select',
      options: ['Never', 'Sometimes if I remember', 'Yes, I have a system'] },
    { id: 'offer_clarity', label: 'Can a stranger understand what you sell in 10 seconds?', type: 'select',
      options: ['Probably not', 'Sort of', 'Yes, very clearly'] },
    { id: 'testimonials',  label: 'Do you collect and display customer reviews?',        type: 'select',
      options: ['No', 'Occasionally', 'Yes, consistently'] },
  ],
  growth: [
    { id: 'goals',       label: 'Do you have written business goals for this year?',    type: 'select',
      options: ['No goals', 'In my head only', 'Written but not reviewed', 'Written and reviewed regularly'] },
    { id: 'competition', label: 'How well do you know your competitors?',               type: 'select',
      options: ["I don't study them", 'I have a rough idea', 'I actively track them'] },
    { id: 'new_revenue', label: 'Have you added new revenue streams in the last 12 months?', type: 'select',
      options: ['No', 'Tried but failed', 'Yes, one new stream', 'Yes, multiple'] },
    { id: 'learning',    label: 'How do you invest in developing your business knowledge?', type: 'select',
      options: ["I don't", 'I read occasionally', 'Courses or mentorship regularly'] },
    { id: 'data',        label: 'Do you make decisions based on data or instinct?',     type: 'select',
      options: ['Pure instinct', 'Mix of both', 'Mostly data', 'Always data-driven'] },
  ],
}

const SCORE_MAP = {
  revenue:      { 'Below ₦100k': 1, '₦100k – ₦500k': 2, '₦500k – ₦2M': 3, '₦2M – ₦10M': 4, 'Above ₦10M': 5 },
  expenses:     { Never: 0, Sometimes: 1, Monthly: 2, Weekly: 3, Daily: 4 },
  profit_aware: { 'No idea': 0, 'Rough estimate': 2, 'I know it exactly': 4 },
  savings:      { No: 0, Occasionally: 2, 'Yes, consistently': 4 },
  debt:         { 'Yes, struggling to pay': 0, 'Yes, manageable': 2, 'No debt at all': 4 },
  staff:        { 'Just me': 1, '1–3': 2, '4–10': 3, '11–30': 4, '30+': 5 },
  processes:    { 'Nothing written down': 0, 'Some informal notes': 1, 'Basic documentation': 3, 'Full SOPs': 5 },
  bottleneck:   { 'All of the above': 0, 'Staff management': 1, 'Customer delivery': 2, Inventory: 2, 'Cash flow timing': 2, Communication: 3 },
  delegation:   { 'Absolutely not': 0, 'Maybe barely': 1, 'Yes with some check-ins': 3, 'Yes completely': 5 },
  posting_freq: { Never: 0, 'Rarely (once a month)': 1, Weekly: 2, '3–5x per week': 3, Daily: 4 },
  follow_up:    { Never: 0, 'Sometimes if I remember': 2, 'Yes, I have a system': 4 },
  offer_clarity:{ 'Probably not': 0, 'Sort of': 2, 'Yes, very clearly': 4 },
  testimonials: { No: 0, Occasionally: 2, 'Yes, consistently': 4 },
  goals:        { 'No goals': 0, 'In my head only': 1, 'Written but not reviewed': 2, 'Written and reviewed regularly': 4 },
  competition:  { "I don't study them": 0, 'I have a rough idea': 2, 'I actively track them': 4 },
  new_revenue:  { No: 0, 'Tried but failed': 1, 'Yes, one new stream': 3, 'Yes, multiple': 5 },
  learning:     { "I don't": 0, 'I read occasionally': 2, 'Courses or mentorship regularly': 4 },
  data:         { 'Pure instinct': 0, 'Mix of both': 2, 'Mostly data': 3, 'Always data-driven': 4 },
}

function computeSectionScore(section, answers) {
  const qs = QUESTIONS[section]
  let total = 0, max = 0
  qs.forEach(q => {
    if (q.type === 'multicheck') {
      const val = answers[q.id]
      if (Array.isArray(val)) total += Math.min(val.filter(v => v !== 'None').length * 1.5, 5)
      max += 5
    } else {
      const map = SCORE_MAP[q.id] || {}
      const val = answers[q.id]
      if (val !== undefined && map[val] !== undefined) total += map[val]
      const vals = Object.values(map)
      max += vals.length ? Math.max(...vals) : 5
    }
  })
  return Math.round((total / max) * 100)
}

function getScoreLabel(s) {
  if (s >= 80) return { text: 'Excellent',   color: T.accentLight }
  if (s >= 65) return { text: 'Good',        color: T.accentMid   }
  if (s >= 45) return { text: 'Fair',        color: T.gold        }
  return               { text: 'Needs Work', color: T.red         }
}

/* ─── COMPONENTS ───────────────────────────────────────────────────────────── */
function Tag({ children, color = T.accent, tint }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 4,
      background: tint || color + '1A',
      color, fontSize: 11, fontFamily: 'Lora, Georgia, serif',
      fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>{children}</span>
  )
}

function ScoreArc({ score, size = 150 }) {
  const r = size / 2 - 14
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const lbl  = getScoreLabel(score)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.faint} strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={lbl.color} strokeWidth={10}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(.4,0,.2,1)' }} />
        <text x={size/2} y={size/2-5} textAnchor="middle" fill={T.ink}
          style={{ fontSize: size * 0.24, fontFamily: 'Playfair Display', fontWeight: 700 }}>{score}</text>
        <text x={size/2} y={size/2+14} textAnchor="middle" fill={T.muted}
          style={{ fontSize: 11, fontFamily: 'Lora' }}>/100</text>
      </svg>
      <span style={{ fontSize: 12, fontFamily: 'Lora', fontWeight: 600, color: lbl.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {lbl.text}
      </span>
    </div>
  )
}

function ScoreBar({ label, score, Icon, color }) {
  const lbl = getScoreLabel(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={color} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontFamily: 'Lora', fontWeight: 500, color: T.inkMid }}>{label}</span>
          <span style={{ fontSize: 13, fontFamily: 'Lora', fontWeight: 600, color: lbl.color }}>{score}/100</span>
        </div>
        <div style={{ height: 5, background: T.faint, borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 3, transition: 'width 1.5s cubic-bezier(.4,0,.2,1)' }} />
        </div>
      </div>
    </div>
  )
}

function Stepper({ currentStep }) {
  const labels = ['Financial', 'Operations', 'Marketing', 'Growth']
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {labels.map((label, i) => {
        const idx = i + 1, done = currentStep > idx, active = currentStep === idx
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? T.accent : active ? T.accentTint : T.faint,
                border: `2px solid ${done ? T.accent : active ? T.accent : T.border}`,
                transition: 'all 0.3s',
              }}>
                {done
                  ? <CheckCircle2 size={13} color="#fff" strokeWidth={2.5} />
                  : <span style={{ fontSize: 11, fontFamily: 'Lora', fontWeight: 600, color: active ? T.accent : T.muted }}>{idx}</span>
                }
              </div>
              <span style={{ fontSize: 10, fontFamily: 'Lora', letterSpacing: '0.04em', color: active ? T.accent : T.muted, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < 3 && <div style={{ width: 36, height: 2, margin: '0 3px', marginBottom: 18, background: done ? T.accent : T.border, transition: 'background 0.4s' }} />}
          </div>
        )
      })}
    </div>
  )
}

const css = `
  ${FONTS}
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes pulse  { 0%,100% { transform:scale(1); } 50% { transform:scale(1.02); } }

  .fu { animation: fadeUp 0.45s ease forwards; }

  .opt {
    display: block; width: 100%; text-align: left; cursor: pointer;
    border: 1.5px solid ${T.border}; background: ${T.surface}; color: ${T.inkMid};
    border-radius: 8px; padding: 13px 18px;
    font-family: Lora, Georgia, serif; font-size: 15px;
    transition: border-color 0.15s, background 0.15s, color 0.15s; line-height: 1.45;
  }
  .opt:hover { border-color: ${T.accent}; background: ${T.accentTint}; color: ${T.accent}; }
  .opt.on   { border-color: ${T.accent}; background: ${T.accentTint}; color: ${T.accent}; font-weight: 500; }

  .chip {
    cursor: pointer; border: 1.5px solid ${T.border};
    background: ${T.surface}; color: ${T.inkMid};
    border-radius: 6px; padding: 8px 14px;
    font-family: Lora, Georgia, serif; font-size: 13px;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .chip:hover { border-color: ${T.accent}; background: ${T.accentTint}; color: ${T.accent}; }
  .chip.on   { border-color: ${T.accent}; background: ${T.accentTint}; color: ${T.accent}; font-weight: 500; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${T.accent}; color: #fff; border: none; border-radius: 8px;
    padding: 13px 28px; font-family: Lora, Georgia, serif;
    font-size: 15px; font-weight: 600; cursor: pointer;
    transition: background 0.18s, transform 0.15s; letter-spacing: 0.01em;
    box-shadow: 0 4px 16px ${T.accent}40;
  }
  .btn-primary:hover:not(:disabled) { background: ${T.accentMid}; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    background: transparent; border: 1.5px solid ${T.border}; color: ${T.muted};
    border-radius: 8px; padding: 12px 22px;
    font-family: Lora, Georgia, serif; font-size: 14px;
    cursor: pointer; transition: border-color 0.18s, color 0.18s;
  }
  .btn-ghost:hover { border-color: ${T.borderStrong}; color: ${T.inkMid}; }

  .field {
    background: ${T.surface}; border: 1.5px solid ${T.border}; color: ${T.ink};
    border-radius: 8px; padding: 13px 16px;
    font-family: Lora, Georgia, serif; font-size: 15px;
    width: 100%; outline: none; transition: border-color 0.18s; line-height: 1.4;
  }
  .field:focus { border-color: ${T.accent}; }
  .field::placeholder { color: ${T.muted}; }

  .card {
    background: ${T.surface}; border: 1px solid ${T.border};
    border-radius: 12px; overflow: hidden;
  }

  @media (max-width: 600px) {
    .stepper-wrap { display: none !important; }
    .grid2        { grid-template-columns: 1fr !important; }
    .hero-h1      { font-size: 34px !important; line-height: 1.12 !important; }
    .indent       { padding-left: 0 !important; }
  }
`

export default function AuditEngine({ nav }) {
  const [step,      setStep]      = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [bizName,   setBizName]   = useState('')
  const [industry,  setIndustry]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [report,    setReport]    = useState(null)
  const [scores,    setScores]    = useState({})
  const [error,     setError]     = useState('')
  const reportRef = useRef(null)
  const premium   = isPremium()
  const trialUsed = hasUsedFreeTrial()
  const TOTAL = 6

  useEffect(() => {
    if (step === TOTAL - 1 && reportRef.current) {
      setTimeout(() => reportRef.current.scrollIntoView({ behavior: 'smooth' }), 150)
    }
  }, [step])

  function answer(qid, value)   { setAnswers(p => ({ ...p, [qid]: value })); setError('') }
  function toggleMulti(qid, v)  {
    setAnswers(p => {
      const cur = p[qid] || []
      return { ...p, [qid]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] }
    })
    setError('')
  }

  function allAnswered(section) {
    return QUESTIONS[section].every(q => {
      const a = answers[q.id]
      return q.type === 'multicheck' ? Array.isArray(a) && a.length > 0 : a !== undefined && a !== ''
    })
  }

  async function generateReport() {
    setLoading(true); setError('')

    const sectionScores = {
      financial:  computeSectionScore('financial',  answers),
      operations: computeSectionScore('operations', answers),
      marketing:  computeSectionScore('marketing',  answers),
      growth:     computeSectionScore('growth',     answers),
    }
    const overall = Math.round(Object.values(sectionScores).reduce((a, b) => a + b, 0) / 4)
    setScores({ ...sectionScores, overall })

    // If free trial already used and not premium → show scores only
    if (!premium && trialUsed) {
      setStep(TOTAL - 1)
      setLoading(false)
      return
    }

    try {
      const res  = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: bizName, industry, answers, sectionScores, overall }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Server ${res.status}`)
      setReport(data.report)
      if (!premium) markFreeTrialUsed()
      setStep(TOTAL - 1)
    } catch (e) {
      setError(`Report generation failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  function resetAll() {
    setStep(0); setAnswers({}); setReport(null)
    setScores({}); setBizName(''); setIndustry(''); setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sectionKey = SECTION_KEYS[step - 1]
  const showScoresOnly = !premium && trialUsed && !report

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'Lora, Georgia, serif', color: T.ink }}>
      <style>{css}</style>

      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${T.border}`, padding: '14px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, background: T.bg + 'F4',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <button onClick={() => nav('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Logo size="sm" />
        </button>

        {step > 0 && step < TOTAL - 1 && (
          <div className="stepper-wrap">
            <Stepper currentStep={step} />
          </div>
        )}

        {!premium && (
          <button
            onClick={() => nav('subscribe')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: T.goldTint, border: `1px solid ${T.gold}40`,
              borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
              fontFamily: 'Lora', fontSize: 12, fontWeight: 600, color: T.gold,
            }}
          >
            <Crown size={13} strokeWidth={2} /> Upgrade to Pro
          </button>
        )}
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '52px 24px 96px' }}>

        {/* ── INTRO ── */}
        {step === 0 && (
          <div className="fu">
            <Tag color={T.accent} tint={T.accentTint}>
              <ShieldCheck size={11} strokeWidth={2.5} />
              {premium ? ' Premium Audit' : ' Free Business Audit'}
            </Tag>

            <h1 className="hero-h1" style={{
              fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 800,
              fontSize: 50, lineHeight: 1.07, letterSpacing: '-0.03em',
              marginTop: 18, marginBottom: 18, color: T.ink,
            }}>
              Know exactly where<br />
              <span style={{
                background: `linear-gradient(135deg, ${T.accent}, ${T.accentLight})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                your business stands.
              </span>
            </h1>

            <p style={{ color: T.muted, fontSize: 17, lineHeight: 1.85, marginBottom: 36, maxWidth: 500 }}>
              Answer 20 targeted questions. Get health scores across Finance, Operations, Marketing
              and Growth — with an AI action plan{premium ? '.' : ' on paid plans.'} Under 5 minutes.
            </p>

            {!premium && trialUsed && (
              <div style={{
                background: T.goldTint, border: `1px solid ${T.gold}40`,
                borderRadius: 12, padding: '16px 20px', marginBottom: 28,
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <Crown size={18} color={T.gold} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.gold, marginBottom: 4 }}>
                    Free trial used
                  </div>
                  <div style={{ fontSize: 13, color: T.gold + 'CC', lineHeight: 1.6 }}>
                    You've used your free audit this month. You can still run audits and see scores,
                    but the full AI action report requires a subscription.
                    <span
                      onClick={() => nav('subscribe')}
                      style={{ fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', marginLeft: 4 }}
                    >
                      Upgrade for ₦3,500/month →
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 36 }}>
              {[
                [DollarSign, 'Financial Health',   'Margins, cash flow, debt exposure'],
                [Cpu,        'Operational Clarity', 'Processes, delegation, bottlenecks'],
                [Megaphone,  'Marketing Strength',  'Channels, reach, retention'],
                [TrendingUp, 'Growth Readiness',    'Goals, competition, data use'],
              ].map(([Icon, title, desc]) => (
                <div key={title} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: T.accentTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color={T.accent} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 14, color: T.ink, marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.55 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 18, color: T.ink }}>
                  Tell us about your business
                </div>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input className="field" placeholder="Business name (optional)" value={bizName} onChange={e => setBizName(e.target.value)} />
                <input className="field" placeholder="Industry — e.g. Fashion, Food, Logistics, Tech, Healthcare" value={industry} onChange={e => setIndustry(e.target.value)} />
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep(1)}>
              Begin Audit <ArrowRight size={16} strokeWidth={2} />
            </button>
            <p style={{ marginTop: 14, fontSize: 12, color: T.muted, fontStyle: 'italic' }}>
              No sign-up required. Takes approximately 4–6 minutes.
            </p>
          </div>
        )}

        {/* ── QUESTIONS ── */}
        {step >= 1 && step <= 4 && (() => {
          const meta = SECTION_META[sectionKey]
          const qs   = QUESTIONS[sectionKey]
          const { Icon } = meta
          return (
            <div className="fu">
              <Tag color={meta.color} tint={meta.tint}>
                <Icon size={11} strokeWidth={2.5} /> {meta.label}
              </Tag>

              <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 32, marginTop: 12, marginBottom: 6, letterSpacing: '-0.02em', color: T.ink }}>
                {meta.label} Assessment
              </h2>
              <p style={{ color: T.muted, fontSize: 14, marginBottom: 44, fontStyle: 'italic' }}>
                Section {step} of 4 — {qs.length} questions
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
                {qs.map((q, qi) => (
                  <div key={q.id} className="fu" style={{ animationDelay: `${qi * 0.06}s` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 5, background: meta.color + '18', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 11, fontFamily: 'Lora', fontWeight: 700, color: meta.color }}>{qi + 1}</span>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 500, color: T.ink, lineHeight: 1.5 }}>{q.label}</div>
                    </div>

                    {q.type === 'select' && (
                      <div className="indent" style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 36 }}>
                        {q.options.map(opt => (
                          <button key={opt} className={`opt${answers[q.id] === opt ? ' on' : ''}`} onClick={() => answer(q.id, opt)}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === 'multicheck' && (
                      <div className="indent" style={{ paddingLeft: 36 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                          {q.options.map(opt => {
                            const on = (answers[q.id] || []).includes(opt)
                            return (
                              <button key={opt} className={`chip${on ? ' on' : ''}`} onClick={() => toggleMulti(q.id, opt)}>
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                        <p style={{ fontSize: 12, color: T.muted, fontStyle: 'italic' }}>Select all that apply</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 52, paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>
                  <ChevronLeft size={16} strokeWidth={2} /> Back
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  {step < 4
                    ? (
                      <button className="btn-primary" disabled={!allAnswered(sectionKey)} onClick={() => setStep(s => s + 1)}>
                        Next Section <ChevronRight size={16} strokeWidth={2} />
                      </button>
                    ) : (
                      <button className="btn-primary" disabled={!allAnswered(sectionKey) || loading} onClick={generateReport}>
                        {loading
                          ? <><Loader2 size={16} strokeWidth={2} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating…</>
                          : <>Generate My Report <ArrowRight size={16} strokeWidth={2} /></>
                        }
                      </button>
                    )
                  }
                  {!allAnswered(sectionKey) && (
                    <span style={{ fontSize: 12, color: T.muted, fontStyle: 'italic' }}>Answer all questions to continue</span>
                  )}
                  {error && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 16px', background: T.redTint, border: `1px solid ${T.red}33`, borderRadius: 8, maxWidth: 360 }}>
                      <AlertTriangle size={15} color={T.red} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 13, color: T.red, lineHeight: 1.55 }}>{error}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {/* Loading overlay */}
        {loading && (
          <div style={{ position: 'fixed', inset: 0, background: T.bg + 'EE', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(10px)' }}>
            <div className="card" style={{ padding: '40px 52px', textAlign: 'center', maxWidth: 360 }}>
              <Loader2 size={36} color={T.accent} strokeWidth={1.5} style={{ animation: 'spin 0.9s linear infinite', marginBottom: 20 }} />
              <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 20, color: T.ink, marginBottom: 10 }}>
                Auditing your business
              </div>
              <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7 }}>
                Our AI is analysing your responses and preparing a personalised Nigerian-context report.
              </p>
            </div>
          </div>
        )}

        {/* ── REPORT ── */}
        {step === TOTAL - 1 && (
          <div className="fu" ref={reportRef}>
            <div style={{ marginBottom: 36 }}>
              <Tag color={T.accent} tint={T.accentTint}>
                <CheckCircle2 size={11} strokeWidth={2.5} /> Audit Complete
              </Tag>
              <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', marginTop: 14, marginBottom: 8, color: T.ink }}>
                {bizName ? `${bizName} — ` : ''}Business Health Report
              </h2>
              <p style={{ color: T.muted, fontSize: 13, fontStyle: 'italic' }}>
                {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                {industry && ` · ${industry}`}
              </p>
            </div>

            {/* Health Scores */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={15} color={T.accent} strokeWidth={1.75} />
                <span style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 12, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Health Scores
                </span>
              </div>
              <div style={{ padding: '28px 22px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                  <ScoreArc score={scores.overall ?? 0} size={155} />
                  <div style={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: 16, color: T.inkMid, marginTop: 10 }}>
                    Overall Health Score
                  </div>
                </div>
                <div style={{ height: 1, background: T.border, marginBottom: 24 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {SECTION_KEYS.map(k => (
                    <ScoreBar key={k} label={SECTION_META[k].label} score={scores[k] ?? 0} Icon={SECTION_META[k].Icon} color={SECTION_META[k].color} />
                  ))}
                </div>
              </div>
            </div>

            {/* Premium gate — show if no report */}
            {!report && (
              <div style={{
                background: `linear-gradient(135deg, ${T.accent}08, ${T.accentTint})`,
                border: `2px solid ${T.accent}30`,
                borderRadius: 16, padding: '36px 32px', marginBottom: 16,
                textAlign: 'center',
                animation: 'pulse 2.5s ease-in-out infinite',
              }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.accentTint, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Lock size={24} color={T.accent} strokeWidth={1.75} />
                </div>
                <h3 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 26, color: T.ink, marginBottom: 12 }}>
                  Your AI Report is Ready to Unlock
                </h3>
                <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.85, maxWidth: 440, margin: '0 auto 28px' }}>
                  You've completed the audit. Subscribe to get your full AI-generated action plan —
                  strengths, risks, 30-day priority actions, and section-by-section recommendations.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360, margin: '0 auto' }}>
                  {[
                    'AI-generated insights for each section',
                    'Your #1 priority action for the next 30 days',
                    'Specific strengths and risk warnings',
                    'Actionable steps for Finance, Operations, Marketing & Growth',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
                      <CheckCircle2 size={14} color={T.accentLight} strokeWidth={2} />
                      <span style={{ fontSize: 14, color: T.inkMid }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => nav('subscribe')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: T.accent, color: '#fff', border: 'none', borderRadius: 10,
                      padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'Lora', boxShadow: `0 4px 20px ${T.accent}40`,
                    }}
                  >
                    <Crown size={16} strokeWidth={2} /> Unlock Full Report — from ₦3,500
                  </button>
                </div>
                <p style={{ fontSize: 12, color: T.muted, marginTop: 12, fontStyle: 'italic' }}>
                  7-day money-back guarantee. Paystack-secured payment.
                </p>
              </div>
            )}

            {/* Full report (premium) */}
            {report && (
              <>
                {/* Executive Summary */}
                <div className="card" style={{ marginBottom: 16 }}>
                  <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BarChart3 size={15} color={T.accent} strokeWidth={1.75} />
                    <span style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 12, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Executive Summary
                    </span>
                  </div>
                  <div style={{ padding: '24px 22px' }}>
                    <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 22, color: T.ink, marginBottom: 14, lineHeight: 1.35 }}>
                      {report.headline}
                    </div>
                    <p style={{ color: T.inkMid, fontSize: 15, lineHeight: 1.9 }}>{report.summary}</p>
                  </div>
                </div>

                {/* Strengths & Risks */}
                <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                  <div className="card">
                    <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Award size={14} color={T.accentLight} strokeWidth={2} />
                      <span style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 11, color: T.accentLight, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Strengths</span>
                    </div>
                    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {report.strengths?.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <CheckCircle2 size={14} color={T.accentLight} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 13, color: T.inkMid, lineHeight: 1.6 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card">
                    <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertTriangle size={14} color={T.gold} strokeWidth={2} />
                      <span style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 11, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Risks</span>
                    </div>
                    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {report.warnings?.map((w, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <AlertTriangle size={14} color={T.gold} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 13, color: T.inkMid, lineHeight: 1.6 }}>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Priority Action */}
                <div style={{ background: T.accentTint, border: `1.5px solid ${T.accent}33`, borderRadius: 12, padding: '22px 26px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Target size={15} color={T.accent} strokeWidth={2} />
                    <span style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 11, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                      Priority Action — Next 30 Days
                    </span>
                  </div>
                  <p style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 18, color: T.accent, lineHeight: 1.55 }}>
                    {report.top_priority}
                  </p>
                </div>

                {/* Section breakdowns */}
                {SECTION_KEYS.map(key => {
                  const sec = report[key]; const meta = SECTION_META[key]; const { Icon } = meta
                  if (!sec) return null
                  return (
                    <div key={key} className="card" style={{ marginBottom: 12 }}>
                      <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 7, background: meta.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={15} color={meta.color} strokeWidth={1.75} />
                          </div>
                          <span style={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: 16, color: T.ink }}>{meta.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <span style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 22, color: meta.color }}>{scores[key] ?? 0}</span>
                          <span style={{ fontSize: 12, color: T.muted }}>/100</span>
                        </div>
                      </div>
                      <div style={{ padding: '20px 22px' }}>
                        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.85, marginBottom: 18, fontStyle: 'italic' }}>{sec.insight}</p>
                        <div style={{ height: 1, background: T.border, marginBottom: 16 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                            Recommended Actions
                          </div>
                          {sec.actions?.map((a, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                              <div style={{ width: 20, height: 20, borderRadius: 4, background: meta.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                <span style={{ fontSize: 10, fontFamily: 'Lora', fontWeight: 700, color: meta.color }}>{i + 1}</span>
                              </div>
                              <span style={{ fontSize: 14, color: T.inkMid, lineHeight: 1.65 }}>{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            {/* Restart */}
            <div style={{ textAlign: 'center', marginTop: 56, paddingTop: 32, borderTop: `1px solid ${T.border}` }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.accentTint, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Zap size={20} color={T.accent} strokeWidth={1.75} />
              </div>
              <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 20, color: T.ink, marginBottom: 8 }}>
                Ready to re-assess?
              </div>
              <p style={{ color: T.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
                Run the audit again after implementing changes to track your progress over time.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-ghost" onClick={resetAll}>
                  <RotateCcw size={15} strokeWidth={2} /> Start New Audit
                </button>
                {!premium && (
                  <button className="btn-primary" onClick={() => nav('subscribe')}>
                    <Crown size={15} strokeWidth={2} /> Upgrade to Pro
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
