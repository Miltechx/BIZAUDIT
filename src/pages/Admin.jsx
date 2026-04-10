import { useState, useEffect } from 'react'
import {
  BarChart3, Users, DollarSign, Activity, TrendingUp,
  LogOut, Eye, EyeOff, RefreshCw, ChevronDown, Search,
  CheckCircle2, AlertTriangle, Clock, ArrowLeft, Shield,
} from 'lucide-react'
import Logo from '../components/Logo'
import { T, FONTS } from '../utils/tokens'

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'bizhealth2025'

const css = `
  ${FONTS}
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin   { to { transform:rotate(360deg); } }
  .fu { animation: fadeUp 0.45s ease both; }

  .admin-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 16px; border-radius: 8px; cursor: pointer;
    font-family: Lora, Georgia, serif; font-size: 14px; font-weight: 500;
    color: rgba(255,255,255,0.6); transition: background 0.15s, color 0.15s;
    border: none; background: none; width: 100%; text-align: left;
  }
  .admin-nav-link:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); }
  .admin-nav-link.active { background: rgba(255,255,255,0.12); color: #fff; }

  .stat-card {
    background: ${T.surface}; border: 1px solid ${T.border};
    border-radius: 14px; padding: 24px;
  }

  .data-row {
    display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 120px;
    padding: 14px 20px; border-bottom: 1px solid ${T.border};
    align-items: center; font-size: 13px;
    transition: background 0.12s;
  }
  .data-row:hover { background: ${T.faint}; }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 4px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  }

  .field {
    background: ${T.surface}; border: 1.5px solid ${T.border}; color: ${T.ink};
    border-radius: 8px; padding: 11px 14px;
    font-family: Lora, Georgia, serif; font-size: 14px;
    width: 100%; outline: none; transition: border-color 0.18s;
  }
  .field:focus { border-color: ${T.accent}; }
  .field::placeholder { color: ${T.muted}; }
`

// Mock analytics data
const MOCK_STATS = {
  totalAudits:    412,
  paidUsers:       87,
  mrr:         218500,
  avgScore:        63,
  planBreakdown: { starter: 34, pro: 41, business: 12 },
  recentAudits: [
    { id: 'AUD-001', biz: 'FashionHub Lagos',    industry: 'Fashion',    score: 72, plan: 'pro',      date: '2025-04-08' },
    { id: 'AUD-002', biz: 'Chidi\'s Kitchen',    industry: 'Food',       score: 48, plan: 'starter',  date: '2025-04-08' },
    { id: 'AUD-003', biz: 'SwiftLog Abuja',       industry: 'Logistics',  score: 85, plan: 'business', date: '2025-04-07' },
    { id: 'AUD-004', biz: 'PH Tech Solutions',    industry: 'Tech',       score: 61, plan: 'free',     date: '2025-04-07' },
    { id: 'AUD-005', biz: 'GreenGrow Farm',       industry: 'Agric',      score: 39, plan: 'starter',  date: '2025-04-06' },
    { id: 'AUD-006', biz: 'MamaB Superstore',     industry: 'Retail',     score: 55, plan: 'free',     date: '2025-04-06' },
    { id: 'AUD-007', biz: 'Oakfield Properties',  industry: 'Real Estate',score: 79, plan: 'pro',      date: '2025-04-05' },
    { id: 'AUD-008', biz: 'Radiance Salon',       industry: 'Beauty',     score: 44, plan: 'starter',  date: '2025-04-05' },
  ],
}

function planBadge(plan) {
  const map = {
    free:     { bg: T.faint,     color: T.muted  },
    starter:  { bg: T.blueTint,  color: T.blue   },
    pro:      { bg: T.accentTint,color: T.accent  },
    business: { bg: T.goldTint,  color: T.gold   },
  }
  const s = map[plan] || map.free
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  )
}

function scoreColor(s) {
  if (s >= 80) return T.accentLight
  if (s >= 60) return T.accentMid
  if (s >= 40) return T.gold
  return T.red
}

