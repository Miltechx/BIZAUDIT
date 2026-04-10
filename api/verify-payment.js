// api/verify-payment.js — Vercel Serverless Function
// Verifies Paystack payment reference server-side

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { reference, plan, email } = req.body || {}

  if (!reference) {
    return res.status(400).json({ success: false, error: 'Payment reference required.' })
  }

  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY
  if (!PAYSTACK_SECRET) {
    // In dev/test mode — accept the payment
    console.warn('PAYSTACK_SECRET_KEY not set — granting access in dev mode.')
    return res.status(200).json({ success: true, plan, email, dev: true })
  }

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await paystackRes.json()

    if (!paystackRes.ok || !data.status) {
      return res.status(400).json({ success: false, error: data.message || 'Payment verification failed.' })
    }

    const tx = data.data
    if (tx.status !== 'success') {
      return res.status(400).json({ success: false, error: `Transaction status: ${tx.status}` })
    }

    // Log the subscription (in production, save to a DB here)
    console.log('Payment verified:', {
      reference,
      email: tx.customer?.email || email,
      amount: tx.amount / 100,
      plan,
      date: new Date().toISOString(),
    })

    return res.status(200).json({
      success:   true,
      plan,
      email:     tx.customer?.email || email,
      reference,
      amount:    tx.amount / 100,
    })
  } catch (err) {
    console.error('Paystack verify error:', err)
    return res.status(500).json({ success: false, error: 'Payment verification failed. Contact support.' })
  }
}
