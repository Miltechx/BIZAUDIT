import { useState } from 'react'
import { CheckCircle2, ArrowLeft, Shield, Zap, CreditCard, Phone, Loader2, X, AlertTriangle } from 'lucide-react'
import Logo from '../components/Logo'
import { T, FONTS } from '../utils/tokens'
import { PLANS, saveSubscription, getSubscription } from '../utils/subscription'

const css = `
  ${FONTS}
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin   { to { transform:rotate(360deg); } }
  .fu { animation: fadeUp 0.45s ease both; }

  .plan-sel {
    border: 2px solid ${T.border}; background: ${T.surface};
    border-radius: 14px; padding: 22px 24px; cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    position: relative;
  }
  .plan-sel:hover  { border-color: ${T.accentLight}; }
  .plan-sel.active { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${T.accent}20; }

  .btn-pay {
    display: flex; align-items: center; justify-content: center; gap: 9px;
    width: 100%; background: ${T.accent}; color: #fff; border: none; border-radius: 10px;
    padding: 16px; font-family: Lora, Georgia, serif; font-size: 16px; font-weight: 600;
    cursor: pointer; transition: background 0.2s, transform 0.15s;
    box-shadow: 0 4px 20px ${T.accent}40;
  }
  .btn-pay:hover:not(:disabled) { background: ${T.accentMid}; transform: translateY(-1px); }
  .btn-pay:disabled { opacity: 0.45; cursor: not-allowed; }

  .field {
    background: ${T.surface}; border: 1.5px solid ${T.border}; color: ${T.ink};
    border-radius: 8px; padding: 13px 16px;
    font-family: Lora, Georgia, serif; font-size: 15px;
    width: 100%; outline: none; transition: border-color 0.18s;
  }
  .field:focus { border-color: ${T.accent}; }
  .field::placeholder { color: ${T.muted}; }
`