export default function Admin({ nav }) {
  const [authed,   setAuthed]   = useState(false)
  const [pass,     setPass]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [passErr,  setPassErr]  = useState('')
  const [tab,      setTab]      = useState('overview')
  const [search,   setSearch]   = useState('')

  function login() {
    if (pass === ADMIN_PASS) { setAuthed(true); setPassErr('') }
    else setPassErr('Incorrect password. Try again.')
  }

  const stats = MOCK_STATS
  const filtered = stats.recentAudits.filter(r =>
    r.biz.toLowerCase().includes(search.toLowerCase()) ||
    r.industry.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'Lora, Georgia, serif', color: T.ink }}>
      <style>{css}</style>

      {/* Login gate */}
      {!authed ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="fu" style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 380,
            boxShadow: '0 16px 60px rgba(0,0,0,0.08)',
          }}>
            <div style={{ marginBottom: 32 }}>
              <Logo size="sm" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Shield size={16} color={T.accent} />
              <span style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 22, color: T.ink }}>
                Admin Access
              </span>
            </div>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 28 }}>
              Enter your admin password to access the dashboard.
            </p>

            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input
                className="field"
                type={showPass ? 'text' : 'password'}
                placeholder="Admin password"
                value={pass}
                onChange={e => { setPass(e.target.value); setPassErr('') }}
                onKeyDown={e => e.key === 'Enter' && login()}
                style={{ paddingRight: 40 }}
              />
              <button
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: T.muted,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {passErr && (
              <div style={{ display: 'flex', gap: 7, color: T.red, fontSize: 13, marginBottom: 14 }}>
                <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 2 }} /> {passErr}
              </div>
            )}

            <button
              onClick={login}
              style={{
                width: '100%', background: T.accent, color: '#fff', border: 'none',
                borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600,
                fontFamily: 'Lora', cursor: 'pointer',
                boxShadow: `0 4px 16px ${T.accent}40`,
              }}
            >
              Login to Admin
            </button>

            <button
              onClick={() => nav('landing')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 13, fontFamily: 'Lora', margin: '16px auto 0' }}
            >
              <ArrowLeft size={13} /> Back to site
            </button>
          </div>
        </div>
      ) : (
        /* Admin Dashboard */
        <div style={{ display: 'flex', minHeight: '100vh' }}>

          {/* Sidebar */}
          <aside style={{
            width: 240, background: T.ink, flexShrink: 0,
            display: 'flex', flexDirection: 'column', padding: '24px 16px',
            position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
          }}>
            <div style={{ marginBottom: 36, paddingLeft: 8 }}>
              <Logo size="sm" dark />
            </div>

            <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', paddingLeft: 16, marginBottom: 8 }}>
              Dashboard
            </div>

            {[
              [BarChart3,   'Overview',    'overview'],
              [Users,       'Users',       'users'],
              [DollarSign,  'Revenue',     'revenue'],
              [Activity,    'Audits',      'audits'],
            ].map(([Icon, label, id]) => (
              <button key={id} className={`admin-nav-link${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>
                <Icon size={16} strokeWidth={1.75} /> {label}
              </button>
            ))}

            <div style={{ flex: 1 }} />

            <button
              className="admin-nav-link"
              onClick={() => { setAuthed(false); setPass('') }}
              style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}
            >
              <LogOut size={16} /> Log Out
            </button>

            <button className="admin-nav-link" onClick={() => nav('landing')} style={{ color: 'rgba(255,255,255,0.35)' }}>
              <ArrowLeft size={16} /> Back to Site
            </button>
          </aside>

          {/* Main content */}
          <div style={{ flex: 1, overflowY: 'auto', background: T.bg }}>
            {/* Top bar */}
            <div style={{
              borderBottom: `1px solid ${T.border}`, background: T.surface,
              padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              position: 'sticky', top: 0, zIndex: 50,
            }}>
              <div>
                <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 20, color: T.ink }}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
                <div style={{ fontSize: 12, color: T.muted }}>
                  Last updated: {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: T.faint, border: `1px solid ${T.border}`, borderRadius: 8,
                padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontFamily: 'Lora', color: T.inkMid,
              }}>
                <RefreshCw size={13} strokeWidth={2} /> Refresh
              </button>
            </div>

            <div style={{ padding: '32px' }}>

              {/* OVERVIEW TAB */}
              {tab === 'overview' && (
                <div className="fu">
                  {/* KPI cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                    {[
                      { label: 'Total Audits',   value: stats.totalAudits.toLocaleString(), icon: Activity,    color: T.accent  },
                      { label: 'Paid Subscribers',value: stats.paidUsers,                   icon: Users,        color: T.blue    },
                      { label: 'Monthly Revenue', value: '₦' + (stats.mrr/1000).toFixed(0) + 'k', icon: DollarSign, color: T.gold },
                      { label: 'Avg Health Score',value: stats.avgScore + '/100',            icon: TrendingUp,  color: T.accentMid },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>{label}</div>
                            <div style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 32, color: T.ink }}>{value}</div>
                          </div>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={18} color={color} strokeWidth={1.75} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Plan breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24 }}>
                      <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 17, color: T.ink, marginBottom: 20 }}>
                        Plan Distribution
                      </div>
                      {[
                        { plan: 'Business', count: stats.planBreakdown.business, color: T.gold     },
                        { plan: 'Pro',      count: stats.planBreakdown.pro,      color: T.accent   },
                        { plan: 'Starter',  count: stats.planBreakdown.starter,  color: T.blue     },
                        { plan: 'Free',     count: stats.totalAudits - stats.paidUsers, color: T.muted },
                      ].map(({ plan, count, color }) => {
                        const pct = Math.round((count / stats.totalAudits) * 100)
                        return (
                          <div key={plan} style={{ marginBottom: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <span style={{ fontSize: 13, color: T.inkMid }}>{plan}</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color }}>{count} ({pct}%)</span>
                            </div>
                            <div style={{ height: 5, background: T.faint, borderRadius: 3 }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24 }}>
                      <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 17, color: T.ink, marginBottom: 20 }}>
                        Quick Actions
                      </div>
                      {[
                        ['View all subscribers', 'users'],
                        ['Export audit data', 'audits'],
                        ['Check revenue report', 'revenue'],
                      ].map(([label, t]) => (
                        <button key={label} onClick={() => setTab(t)} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', background: T.faint, border: `1px solid ${T.border}`,
                          borderRadius: 8, padding: '12px 16px', cursor: 'pointer', marginBottom: 10,
                          fontFamily: 'Lora', fontSize: 14, color: T.inkMid,
                        }}>
                          {label} <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AUDITS TAB */}
              {(tab === 'audits' || tab === 'users') && (
                <div className="fu">
                  {/* Search */}
                  <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
                    <Search size={14} color={T.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      className="field"
                      style={{ paddingLeft: 36 }}
                      placeholder="Search business or industry…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>

                  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
                    {/* Header row */}
                    <div className="data-row" style={{ background: T.faint, borderBottom: `1px solid ${T.border}`, fontWeight: 600, color: T.inkMid }}>
                      <span>Business</span>
                      <span>Industry</span>
                      <span>Health Score</span>
                      <span>Plan</span>
                      <span>Date</span>
                    </div>
                    {filtered.map(row => (
                      <div key={row.id} className="data-row">
                        <div>
                          <div style={{ fontWeight: 500, color: T.ink, fontSize: 13 }}>{row.biz}</div>
                          <div style={{ fontSize: 11, color: T.muted }}>{row.id}</div>
                        </div>
                        <span style={{ color: T.muted }}>{row.industry}</span>
                        <span style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 16, color: scoreColor(row.score) }}>
                          {row.score}
                        </span>
                        <span>{planBadge(row.plan)}</span>
                        <span style={{ color: T.muted }}>{row.date}</span>
                      </div>
                    ))}
                    {filtered.length === 0 && (
                      <div style={{ padding: '32px', textAlign: 'center', color: T.muted, fontSize: 14 }}>
                        No results found.
                      </div>
                    )}
                  </div>

                  <p style={{ marginTop: 12, fontSize: 12, color: T.muted }}>
                    Showing {filtered.length} of {stats.recentAudits.length} recent audits.
                    Connect a database for full history.
                  </p>
                </div>
              )}

              {/* REVENUE TAB */}
              {tab === 'revenue' && (
                <div className="fu">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                    {[
                      { label: 'Monthly Revenue',   value: '₦218,500', sub: 'April 2025'       },
                      { label: 'Active Subscribers', value: '87',       sub: '34 Starter · 41 Pro · 12 Business' },
                      { label: 'Avg Rev / User',     value: '₦2,511',   sub: 'per month'        },
                    ].map(({ label, value, sub }) => (
                      <div key={label} className="stat-card">
                        <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>{label}</div>
                        <div style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 30, color: T.ink, marginBottom: 4 }}>{value}</div>
                        <div style={{ fontSize: 12, color: T.muted }}>{sub}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24 }}>
                    <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 17, color: T.ink, marginBottom: 20 }}>
                      Revenue by Plan
                    </div>
                    {[
                      { plan: 'Business', count: 12, price: 20000, color: T.gold     },
                      { plan: 'Pro',      count: 41, price:  8000, color: T.accent   },
                      { plan: 'Starter',  count: 34, price:  3500, color: T.blue     },
                    ].map(({ plan, count, price, color }) => {
                      const rev = count * price
                      const pct = Math.round((rev / stats.mrr) * 100)
                      return (
                        <div key={plan} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${T.border}` }}>
                          <div style={{ display: 'flex', align: 'center', gap: 12 }}>
                            <span style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 14, color: T.ink }}>{plan}</span>
                            <span style={{ fontSize: 13, color: T.muted }}>{count} subscribers</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 18, color }}>₦{rev.toLocaleString()}</div>
                            <div style={{ fontSize: 11, color: T.muted }}>{pct}% of MRR</div>
                          </div>
                        </div>
                      )
                    })}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16 }}>
                      <span style={{ fontFamily: 'Lora', fontWeight: 600, color: T.ink }}>Total MRR</span>
                      <span style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 22, color: T.accent }}>₦{stats.mrr.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
