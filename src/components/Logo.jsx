import { T } from '../utils/tokens'

export default function Logo({ size = 'md', dark = false }) {
  const sizes = { sm: 28, md: 36, lg: 48 }
  const s = sizes[size] || sizes.md
  const textColor = dark ? '#FFFFFF' : T.ink
  const subColor  = dark ? 'rgba(255,255,255,0.6)' : T.muted

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s * 0.28 }}>
      {/* Icon mark */}
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill={T.accent} />
        {/* Heartbeat / pulse line */}
        <polyline
          points="4,22 10,22 13,14 17,28 21,18 25,22 30,22 36,22"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Small upward trend dot */}
        <circle cx="30" cy="15" r="3" fill="#D8F3DC" />
        <polyline
          points="27,17 30,14 33,12"
          stroke="#D8F3DC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Wordmark */}
      <div>
        <div style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontWeight: 800,
          fontSize: s * 0.5,
          letterSpacing: '-0.025em',
          color: textColor,
          lineHeight: 1,
        }}>
          BizHealth
        </div>
        <div style={{
          fontSize: s * 0.22,
          color: subColor,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily: 'Lora, Georgia, serif',
          lineHeight: 1,
          marginTop: 2,
        }}>
          SME Audit Engine
        </div>
      </div>
    </div>
  )
}
