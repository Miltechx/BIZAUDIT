import { useState } from 'react'
import {
  Activity, DollarSign, Cpu, Megaphone, TrendingUp,
  CheckCircle2, ArrowRight, ChevronDown, ChevronUp,
  Star, Users, BarChart3, Shield, Zap, Award,
  Phone, Mail, MapPin, Menu, X,
} from 'lucide-react'
import Logo from '../components/Logo'
import { T, FONTS } from '../utils/tokens'
import { PLANS } from '../utils/subscription'

const css = `
  ${FONTS}
  @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse    { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
  @keyframes float    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes shimmer  { 0% { background-position:200% center; } 100% { background-position:-200% center; } }

  .fu  { animation: fadeUp 0.55s ease both; }
  .fu1 { animation: fadeUp 0.55s 0.1s ease both; }
  .fu2 { animation: fadeUp 0.55s 0.2s ease both; }
  .fu3 { animation: fadeUp 0.55s 0.3s ease both; }

  .btn-cta {
    display: inline-flex; align-items: center; gap: 9px;
    background: ${T.accent}; color: #fff; border: none; border-radius: 10px;
    padding: 15px 30px; font-family: Lora, Georgia, serif;
    font-size: 16px; font-weight: 600; cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    letter-spacing: 0.01em; box-shadow: 0 4px 20px ${T.accent}40;
  }
  .btn-cta:hover { background: ${T.accentMid}; transform: translateY(-2px); box-shadow: 0 8px 30px ${T.accent}50; }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; border: 2px solid ${T.border}; color: ${T.ink};
    border-radius: 10px; padding: 14px 28px;
    font-family: Lora, Georgia, serif; font-size: 15px; font-weight: 500;
    cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .btn-outline:hover { border-color: ${T.accent}; color: ${T.accent}; }

  .nav-link {
    font-family: Lora, Georgia, serif; font-size: 14px; font-weight: 500;
    color: ${T.inkMid}; text-decoration: none; cursor: pointer;
    transition: color 0.15s; padding: 4px 0;
  }
  .nav-link:hover { color: ${T.accent}; }

  .feature-card {
    background: ${T.surface}; border: 1px solid ${T.border};
    border-radius: 16px; padding: 28px 24px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .feature-card:hover {
    border-color: ${T.accent}50;
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    transform: translateY(-3px);
  }

  .plan-card {
    background: ${T.surface}; border: 2px solid ${T.border};
    border-radius: 20px; padding: 36px 32px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    position: relative;
  }
  .plan-card:hover { border-color: ${T.accentLight}; transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }
  .plan-card.popular { border-color: ${T.accent}; box-shadow: 0 8px 40px ${T.accent}25; }

  .step-num {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, ${T.accent}, ${T.accentMid});
    display: flex; align-items: center; justify-content: center;
    font-family: Playfair Display, Georgia, serif; font-weight: 800;
    font-size: 22px; color: #fff; flex-shrink: 0;
    box-shadow: 0 4px 16px ${T.accent}40;
  }

  .testimonial-card {
    background: ${T.surface}; border: 1px solid ${T.border};
    border-radius: 16px; padding: 28px;
  }

  .faq-item {
    border-bottom: 1px solid ${T.border}; padding: 20px 0; cursor: pointer;
  }
  .faq-item:last-child { border-bottom: none; }

  .stat-box {
    text-align: center; padding: 28px 20px;
  }

  @media (max-width: 768px) {
    .hero-grid   { grid-template-columns: 1fr !important; }
    .features-grid { grid-template-columns: 1fr 1fr !important; }
    .plans-grid  { grid-template-columns: 1fr !important; }
    .steps-grid  { grid-template-columns: 1fr !important; }
    .stats-grid  { grid-template-columns: 1fr 1fr !important; }
    .hide-mobile { display: none !important; }
    .hero-h1     { font-size: 36px !important; }
  }
  @media (max-width: 480px) {
    .features-grid { grid-template-columns: 1fr !important; }
    .stats-grid    { grid-template-columns: 1fr !important; }
  }
`

