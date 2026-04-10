# BizHealth — SME Audit Engine v2.0

AI-powered business health audit platform built for Nigerian SMEs.
Built with **Vite + React** (frontend) and **Vercel Serverless Functions** (backend).
AI powered by **Groq**. Payments via **Paystack**.

---

## 🗂 Project Structure

```
bizhealth/
├── api/
│   ├── analyze.js            ← AI report generation (Groq)
│   └── verify-payment.js     ← Paystack payment verification
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Logo.jsx          ← BizHealth logo component
│   ├── pages/
│   │   ├── Landing.jsx       ← Full landing page (hero, features, pricing, about, FAQ)
│   │   ├── Subscribe.jsx     ← Subscription & Paystack checkout page
│   │   ├── Terms.jsx         ← Terms & Conditions / Privacy Policy
│   │   └── Admin.jsx         ← Password-protected admin dashboard
│   ├── utils/
│   │   ├── tokens.js         ← Design tokens (colours, fonts)
│   │   └── subscription.js   ← Subscription state & plan definitions
│   ├── AuditEngine.jsx       ← Main 4-section audit + report
│   ├── App.jsx               ← Hash-router (landing/audit/subscribe/terms/admin)
│   ├── index.css             ← Global resets
│   └── main.jsx              ← React entry point
├── .env.example              ← Environment variables template
├── .gitignore
├── index.html
├── package.json
├── vercel.json               ← API rewrites + SPA routing
└── vite.config.js
```

---

## 🚀 Deploy in 4 Steps

### Step 1 — Get API Keys

**Groq (AI reports) — free:**
1. Go to https://console.groq.com/keys
2. Sign up (1 minute, free)
3. Create an API key starting with `gsk_`

**Paystack (payments):**
1. Go to https://dashboard.paystack.com/#/settings/developer
2. Copy your **Secret Key** (`sk_live_...`) and **Public Key** (`pk_live_...`)
3. Use test keys (`sk_test_...` / `pk_test_...`) during development

---

### Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "BizHealth v2.0 initial commit"
git remote add origin https://github.com/YOUR_USERNAME/bizhealth.git
git push -u origin main
```

---

### Step 3 — Deploy on Vercel

1. Go to https://vercel.com/new
2. Click **Import** → select your GitHub repo
3. Framework auto-detected as **Vite** — no changes needed
4. Under **Environment Variables**, add:

| Name                     | Value                  | Required |
|--------------------------|------------------------|----------|
| `GROQ_API_KEY`           | `gsk_your_key_here`    | ✅ Yes   |
| `PAYSTACK_SECRET_KEY`    | `sk_live_your_key`     | ✅ Yes   |
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_live_your_key`   | ✅ Yes   |
| `VITE_ADMIN_PASSWORD`    | `your_password`        | Optional |

5. Click **Deploy** ✅

Every `git push` to `main` auto-deploys.

---

### Step 4 — Local Development

```bash
# Install dependencies
npm install

# Create local env file
cp .env.example .env.local
# Edit .env.local and add your keys

# Install Vercel CLI (needed for serverless functions locally)
npm install -g vercel

# Run dev server (supports frontend + /api routes)
vercel dev
```

> ⚠️ Use `vercel dev`, not `npm run dev`. The `/api/` routes won't work with `npm run dev`.

---

## 🧩 Pages & Routes (Hash-based SPA)

| Route       | Page                           |
|-------------|--------------------------------|
| `/`         | Landing page                   |
| `/#/audit`  | Audit Engine (4 sections)      |
| `/#/subscribe` | Pricing & Paystack checkout |
| `/#/terms`  | Terms & Conditions             |
| `/#/admin`  | Admin dashboard (password-gated) |

---

## 💰 Subscription Plans

| Plan      | Price/month | Audits       |
|-----------|-------------|--------------|
| Free      | ₦0          | 1/month (scores only, no AI report) |
| Starter   | ₦3,500      | 5/month, full AI report |
| Pro       | ₦8,000      | Unlimited, PDF export, tracking |
| Business  | ₦20,000     | 5 seats, branded reports, WhatsApp support |

---

## ⚙️ Customisation

| What                    | File                                    |
|-------------------------|-----------------------------------------|
| Audit questions         | `src/AuditEngine.jsx` → `QUESTIONS`     |
| Score weights           | `src/AuditEngine.jsx` → `SCORE_MAP`     |
| AI prompt               | `api/analyze.js` → `prompt`             |
| Pricing / plan details  | `src/utils/subscription.js` → `PLANS`  |
| Design tokens           | `src/utils/tokens.js` → `T`             |
| Admin password          | `VITE_ADMIN_PASSWORD` env var           |
| Paystack public key     | `VITE_PAYSTACK_PUBLIC_KEY` env var      |

---

## 🔒 Admin Dashboard

Access at `/#/admin`. Default password: `bizhealth2025`

**Change it** by setting `VITE_ADMIN_PASSWORD` in your Vercel environment variables.

Features:
- KPI overview (audits, subscribers, MRR, avg score)
- Plan distribution breakdown
- Audit history with search
- Revenue by plan

To connect to a real database (Supabase, PlanetScale, etc.), update the `MOCK_STATS` in `Admin.jsx` with real API calls.

---

## 🛠 Troubleshooting

**"API key missing" on report generation**
→ `GROQ_API_KEY` not set in Vercel. Add it under Project → Settings → Environment Variables.

**Paystack popup not appearing**
→ `VITE_PAYSTACK_PUBLIC_KEY` not set. Also ensure Paystack JS loads (`<script src="https://js.paystack.co/v1/inline.js">` in `index.html`).

**`/api/analyze` 404 locally**
→ Run `vercel dev`, not `npm run dev`.

**Build fails on Vercel**
→ Check `node_modules` is in `.gitignore` and not committed.

---

## 📧 Contact

hello@bizhealth.ng
