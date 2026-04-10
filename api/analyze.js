// api/analyze.js — Vercel Serverless Function

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { businessName, industry, answers, sectionScores, overall } = req.body || {}

  if (!answers || typeof overall !== 'number') {
    return res.status(400).json({ error: 'Invalid request body.' })
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error. API key missing.' })
  }

  const prompt = `You are a senior business consultant specialising in Nigerian SMEs and emerging-market businesses. Analyse this audit data and return a structured, actionable report.

Business: ${businessName || 'SME'}
Industry: ${industry || 'General'}
Overall Health Score: ${overall}/100
Section Scores — Financial: ${sectionScores.financial}/100 | Operations: ${sectionScores.operations}/100 | Marketing: ${sectionScores.marketing}/100 | Growth: ${sectionScores.growth}/100

Audit Answers:
${Object.entries(answers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')}

Return ONLY valid JSON — no markdown fences, no explanation before or after:
{
  "headline": "One punchy sentence summarising business health (max 12 words)",
  "summary": "2–3 sentence honest, direct assessment with Nigeria-specific context",
  "financial": {
    "insight": "2 sentences on financial health based on the audit answers",
    "actions": ["Specific action 1", "Specific action 2", "Specific action 3"]
  },
  "operations": {
    "insight": "2 sentences on operational strengths and weaknesses",
    "actions": ["Specific action 1", "Specific action 2", "Specific action 3"]
  },
  "marketing": {
    "insight": "2 sentences on marketing effectiveness",
    "actions": ["Specific action 1", "Specific action 2", "Specific action 3"]
  },
  "growth": {
    "insight": "2 sentences on growth trajectory and readiness",
    "actions": ["Specific action 1", "Specific action 2", "Specific action 3"]
  },
  "top_priority": "The single most important action this business must take in the next 30 days — specific, not vague",
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "warnings": ["Specific risk 1", "Specific risk 2", "Specific risk 3"]
}`

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 1400,
      }),
    })

    if (!groqRes.ok) {
      const errBody = await groqRes.json().catch(() => ({}))
      console.error('Groq API error:', errBody)

      // Fallback to smaller model
      return await tryFallbackModel(req, res, prompt)
    }

    const groqData = await groqRes.json()
    const raw = groqData.choices?.[0]?.message?.content || ''
    const clean = raw.replace(/```json|```/g, '').trim()

    let report
    try {
      report = JSON.parse(clean)
    } catch {
      console.error('JSON parse failed. Raw:', raw)
      return res.status(500).json({ error: 'Could not parse AI response. Please try again.' })
    }

    return res.status(200).json({ report })
  } catch (err) {
    console.error('Unhandled error in /api/analyze:', err)
    return res.status(500).json({ error: 'Internal server error. Please try again.' })
  }
}

async function tryFallbackModel(req, res, prompt) {
  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 1400,
      }),
    })

    if (!groqRes.ok) {
      return res.status(502).json({ error: 'AI service temporarily unavailable. Please try again in a moment.' })
    }

    const groqData = await groqRes.json()
    const raw = groqData.choices?.[0]?.message?.content || ''
    const clean = raw.replace(/```json|```/g, '').trim()

    const report = JSON.parse(clean)
    return res.status(200).json({ report })
  } catch {
    return res.status(500).json({ error: 'AI service error. Please try again.' })
  }
}