const TESTIMONIALS = [
  {
    name: 'Chidinma Okafor',
    role: 'Fashion entrepreneur, Lagos',
    stars: 5,
    text: 'I always thought I was managing my business well. BizHealth showed me I had a serious cash flow gap I was ignoring. Three months later, I\'ve fixed it and my margins are up 18%.',
  },
  {
    name: 'Emeka Eze',
    role: 'Restaurant owner, Abuja',
    stars: 5,
    text: 'The report was brutally honest and surprisingly specific to my situation. The priority action it gave me was exactly what I needed to hear. Worth every kobo.',
  },
  {
    name: 'Adebola Martins',
    role: 'Logistics SME, Port Harcourt',
    stars: 5,
    text: 'Finally a business tool that understands the Nigerian market. No fluff, no generic Western advice — real, actionable steps for running a business here.',
  },
]

const FAQS = [
  {
    q: 'Is this really free to try?',
    a: 'Yes. Your first full audit is completely free — no credit card required. You get scores for all four business sections. Subscribing unlocks the full AI-generated action report.',
  },
  {
    q: 'How accurate is the AI analysis?',
    a: 'The AI is trained to understand Nigerian SME challenges specifically — things like cash flow in an inflationary economy, WhatsApp-based sales, and informal operations. It\'s not a generic global tool.',
  },
  {
    q: 'How do I pay? Do you accept bank transfer?',
    a: 'We use Paystack, which accepts all Nigerian bank cards, bank transfers (USSD), and mobile money. Payment takes under 60 seconds.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes. You can cancel anytime from your account. Your subscription remains active until the end of the billing period — no penalties, no confusion.',
  },
  {
    q: 'Is my business data secure?',
    a: 'Your audit responses are only used to generate your report. We do not sell data to third parties. All API calls are encrypted. See our full Terms & Privacy policy for details.',
  },
  {
    q: 'What if I\'m not satisfied?',
    a: 'Contact us within 7 days of your first paid audit and we\'ll issue a full refund — no questions asked.',
  },
]