export default function Subscribe({ nav }) {
  const existingSub = getSubscription()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [email, setEmail]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [success, setSuccess]           = useState(false)
  const [error, setError]               = useState('')

  const plan = PLANS.find(p => p.id === selectedPlan)

  function handlePay() {
    if (!email || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    setError('')
    setLoading(true)

    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder'

    if (typeof window.PaystackPop === 'undefined') {
      // Fallback: simulate payment in development
      setTimeout(() => {
        finaliseSub('dev_ref_' + Date.now())
        setLoading(false)
      }, 1500)
      return
    }

    const handler = window.PaystackPop.setup({
      key:      paystackKey,
      email,
      amount:   plan.price * 100,   // kobo
      currency: 'NGN',
      ref:      'BH_' + Date.now(),
      metadata: { plan: plan.id, email },
      onClose: () => { setLoading(false) },
      callback: async (response) => {
        try {
          // Verify with backend
          const res = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: response.reference, plan: plan.id, email }),
          })
          const data = await res.json()
          if (data.success) {
            finaliseSub(response.reference)
          } else {
            setError('Payment verification failed. Please contact support.')
          }
        } catch {
          // If API fails, still grant access (handle manually)
          finaliseSub(response.reference)
        } finally {
          setLoading(false)
        }
      },
    })
    handler.openIframe()
  }

  function finaliseSub(ref) {
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    saveSubscription({ plan: plan.id, email, expiry, ref })
    setSuccess(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'Lora, Georgia, serif', color: T.ink }}>
      <style>{css}</style>

      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${T.border}`, padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: T.bg + 'F0', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button onClick={() => nav('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Logo size="sm" />
        </button>
        <button
          onClick={() => nav('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 14, fontFamily: 'Lora' }}
        >
          <ArrowLeft size={15} /> Back to Home
        </button>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px 96px' }}>

        {/* Active sub notice */}
        {existingSub && !success && (
          <div style={{
            background: T.accentTint, border: `1px solid ${T.accent}40`,
            borderRadius: 12, padding: '16px 20px', marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <CheckCircle2 size={16} color={T.accent} />
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.accent }}>
                You're on the {existingSub.plan.charAt(0).toUpperCase() + existingSub.plan.slice(1)} plan.
              </span>
              <span style={{ fontSize: 14, color: T.accentMid, marginLeft: 8 }}>
                Expires {new Date(existingSub.expiry).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        )}

        {success ? (
          /* Success screen */
          <div className="fu" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: T.accentTint, display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
            }}>
              <CheckCircle2 size={40} color={T.accentLight} strokeWidth={1.5} />
            </div>
            <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 38, color: T.ink, marginBottom: 16, letterSpacing: '-0.025em' }}>
              Welcome to BizHealth {plan.name}!
            </h1>
            <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.85, maxWidth: 480, margin: '0 auto 36px' }}>
              Your subscription is active. You now have full access to unlimited AI-generated business health reports.
              Let's run your first full audit.
            </p>
            <button
              onClick={() => nav('audit')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: T.accent, color: '#fff', border: 'none', borderRadius: 10,
                padding: '15px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Lora', boxShadow: `0 4px 20px ${T.accent}40`,
              }}
            >
              Start My Full Audit →
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }}>

            {/* Left: Plan selector */}
            <div className="fu">
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Choose your plan
                </span>
              </div>
              <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', color: T.ink, marginBottom: 8 }}>
                Upgrade BizHealth
              </h1>
              <p style={{ color: T.muted, fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
                Select a plan and unlock full AI-generated reports with Nigeria-specific action plans.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                {PLANS.map(p => (
                  <div
                    key={p.id}
                    className={`plan-sel${selectedPlan === p.id ? ' active' : ''}`}
                    onClick={() => setSelectedPlan(p.id)}
                  >
                    {p.popular && (
                      <div style={{
                        position: 'absolute', top: -10, right: 16,
                        background: T.accent, color: '#fff', borderRadius: 100,
                        padding: '3px 12px', fontSize: 10, fontWeight: 600, fontFamily: 'Lora',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>
                        Most Popular
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                          border: `2px solid ${selectedPlan === p.id ? T.accent : T.border}`,
                          background: selectedPlan === p.id ? T.accent : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}>
                          {selectedPlan === p.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 18, color: T.ink }}>{p.name}</div>
                          <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{p.audits}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                            {p.features.slice(0, 3).map(f => (
                              <span key={f} style={{
                                fontSize: 11, padding: '3px 8px', borderRadius: 4,
                                background: T.accentTint, color: T.accent, fontWeight: 500,
                              }}>{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 24, color: selectedPlan === p.id ? T.accent : T.ink }}>
                          ₦{p.price.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 12, color: T.muted }}>/{p.period}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* What's included */}
              <div style={{ background: T.cardAlt, borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 13, color: T.inkMid, marginBottom: 14 }}>
                  Everything in {plan.name}:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle2 size={14} color={T.accentLight} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 14, color: T.inkMid }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Payment form */}
            <div className="fu" style={{ position: 'sticky', top: 100 }}>
              <div style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 20, padding: 28,
                boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 20, color: T.ink, marginBottom: 4 }}>
                  Order Summary
                </div>
                <div style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>
                  BizHealth {plan.name} · Monthly
                </div>

                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: T.muted }}>{plan.name} Plan (1 month)</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>₦{plan.price.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: T.muted }}>VAT / Tax</span>
                    <span style={{ fontSize: 14, color: T.muted }}>Included</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  paddingBottom: 20, borderBottom: `1px solid ${T.border}`, marginBottom: 24,
                }}>
                  <span style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 15, color: T.ink }}>Total Today</span>
                  <span style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 28, color: T.accent }}>
                    ₦{plan.price.toLocaleString()}
                  </span>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: T.inkMid, display: 'block', marginBottom: 6 }}>
                    Email address
                  </label>
                  <input
                    className="field"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                  />
                  <p style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>
                    Your receipt and access confirmation will be sent here.
                  </p>
                </div>

                {error && (
                  <div style={{
                    display: 'flex', gap: 8, padding: '10px 14px',
                    background: T.redTint, border: `1px solid ${T.red}33`,
                    borderRadius: 8, marginBottom: 16,
                  }}>
                    <AlertTriangle size={14} color={T.red} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: T.red }}>{error}</span>
                  </div>
                )}

                <button className="btn-pay" onClick={handlePay} disabled={loading}>
                  {loading
                    ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Processing…</>
                    : <><CreditCard size={16} strokeWidth={2} /> Pay ₦{plan.price.toLocaleString()} via Paystack</>
                  }
                </button>

                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    [Shield,  'Secure payment via Paystack'],
                    [Phone,   'Card, bank transfer & USSD accepted'],
                    [CheckCircle2, '7-day money-back guarantee'],
                  ].map(([Icon, text]) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={12} color={T.muted} />
                      <span style={{ fontSize: 12, color: T.muted }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: T.muted }}>
                By paying you agree to our{' '}
                <span onClick={() => nav('terms')} style={{ color: T.accent, cursor: 'pointer', textDecoration: 'underline' }}>
                  Terms & Conditions
                </span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
