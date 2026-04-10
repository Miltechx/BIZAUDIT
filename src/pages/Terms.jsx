import { ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'
import { T, FONTS } from '../utils/tokens'

const css = `${FONTS}
  .toc-link { color: ${T.accent}; cursor: pointer; font-size: 14px; line-height: 1.8; }
  .toc-link:hover { text-decoration: underline; }
  h2.section-h { font-family: Playfair Display, Georgia, serif; font-weight: 700; font-size: 22px; color: ${T.ink}; margin: 48px 0 16px; letter-spacing: -0.015em; }
  p.body-p { font-size: 15px; color: ${T.inkMid}; line-height: 1.9; margin-bottom: 14px; }
  ul.body-ul { padding-left: 22px; margin-bottom: 14px; }
  ul.body-ul li { font-size: 15px; color: ${T.inkMid}; line-height: 1.9; margin-bottom: 6px; }
`

const LAST_UPDATED = 'April 2025'

export default function Terms({ nav }) {
  const s = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'Lora, Georgia, serif', color: T.ink }}>
      <style>{css}</style>

      <header style={{
        borderBottom: `1px solid ${T.border}`, padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: T.bg + 'F0', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button onClick={() => nav('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Logo size="sm" />
        </button>
        <button onClick={() => nav('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 14, fontFamily: 'Lora' }}>
          <ArrowLeft size={15} /> Back
        </button>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 96px' }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Legal
          </span>
        </div>
        <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: 44, letterSpacing: '-0.025em', color: T.ink, marginBottom: 10 }}>
          Terms & Conditions
        </h1>
        <p style={{ fontSize: 14, color: T.muted, marginBottom: 40 }}>
          Last updated: {LAST_UPDATED} · Effective immediately upon use of the platform.
        </p>

        {/* TOC */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '24px 28px', marginBottom: 48 }}>
          <div style={{ fontFamily: 'Lora', fontWeight: 600, fontSize: 13, color: T.inkMid, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Contents
          </div>
          {[
            ['1. Acceptance of Terms', 'accept'],
            ['2. Description of Service', 'service'],
            ['3. Free Trial & Subscriptions', 'subs'],
            ['4. Payment Terms', 'payment'],
            ['5. Refund Policy', 'refund'],
            ['6. User Conduct', 'conduct'],
            ['7. Data & Privacy', 'privacy'],
            ['8. AI-Generated Content Disclaimer', 'ai'],
            ['9. Intellectual Property', 'ip'],
            ['10. Limitation of Liability', 'liability'],
            ['11. Termination', 'termination'],
            ['12. Governing Law', 'law'],
            ['13. Contact Us', 'contact'],
          ].map(([label, id]) => (
            <div key={id} className="toc-link" onClick={() => s(id)}>{label}</div>
          ))}
        </div>

        <h2 id="accept" className="section-h">1. Acceptance of Terms</h2>
        <p className="body-p">By accessing or using BizHealth ("the Platform," "we," "us," or "our"), you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you must not use the Platform.</p>
        <p className="body-p">These terms apply to all users of BizHealth, including visitors, free trial users, and paid subscribers. Use of the platform constitutes acceptance.</p>

        <h2 id="service" className="section-h">2. Description of Service</h2>
        <p className="body-p">BizHealth is an AI-powered business health audit platform designed specifically for Nigerian Small and Medium Enterprises (SMEs). The platform provides:</p>
        <ul className="body-ul">
          <li>Guided questionnaires covering financial health, operations, marketing, and growth dimensions</li>
          <li>Automated scoring and benchmarking of business health across four sections</li>
          <li>AI-generated analysis, insights, and actionable recommendations (on paid plans)</li>
          <li>PDF report export and tracking features (on applicable plans)</li>
        </ul>
        <p className="body-p">BizHealth is an informational tool and does not constitute professional financial, legal, or business consulting advice.</p>

        <h2 id="subs" className="section-h">3. Free Trial & Subscriptions</h2>
        <p className="body-p"><strong>Free Trial:</strong> New users may access one (1) free audit per calendar month. The free tier includes health scores across all four sections but does not include the full AI-generated action report. No payment or registration is required for the free trial.</p>
        <p className="body-p"><strong>Paid Subscriptions:</strong> Subscriptions are available on the following plans:</p>
        <ul className="body-ul">
          <li><strong>Starter (₦3,500/month):</strong> 5 audits per month, full AI-generated report</li>
          <li><strong>Pro (₦8,000/month):</strong> Unlimited audits, PDF export, month-over-month tracking</li>
          <li><strong>Business (₦20,000/month):</strong> Up to 5 team members, branded reports, dedicated support</li>
        </ul>
        <p className="body-p">Subscriptions are billed monthly. Access is granted for 30 days from the payment date. Subscriptions do not auto-renew without the user's explicit action to repurchase.</p>

        <h2 id="payment" className="section-h">4. Payment Terms</h2>
        <p className="body-p">All payments are processed securely through Paystack (paystack.com), a licensed payment processor operating in Nigeria. BizHealth does not store or process payment card information directly.</p>
        <p className="body-p">Accepted payment methods include:</p>
        <ul className="body-ul">
          <li>Nigerian debit and credit cards (Visa, Mastercard, Verve)</li>
          <li>Bank transfers (USSD)</li>
          <li>Mobile money (where supported by Paystack)</li>
        </ul>
        <p className="body-p">All prices are in Nigerian Naira (₦) and include applicable VAT where required. Prices may be updated with 14 days' notice to existing subscribers.</p>

        <h2 id="refund" className="section-h">5. Refund Policy</h2>
        <p className="body-p">BizHealth offers a <strong>7-day money-back guarantee</strong> on all paid subscriptions. If you are not satisfied with your first paid audit, contact us at hello@bizhealth.ng within 7 days of your payment date and we will issue a full refund — no questions asked.</p>
        <p className="body-p">Refunds are not available:</p>
        <ul className="body-ul">
          <li>After 7 days from the original payment date</li>
          <li>If more than 3 full AI audits have been consumed in the billing period</li>
          <li>On the same account more than once in any 12-month period</li>
        </ul>
        <p className="body-p">Refunds are processed back to the original payment method within 5–10 business days.</p>

        <h2 id="conduct" className="section-h">6. User Conduct</h2>
        <p className="body-p">You agree not to:</p>
        <ul className="body-ul">
          <li>Use the platform for any unlawful purpose or in violation of Nigerian law</li>
          <li>Attempt to reverse-engineer, copy, or scrape any part of the platform</li>
          <li>Share subscription access with individuals outside your plan's allowed seats</li>
          <li>Submit false or deliberately misleading information in audit questionnaires</li>
          <li>Use automated tools to submit audit responses in bulk</li>
        </ul>

        <h2 id="privacy" className="section-h">7. Data & Privacy</h2>
        <p className="body-p">BizHealth collects and processes the following data:</p>
        <ul className="body-ul">
          <li>Audit questionnaire responses (used solely to generate your report)</li>
          <li>Email address (for receipt delivery and subscription management, on paid plans)</li>
          <li>Payment reference numbers (for subscription verification)</li>
          <li>Basic usage analytics (page visits, audit completion rates — anonymised)</li>
        </ul>
        <p className="body-p">We do not sell, rent, or share your personal data or audit responses with third parties for marketing purposes. Data is retained for up to 12 months from last use for support purposes. You may request deletion of your data at any time by emailing hello@bizhealth.ng.</p>
        <p className="body-p">Audit responses are transmitted to Groq Inc.'s AI inference API for report generation. Groq's data handling practices are governed by their own privacy policy. BizHealth does not use your responses to train AI models.</p>

        <h2 id="ai" className="section-h">8. AI-Generated Content Disclaimer</h2>
        <p className="body-p">BizHealth's reports are generated by a large language model (Llama 3.3 70B via Groq). While we have designed the prompts and scoring system to produce relevant, Nigeria-specific recommendations, AI-generated content is inherently probabilistic and may:</p>
        <ul className="body-ul">
          <li>Contain inaccuracies or context errors</li>
          <li>Not account for every unique circumstance of your business</li>
          <li>Reflect training data biases</li>
        </ul>
        <p className="body-p">BizHealth reports are informational tools, not professional financial, legal, or business advice. We strongly recommend consulting qualified professionals before making significant business decisions. BizHealth is not liable for business outcomes resulting from following AI-generated recommendations.</p>

        <h2 id="ip" className="section-h">9. Intellectual Property</h2>
        <p className="body-p">All content, design, code, questions, scoring methodologies, and branding on BizHealth are the intellectual property of BizHealth and its creators. You may not reproduce, distribute, or create derivative works without written permission.</p>
        <p className="body-p">Your audit report is your property. You may download, share, and use it freely for personal business purposes.</p>

        <h2 id="liability" className="section-h">10. Limitation of Liability</h2>
        <p className="body-p">To the maximum extent permitted by Nigerian law, BizHealth and its creators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to lost profits, business losses, or data loss.</p>
        <p className="body-p">Our total liability to you in any circumstance shall not exceed the amount you paid for your current subscription period.</p>

        <h2 id="termination" className="section-h">11. Termination</h2>
        <p className="body-p">BizHealth reserves the right to suspend or terminate access to any account that violates these Terms. Users may cancel their subscription at any time by not renewing at the end of the billing period. Upon termination, access to premium features ends immediately.</p>

        <h2 id="law" className="section-h">12. Governing Law</h2>
        <p className="body-p">These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the Nigerian courts.</p>

        <h2 id="contact" className="section-h">13. Contact Us</h2>
        <p className="body-p">For all legal, billing, or support enquiries:</p>
        <ul className="body-ul">
          <li>Email: hello@bizhealth.ng</li>
          <li>WhatsApp Support: Available on Business plan</li>
          <li>Response time: Within 48 hours on business days</li>
        </ul>

        <div style={{
          marginTop: 56, padding: '24px 28px', background: T.accentTint,
          border: `1px solid ${T.accent}30`, borderRadius: 12,
        }}>
          <p style={{ fontSize: 14, color: T.accent, lineHeight: 1.8, fontWeight: 500 }}>
            These Terms were last updated in {LAST_UPDATED}. Continued use of BizHealth after any amendments constitutes acceptance of the revised Terms. We will notify users of material changes via email (for paid subscribers) or a notice on the platform.
          </p>
        </div>
      </main>
    </div>
  )
}