export default function Landing({ nav }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  function scrollToSection(id) {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'Lora, Georgia, serif', color: T.ink }}>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: T.bg + 'F0', backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${T.border}`,
        padding: '0 32px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => nav('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Logo size="sm" />
        </button>

        {/* desktop links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[['Features', 'features'], ['How It Works', 'how'], ['Pricing', 'pricing'], ['About', 'about']].map(([label, id]) => (
            <span key={id} className="nav-link" onClick={() => scrollToSection(id)}>{label}</span>
          ))}
        </div>

        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-outline" style={{ padding: '9px 20px', fontSize: 14 }} onClick={() => nav('subscribe')}>
            Pricing
          </button>
          <button className="btn-cta" style={{ padding: '10px 22px', fontSize: 14 }} onClick={() => nav('audit')}>
            Free Audit <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>

        {/* mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(p => !p)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={24} color={T.ink} /> : <Menu size={24} color={T.ink} />}
        </button>
      </nav>

      {/* mobile menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 190,
          background: T.surface, borderBottom: `1px solid ${T.border}`,
          padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {[['Features', 'features'], ['How It Works', 'how'], ['Pricing', 'pricing'], ['About', 'about']].map(([label, id]) => (
            <span key={id} className="nav-link" style={{ fontSize: 16 }} onClick={() => scrollToSection(id)}>{label}</span>
          ))}
          <button className="btn-cta" onClick={() => { setMobileMenuOpen(false); nav('audit') }}>
            Start Free Audit <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ padding: '80px 32px 72px', maxWidth: 1160, margin: '0 auto' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 64, alignItems: 'center' }}>
          <div>
            {/* badge */}
            <div className="fu" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: T.accentTint, border: `1px solid ${T.accent}40`,
              borderRadius: 100, padding: '6px 16px', marginBottom: 28,
            }}>
              <Zap size={12} color={T.accent} strokeWidth={2.5} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.accent, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Built for Nigerian SMEs
              </span>
            </div>

            <h1 className="fu1 hero-h1" style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: 800, fontSize: 58, lineHeight: 1.05,
              letterSpacing: '-0.03em', color: T.ink, marginBottom: 24,
            }}>
              Know exactly where<br />
              <span style={{
                background: `linear-gradient(135deg, ${T.accent}, ${T.accentLight})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                your business stands.
              </span>
            </h1>

            <p className="fu2" style={{
              color: T.muted, fontSize: 18, lineHeight: 1.85,
              marginBottom: 40, maxWidth: 520, fontWeight: 400,
            }}>
              20 targeted questions. An AI-generated health score across Finance, Operations,
              Marketing and Growth. A prioritised action plan — specific to your business,
              in under 5 minutes.
            </p>

            <div className="fu3" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button className="btn-cta" onClick={() => nav('audit')}>
                Start Free Audit <ArrowRight size={16} strokeWidth={2} />
              </button>
              <button className="btn-outline" onClick={() => scrollToSection('pricing')}>
                View Pricing
              </button>
            </div>

            {/* social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 32 }}>
              <div style={{ display: 'flex' }}>
                {['#C8C5BC', '#B0ADA5', '#9A978F', '#888480'].map((c, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: c, border: '2px solid #fff',
                    marginLeft: i > 0 ? -8 : 0,
                  }} />
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <span style={{ fontSize: 12, color: T.muted }}>
                  Trusted by 400+ Nigerian business owners
                </span>
              </div>
            </div>
          </div>

          {/* Hero visual card */}
          <div className="fu2 hide-mobile" style={{ position: 'relative' }}>
            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 20, padding: 28,
              boxShadow: '0 24px 80px rgba(0,0,0,0.1)',
            }}>
              <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 16, color: T.ink, marginBottom: 20 }}>
                Sample Health Report
              </div>

              {/* Score arc mock */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <svg width={130} height={130}>
                  <circle cx={65} cy={65} r={52} fill="none" stroke={T.faint} strokeWidth={10} />
                  <circle cx={65} cy={65} r={52} fill="none" stroke={T.accentLight} strokeWidth={10}
                    strokeDasharray="245 327" strokeLinecap="round"
                    transform="rotate(-90 65 65)" />
                  <text x={65} y={60} textAnchor="middle" fill={T.ink}
                    style={{ fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 700 }}>74</text>
                  <text x={65} y={77} textAnchor="middle" fill={T.muted}
                    style={{ fontSize: 11, fontFamily: 'Lora' }}>/100</text>
                </svg>
              </div>

              {[
                { label: 'Financial Health', score: 68, color: T.accent },
                { label: 'Operations',       score: 82, color: T.blue },
                { label: 'Marketing',        score: 55, color: T.gold },
                { label: 'Growth',           score: 71, color: T.accentMid },
              ].map(({ label, score, color }) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: T.muted, fontFamily: 'Lora' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color, fontFamily: 'Lora' }}>{score}</span>
                  </div>
                  <div style={{ height: 5, background: T.faint, borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}

              <div style={{
                marginTop: 20, padding: '14px 16px',
                background: T.accentTint, borderRadius: 10,
                border: `1px solid ${T.accent}30`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: T.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Top Priority
                </div>
                <div style={{ fontSize: 13, color: T.accent, fontWeight: 500, lineHeight: 1.5 }}>
                  Open a dedicated business account and start separating personal and business funds this week.
                </div>
              </div>
            </div>

            {/* floating badge */}
            <div style={{
              position: 'absolute', top: -14, right: -14,
              background: T.accent, color: '#fff', borderRadius: 100,
              padding: '7px 14px', fontSize: 11, fontWeight: 600,
              fontFamily: 'Lora', letterSpacing: '0.05em',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              animation: 'float 3s ease-in-out infinite',
            }}>
              ✓ Free first audit
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: T.surface }}>
        <div className="stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          maxWidth: 1160, margin: '0 auto',
        }}>
          {[
            ['400+', 'Business owners audited'],
            ['4',    'Health dimensions assessed'],
            ['< 5min', 'Time to complete'],
            ['₦0',  'Cost for first audit'],
          ].map(([num, label], i) => (
            <div key={i} className="stat-box" style={{ borderRight: i < 3 ? `1px solid ${T.border}` : 'none' }}>
              <div style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 36, color: T.accent, marginBottom: 6 }}>
                {num}
              </div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '96px 32px', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', background: T.accentTint, borderRadius: 100, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              What We Measure
            </span>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 42, letterSpacing: '-0.025em', color: T.ink, marginBottom: 16 }}>
            Four pillars of a healthy business
          </h2>
          <p style={{ color: T.muted, fontSize: 17, lineHeight: 1.8, maxWidth: 560, margin: '0 auto' }}>
            We assess every critical dimension Nigerian business owners often overlook,
            and give you a score with specific, actionable steps to improve.
          </p>
        </div>

        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            {
              Icon:  DollarSign, color: T.accent, tint: T.accentTint,
              title: 'Financial Health',
              desc:  'Revenue tracking, profit awareness, debt exposure, and whether your savings habit is working for you.',
              items: ['Profit margin clarity', 'Expense tracking', 'Debt management'],
            },
            {
              Icon:  Cpu, color: T.blue, tint: T.blueTint,
              title: 'Operations',
              desc:  'How well your business runs without you. Staff management, documented processes, and key bottlenecks.',
              items: ['SOP documentation', 'Delegation readiness', 'Tool usage'],
            },
            {
              Icon:  Megaphone, color: T.gold, tint: T.goldTint,
              title: 'Marketing',
              desc:  'Where your customers come from, how often you show up online, and whether your offer is crystal clear.',
              items: ['Channel effectiveness', 'Social media presence', 'Customer retention'],
            },
            {
              Icon:  TrendingUp, color: T.accentMid, tint: T.accentTint,
              title: 'Growth',
              desc:  'Written goals, competitive awareness, new revenue streams, and whether you use data to make decisions.',
              items: ['Goal setting', 'Competitor tracking', 'Data-driven decisions'],
            },
          ].map(({ Icon, color, tint, title, desc, items }) => (
            <div key={title} className="feature-card">
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: tint,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <Icon size={22} color={color} strokeWidth={1.75} />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 20, color: T.ink, marginBottom: 10 }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, marginBottom: 18 }}>{desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={13} color={color} strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: T.inkMid }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: '96px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 42, letterSpacing: '-0.025em', color: T.ink, marginBottom: 16 }}>
              From zero to clarity in 3 steps
            </h2>
            <p style={{ color: T.muted, fontSize: 17, lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
              No consultants. No jargon. No waiting weeks for a report.
              Just honest answers and a clear path forward.
            </p>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {[
              {
                num: '1', title: 'Answer 20 questions',
                desc: 'Walk through four sections: Financial, Operations, Marketing, and Growth. Honest answers take 4–6 minutes.',
              },
              {
                num: '2', title: 'Get your health score',
                desc: 'Instantly see your score across all four dimensions. Your overall health index shows exactly where you stand.',
              },
              {
                num: '3', title: 'Receive your action plan',
                desc: 'Our AI generates a Nigeria-specific report with your top strengths, critical risks, and a 30-day priority action.',
              },
            ].map(({ num, title, desc }) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                  <div className="step-num">{num}</div>
                </div>
                <h3 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 22, color: T.ink, marginBottom: 12 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <button className="btn-cta" onClick={() => nav('audit')}>
              Take the Free Audit Now <ArrowRight size={16} strokeWidth={2} />
            </button>
            <p style={{ marginTop: 14, fontSize: 13, color: T.muted, fontStyle: 'italic' }}>
              No sign-up required for your first audit.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '96px 32px', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 42, letterSpacing: '-0.025em', color: T.ink, marginBottom: 16 }}>
            Simple, honest pricing
          </h2>
          <p style={{ color: T.muted, fontSize: 17, lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
            Start free. Upgrade when you're ready to unlock the full AI action report.
            Cancel anytime.
          </p>
        </div>

        {/* Free tier */}
        <div style={{
          background: T.cardAlt, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: '20px 28px', marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 20, color: T.ink, marginBottom: 4 }}>Free Trial</div>
            <div style={{ fontSize: 14, color: T.muted }}>1 audit per month · Health scores · No AI report</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 28, color: T.ink }}>₦0</div>
            <button className="btn-outline" onClick={() => nav('audit')}>Start Free</button>
          </div>
        </div>

        <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {PLANS.map(plan => (
            <div key={plan.id} className={`plan-card${plan.popular ? ' popular' : ''}`}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: T.accent, color: '#fff', borderRadius: 100,
                  padding: '5px 18px', fontSize: 11, fontWeight: 600,
                  fontFamily: 'Lora', letterSpacing: '0.06em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 22, color: T.ink }}>{plan.name}</div>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{plan.audits}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '20px 0 24px' }}>
                <span style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 36, color: plan.popular ? T.accent : T.ink }}>
                  ₦{plan.price.toLocaleString()}
                </span>
                <span style={{ fontSize: 14, color: T.muted }}>/{plan.period}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle2 size={15} color={T.accentLight} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 14, color: T.inkMid, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                className="btn-cta"
                style={{
                  width: '100%', justifyContent: 'center',
                  background: plan.popular ? T.accent : 'transparent',
                  color: plan.popular ? '#fff' : T.accent,
                  border: `2px solid ${T.accent}`,
                  boxShadow: plan.popular ? `0 4px 20px ${T.accent}40` : 'none',
                }}
                onClick={() => nav('subscribe')}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: T.muted, fontStyle: 'italic' }}>
          7-day money-back guarantee on all paid plans. Powered by Paystack — all Nigerian payment methods accepted.
        </p>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: '96px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 42, letterSpacing: '-0.025em', color: T.ink, marginBottom: 16 }}>
              Nigerian business owners are talking
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="testimonial-card">
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 15, color: T.inkMid, lineHeight: 1.85, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div>
                  <div style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 14, color: T.ink }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '96px 32px', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '4px 14px', background: T.accentTint, borderRadius: 100, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                About BizHealth
              </span>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 40, letterSpacing: '-0.025em', color: T.ink, marginBottom: 20, lineHeight: 1.15 }}>
              Built by Nigerians,<br />for Nigerian businesses.
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.9, marginBottom: 20 }}>
              BizHealth was created out of frustration. Most business tools are built for Western markets —
              they don't understand power cuts, informal staff arrangements, WhatsApp-based sales pipelines,
              or what it means to run a business in an economy with 30%+ inflation.
            </p>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.9, marginBottom: 32 }}>
              We built BizHealth specifically for Nigerian SME owners who want honest, actionable intelligence
              about their business — without the jargon, without the consulting fees, and without the
              generic global advice that doesn't apply here.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                [Shield,   'Secure & Private', 'Your data is never sold or shared'],
                [Zap,      'AI-Powered',        'Llama 3.3 70B model — elite AI'],
                [MapPin,   'Nigeria-First',     'All analysis is context-specific'],
                [Award,    '7-Day Guarantee',   'Full refund if not satisfied'],
              ].map(([Icon, title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accentTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={T.accent} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: T.ink, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual element */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: `linear-gradient(145deg, ${T.accentTint}, ${T.surface})`,
              border: `1px solid ${T.border}`, borderRadius: 24,
              padding: 40,
            }}>
              <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 18, color: T.ink, marginBottom: 24 }}>
                Our Mission
              </div>
              <p style={{ fontSize: 16, color: T.inkMid, lineHeight: 1.9, fontStyle: 'italic', marginBottom: 28 }}>
                "Every Nigerian business owner deserves the same quality of business intelligence
                that large corporations pay millions for. We're making that accessible at ₦3,500/month."
              </p>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 24 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: T.ink }}>The BizHealth Team</div>
                <div style={{ fontSize: 13, color: T.muted }}>Port Harcourt & Lagos, Nigeria</div>
              </div>
            </div>

            {/* decorative element */}
            <div style={{
              position: 'absolute', bottom: -20, right: -20, width: 120, height: 120,
              borderRadius: 20, background: T.accentTint,
              border: `1px solid ${T.accent}30`, zIndex: -1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={48} color={T.accent + '60'} strokeWidth={1} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: '96px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 40, letterSpacing: '-0.025em', color: T.ink, marginBottom: 16 }}>
              Frequently asked questions
            </h2>
          </div>

          <div>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <span style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 16, color: T.ink, lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  {openFaq === i
                    ? <ChevronUp size={18} color={T.muted} style={{ flexShrink: 0, marginTop: 2 }} />
                    : <ChevronDown size={18} color={T.muted} style={{ flexShrink: 0, marginTop: 2 }} />
                  }
                </div>
                {openFaq === i && (
                  <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.85, marginTop: 12, paddingRight: 32 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding: '96px 32px', textAlign: 'center',
        background: `linear-gradient(160deg, ${T.accent} 0%, ${T.accentMid} 100%)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
          <h2 style={{
            fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 46,
            letterSpacing: '-0.025em', color: '#fff', marginBottom: 20, lineHeight: 1.1,
          }}>
            Your business is either<br />growing or declining.<br />
            <span style={{ color: T.accentTint }}>Find out which.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, lineHeight: 1.85, marginBottom: 40 }}>
            Join 400+ Nigerian business owners who've taken the audit and
            discovered exactly what to fix first.
          </p>
          <button
            className="btn-cta"
            style={{ background: '#fff', color: T.accent, boxShadow: '0 8px 40px rgba(0,0,0,0.25)', fontSize: 17, padding: '16px 36px' }}
            onClick={() => nav('audit')}
          >
            Start Your Free Audit <ArrowRight size={18} strokeWidth={2} />
          </button>
          <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>
            No sign-up. No credit card. 4–6 minutes.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: T.ink, padding: '48px 32px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <Logo size="sm" dark />
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.8, marginTop: 16, maxWidth: 280 }}>
                AI-powered business health audits built specifically for Nigerian SMEs. Know your score. Fix your gaps. Grow faster.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <a href="mailto:hello@bizhealth.ng" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <Mail size={13} /> hello@bizhealth.ng
                </a>
              </div>
            </div>

            {[
              ['Product', [
                ['Start Free Audit', () => nav('audit')],
                ['Pricing', () => nav('subscribe')],
                ['Features', () => scrollToSection('features')],
              ]],
              ['Company', [
                ['About', () => scrollToSection('about')],
                ['FAQ', () => scrollToSection('faq')],
                ['Contact', () => {}],
              ]],
              ['Legal', [
                ['Terms & Conditions', () => nav('terms')],
                ['Privacy Policy', () => nav('terms')],
                ['Refund Policy', () => nav('terms')],
              ]],
            ].map(([heading, links]) => (
              <div key={heading}>
                <div style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                  {heading}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {links.map(([label, fn]) => (
                    <span key={label} onClick={fn} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.target.style.color = '#fff'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              © {new Date().getFullYear()} BizHealth. All rights reserved. Built in Nigeria 🇳🇬
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', display: 'flex', gap: 20 }}>
              <span onClick={() => nav('terms')} style={{ cursor: 'pointer' }}>Privacy</span>
              <span onClick={() => nav('terms')} style={{ cursor: 'pointer' }}>Terms</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; }
          #about > div { grid-template-columns: 1fr !important; }
          section > div > div[style*="grid"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
