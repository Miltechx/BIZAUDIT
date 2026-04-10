const SUB_KEY   = 'bizhealth_sub'
const TRIAL_KEY = 'bizhealth_trial_used'

export function getSubscription() {
  try {
    const raw = localStorage.getItem(SUB_KEY)
    if (!raw) return null
    const sub = JSON.parse(raw)
    if (sub.expiry < Date.now()) {
      localStorage.removeItem(SUB_KEY)
      return null
    }
    return sub  // { plan, email, expiry, ref }
  } catch { return null }
}

export function hasUsedFreeTrial() {
  try {
    return localStorage.getItem(TRIAL_KEY) === '1'
  } catch { return false }
}

export function markFreeTrialUsed() {
  try {
    localStorage.setItem(TRIAL_KEY, '1')
  } catch { /* private browsing — silently ignore */ }
}

export function saveSubscription(data) {
  try {
    localStorage.setItem(SUB_KEY, JSON.stringify(data))
  } catch { /* private browsing — silently ignore */ }
}

export function clearSubscription() {
  try { localStorage.removeItem(SUB_KEY) } catch { /* private browsing */ }
}

export function isPremium() {
  return getSubscription() !== null
}

export const PLANS = [
  {
    id:       'starter',
    name:     'Starter',
    price:    3500,
    period:   'month',
    audits:   '5 audits / month',
    features: [
      'Full AI-generated report',
      '4-section health scores',
      'Prioritised action plan',
      'Strengths & risk analysis',
      'Email delivery',
    ],
    cta:      'Start Starter Plan',
    popular:  false,
  },
  {
    id:       'pro',
    name:     'Pro',
    price:    8000,
    period:   'month',
    audits:   'Unlimited audits',
    features: [
      'Everything in Starter',
      'Unlimited audits monthly',
      'PDF report export',
      'Month-over-month tracking',
      'Priority email support',
    ],
    cta:      'Go Pro',
    popular:  true,
  },
  {
    id:       'business',
    name:     'Business',
    price:    20000,
    period:   'month',
    audits:   'Up to 5 team members',
    features: [
      'Everything in Pro',
      '5 team-member seats',
      'Branded PDF reports',
      'Dedicated WhatsApp support',
      'Quarterly strategy call',
    ],
    cta:      'Get Business',
    popular:  false,
  },
]
