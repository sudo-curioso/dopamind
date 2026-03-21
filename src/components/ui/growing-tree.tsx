'use client'

import { motion } from 'framer-motion'

interface GrowingTreeProps {
  progress: number
  size?: number
  isDead?: boolean
  isWilting?: boolean
  durationMinutes?: number
}

function getStageFromDuration(minutes: number): string {
  if (minutes <= 5)  return 'flower'
  if (minutes <= 10) return 'baby'
  if (minutes <= 25) return 'half'
  if (minutes <= 30) return 'flowering'
  if (minutes <= 45) return 'large'
  return 'full'
}

// Sway config per stage — bigger trees sway slower and less
const SWAY: Record<string, { deg: number; dur: number }> = {
  flower:    { deg: 3.2, dur: 2.4 },
  baby:      { deg: 2.6, dur: 2.8 },
  half:      { deg: 2.2, dur: 3.0 },
  flowering: { deg: 2.0, dur: 3.2 },
  large:     { deg: 1.6, dur: 3.6 },
  full:      { deg: 1.4, dur: 4.0 },
}

export default function GrowingTree({
  progress,
  size = 120,
  isDead = false,
  isWilting = false,
  durationMinutes = 25,
}: GrowingTreeProps) {

  const stage = isDead ? 'dead' : getStageFromDuration(durationMinutes)
  const isComplete = progress >= 0.98
  const canSway    = !isDead && !isWilting && progress >= 0.55

  const s   = size
  const cx  = s / 2
  const cy  = s / 2
  const groundY    = s * 0.82
  const ringR      = s * 0.44
  const ringStroke = s * 0.05
  const circumference = 2 * Math.PI * ringR

  // Color sets
  const trunkColor = isDead ? '#94A3B8' : isWilting ? '#9A7A4A' : '#78350F'
  const leaf1 = isDead ? '#94A3B8' : isWilting ? '#C8A820' : '#16A34A'
  const leaf2 = isDead ? '#64748B' : isWilting ? '#B09018' : '#15803D'
  const leaf3 = isDead ? '#475569' : isWilting ? '#D4B030' : '#22C55E'
  const pink   = '#F472B6'
  const yellow = '#FDE68A'

  // Growth progression
  const growScale    = Math.max(0.05, progress)
  const trunkGrowth  = Math.min(progress * 2, 1)
  const canopyGrowth = Math.max(0, (progress - 0.2) / 0.8)
  const flowerGrowth = Math.max(0, (progress - 0.6) / 0.4)

  // Sway animation props (applied to canopy wrapper <motion.g>)
  const sw = SWAY[stage] ?? SWAY.full
  const swayAnim = canSway ? {
    rotate: [-sw.deg, sw.deg, -sw.deg],
  } : {}
  const swayTransition = canSway ? {
    duration: sw.dur,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    repeatType: 'mirror' as const,
  } : {}

  // Wilt droop applied to canopy
  const wiltAnim      = isWilting && !isDead ? { y: [0, s*0.025, 0], opacity: [1, 0.72, 1] } : {}
  const wiltTransition = isWilting && !isDead ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const } : {}

  // Sparkle burst positions for completion
  const sparkles = [0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
    const rad = (angle * Math.PI) / 180
    const r   = s * 0.34
    return { x: cx + Math.cos(rad) * r, y: (groundY - s * 0.38) + Math.sin(rad) * r, angle }
  })

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ display: 'block' }}
    >
      <defs>
        <clipPath id={`treeclip-${s}-${durationMinutes}`}>
          <circle cx={cx} cy={cy} r={ringR - ringStroke / 2 - 1} />
        </clipPath>
      </defs>

      {/* Background ring */}
      <circle
        cx={cx} cy={cy} r={ringR}
        fill="white"
        stroke="#E2E8F0"
        strokeWidth={ringStroke}
      />

      {/* Progress ring */}
      {!isDead && progress > 0 && (
        <motion.circle
          cx={cx} cy={cy} r={ringR}
          fill="none"
          stroke={
            isWilting ? '#F59E0B'
            : progress < 0.4 ? '#22C55E'
            : progress < 0.7 ? '#16A34A'
            : '#15803D'
          }
          strokeWidth={ringStroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          initial={{ strokeDashoffset: circumference }}
          transition={{ duration: 0.8, ease: 'linear' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
        />
      )}

      {/* Dead ring */}
      {isDead && (
        <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="#FECACA" strokeWidth={ringStroke} />
      )}

      {/* ── TREE CONTENT ─────────────────────────────────────────── */}
      <g clipPath={`url(#treeclip-${s}-${durationMinutes})`}>

        {/* Soil mound */}
        <motion.ellipse
          cx={cx} cy={groundY + s * 0.02}
          rx={s * 0.18} ry={s * 0.04}
          fill={isDead ? '#94A3B8' : isWilting ? '#A08050' : '#92400E'}
          animate={{ scaleX: Math.min(growScale * 3, 1) }}
          initial={{ scaleX: 0 }}
          style={{ transformOrigin: `${cx}px ${groundY}px` }}
          transition={{ duration: 0.4 }}
        />

        {/* ── FLOWER (5 min) ────────────────────────────────────── */}
        {stage === 'flower' && (
          <motion.g
            animate={{ ...swayAnim, ...wiltAnim }}
            transition={canSway ? swayTransition : wiltTransition}
            style={{ transformOrigin: `${cx}px ${groundY}px` }}
          >
            <motion.rect
              x={cx - s*0.012} y={groundY - s*0.28}
              width={s*0.024} height={s*0.28} rx={s*0.012}
              fill={leaf1}
              animate={{ scaleY: trunkGrowth }}
              initial={{ scaleY: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY}px` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.ellipse
              cx={cx - s*0.06} cy={groundY - s*0.12}
              rx={s*0.055} ry={s*0.025}
              fill={leaf3}
              transform={`rotate(-30 ${cx - s*0.06} ${groundY - s*0.12})`}
              animate={{ scale: trunkGrowth > 0.4 ? 1 : 0 }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx - s*0.06}px ${groundY - s*0.12}px` }}
              transition={{ duration: 0.4 }}
            />
            <motion.ellipse
              cx={cx + s*0.06} cy={groundY - s*0.18}
              rx={s*0.055} ry={s*0.025}
              fill={leaf3}
              transform={`rotate(30 ${cx + s*0.06} ${groundY - s*0.18})`}
              animate={{ scale: trunkGrowth > 0.6 ? 1 : 0 }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx + s*0.06}px ${groundY - s*0.18}px` }}
              transition={{ duration: 0.4 }}
            />
            {[0,60,120,180,240,300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const px  = cx + Math.cos(rad) * s * 0.075
              const py  = (groundY - s*0.28) + Math.sin(rad) * s * 0.075
              const pp  = Math.max(0, (canopyGrowth - i*0.12) / 0.3)
              return (
                <motion.ellipse
                  key={i}
                  cx={px} cy={py}
                  rx={s*0.045} ry={s*0.028}
                  fill={i%2===0 ? pink : '#FDF2F8'}
                  transform={`rotate(${angle} ${px} ${py})`}
                  animate={{ scale: Math.min(pp, 1) }}
                  initial={{ scale: 0 }}
                  style={{ transformOrigin: `${px}px ${py}px` }}
                  transition={{ duration: 0.3 }}
                />
              )
            })}
            <motion.circle
              cx={cx} cy={groundY - s*0.28} r={s*0.04}
              fill={yellow}
              animate={{ scale: canopyGrowth > 0.5 ? 1 : 0 }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.28}px` }}
              transition={{ duration: 0.3 }}
            />
            <motion.circle
              cx={cx} cy={groundY - s*0.28} r={s*0.022}
              fill="#F59E0B"
              animate={{ scale: canopyGrowth > 0.7 ? 1 : 0 }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.28}px` }}
              transition={{ duration: 0.3 }}
            />
          </motion.g>
        )}

        {/* ── BABY (10 min) ─────────────────────────────────────── */}
        {stage === 'baby' && (
          <motion.g
            animate={{ ...swayAnim, ...wiltAnim }}
            transition={canSway ? swayTransition : wiltTransition}
            style={{ transformOrigin: `${cx}px ${groundY}px` }}
          >
            <motion.rect
              x={cx - s*0.02} y={groundY - s*0.24}
              width={s*0.04} height={s*0.24} rx={s*0.02}
              fill={trunkColor}
              animate={{ scaleY: trunkGrowth }}
              initial={{ scaleY: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY}px` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.ellipse
              cx={cx - s*0.09} cy={groundY - s*0.2}
              rx={s*0.085} ry={s*0.045}
              fill={leaf1}
              transform={`rotate(-25 ${cx - s*0.09} ${groundY - s*0.2})`}
              animate={{ scale: Math.min(canopyGrowth*1.5, 1) }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.2}px` }}
              transition={{ duration: 0.5 }}
            />
            <motion.ellipse
              cx={cx + s*0.09} cy={groundY - s*0.2}
              rx={s*0.085} ry={s*0.045}
              fill={leaf3}
              transform={`rotate(25 ${cx + s*0.09} ${groundY - s*0.2})`}
              animate={{ scale: Math.min(canopyGrowth*1.3, 1) }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.2}px` }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            <motion.ellipse
              cx={cx} cy={groundY - s*0.3}
              rx={s*0.065} ry={s*0.048}
              fill={leaf2}
              animate={{ scale: Math.min(canopyGrowth, 1) }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.3}px` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.g>
        )}

        {/* ── HALF GROWN (25 min) ───────────────────────────────── */}
        {stage === 'half' && (
          <motion.g
            animate={{ ...swayAnim, ...wiltAnim }}
            transition={canSway ? swayTransition : wiltTransition}
            style={{ transformOrigin: `${cx}px ${groundY}px` }}
          >
            <motion.rect
              x={cx - s*0.03} y={groundY - s*0.34}
              width={s*0.06} height={s*0.34} rx={s*0.03}
              fill={trunkColor}
              animate={{ scaleY: trunkGrowth }}
              initial={{ scaleY: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY}px` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <motion.circle
              cx={cx} cy={groundY - s*0.38} r={s*0.16}
              fill={leaf2}
              animate={{ scale: Math.min(canopyGrowth*1.2, 1) }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.38}px` }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
            />
            <motion.circle
              cx={cx - s*0.1} cy={groundY - s*0.3} r={s*0.1}
              fill={leaf1}
              animate={{ scale: Math.min(canopyGrowth, 1) }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx - s*0.1}px ${groundY - s*0.3}px` }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            <motion.circle
              cx={cx + s*0.1} cy={groundY - s*0.3} r={s*0.1}
              fill={leaf3}
              animate={{ scale: Math.min(canopyGrowth, 1) }}
              initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx + s*0.1}px ${groundY - s*0.3}px` }}
              transition={{ duration: 0.5, delay: 0.15 }}
            />
          </motion.g>
        )}

        {/* ── FLOWERING (30 min) ────────────────────────────────── */}
        {stage === 'flowering' && (
          <motion.g
            animate={{ ...swayAnim, ...wiltAnim }}
            transition={canSway ? swayTransition : wiltTransition}
            style={{ transformOrigin: `${cx}px ${groundY}px` }}
          >
            <motion.rect
              x={cx - s*0.032} y={groundY - s*0.36}
              width={s*0.064} height={s*0.36} rx={s*0.032}
              fill={trunkColor}
              animate={{ scaleY: trunkGrowth }}
              initial={{ scaleY: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY}px` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <motion.circle cx={cx} cy={groundY - s*0.4} r={s*0.17} fill={leaf2}
              animate={{ scale: Math.min(canopyGrowth*1.2, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.4}px` }}
              transition={{ duration: 0.6, type: 'spring' }} />
            <motion.circle cx={cx - s*0.11} cy={groundY - s*0.3} r={s*0.11} fill={leaf1}
              animate={{ scale: Math.min(canopyGrowth, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx - s*0.11}px ${groundY - s*0.3}px` }}
              transition={{ duration: 0.5, delay: 0.1 }} />
            <motion.circle cx={cx + s*0.11} cy={groundY - s*0.3} r={s*0.11} fill={leaf3}
              animate={{ scale: Math.min(canopyGrowth, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx + s*0.11}px ${groundY - s*0.3}px` }}
              transition={{ duration: 0.5, delay: 0.15 }} />
            {[
              { x: cx - s*0.07, y: groundY - s*0.48 },
              { x: cx + s*0.05, y: groundY - s*0.5 },
              { x: cx + s*0.14, y: groundY - s*0.34 },
              { x: cx - s*0.15, y: groundY - s*0.32 },
              { x: cx, y: groundY - s*0.44 },
            ].map((pos, i) => (
              <motion.circle key={i}
                cx={pos.x} cy={pos.y} r={s*0.028}
                fill={isWilting ? '#F59E0B' : pink}
                animate={{ scale: Math.min(Math.max(0, (flowerGrowth - i*0.15)/0.4), 1) }}
                initial={{ scale: 0 }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                transition={{ duration: 0.3 }} />
            ))}
          </motion.g>
        )}

        {/* ── LARGE (45 min) ────────────────────────────────────── */}
        {stage === 'large' && (
          <motion.g
            animate={{ ...swayAnim, ...wiltAnim }}
            transition={canSway ? swayTransition : wiltTransition}
            style={{ transformOrigin: `${cx}px ${groundY}px` }}
          >
            <motion.rect
              x={cx - s*0.035} y={groundY - s*0.4}
              width={s*0.07} height={s*0.4} rx={s*0.035}
              fill={trunkColor}
              animate={{ scaleY: trunkGrowth }}
              initial={{ scaleY: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY}px` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.circle cx={cx} cy={groundY - s*0.46} r={s*0.2} fill={leaf2}
              animate={{ scale: Math.min(canopyGrowth*1.1, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.46}px` }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 100 }} />
            <motion.circle cx={cx - s*0.13} cy={groundY - s*0.34} r={s*0.13} fill={leaf1}
              animate={{ scale: Math.min(canopyGrowth, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx - s*0.13}px ${groundY - s*0.34}px` }}
              transition={{ duration: 0.6, delay: 0.1 }} />
            <motion.circle cx={cx + s*0.13} cy={groundY - s*0.34} r={s*0.13} fill={leaf3}
              animate={{ scale: Math.min(canopyGrowth, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx + s*0.13}px ${groundY - s*0.34}px` }}
              transition={{ duration: 0.6, delay: 0.15 }} />
            <motion.circle cx={cx} cy={groundY - s*0.58} r={s*0.11} fill={leaf3}
              animate={{ scale: Math.min(canopyGrowth*0.9, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.58}px` }}
              transition={{ duration: 0.5, delay: 0.2 }} />
          </motion.g>
        )}

        {/* ── FULL (60 min) ─────────────────────────────────────── */}
        {stage === 'full' && (
          <motion.g
            animate={{ ...swayAnim, ...wiltAnim }}
            transition={canSway ? swayTransition : wiltTransition}
            style={{ transformOrigin: `${cx}px ${groundY}px` }}
          >
            <motion.rect
              x={cx - s*0.038} y={groundY - s*0.42}
              width={s*0.076} height={s*0.42} rx={s*0.038}
              fill={trunkColor}
              animate={{ scaleY: trunkGrowth }}
              initial={{ scaleY: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY}px` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
            <motion.circle cx={cx} cy={groundY - s*0.48} r={s*0.22} fill={leaf2}
              animate={{ scale: Math.min(canopyGrowth*1.1, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.48}px` }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80 }} />
            <motion.circle cx={cx - s*0.14} cy={groundY - s*0.35} r={s*0.14} fill={leaf1}
              animate={{ scale: Math.min(canopyGrowth, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx - s*0.14}px ${groundY - s*0.35}px` }}
              transition={{ duration: 0.6, delay: 0.1 }} />
            <motion.circle cx={cx + s*0.14} cy={groundY - s*0.35} r={s*0.14} fill={leaf3}
              animate={{ scale: Math.min(canopyGrowth, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx + s*0.14}px ${groundY - s*0.35}px` }}
              transition={{ duration: 0.6, delay: 0.15 }} />
            <motion.circle cx={cx} cy={groundY - s*0.62} r={s*0.12} fill={leaf3}
              animate={{ scale: Math.min(canopyGrowth*0.9, 1) }} initial={{ scale: 0 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.62}px` }}
              transition={{ duration: 0.5, delay: 0.2 }} />
            {[
              { x: cx - s*0.09, y: groundY - s*0.62 },
              { x: cx + s*0.07, y: groundY - s*0.65 },
              { x: cx - s*0.18, y: groundY - s*0.42 },
              { x: cx + s*0.18, y: groundY - s*0.44 },
              { x: cx, y: groundY - s*0.58 },
              { x: cx + s*0.04, y: groundY - s*0.68 },
            ].map((pos, i) => (
              <motion.circle key={i}
                cx={pos.x} cy={pos.y} r={s*0.026}
                fill={isWilting ? '#F59E0B' : pink}
                animate={{ scale: Math.min(Math.max(0, (flowerGrowth - i*0.12)/0.35), 1) }}
                initial={{ scale: 0 }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                transition={{ duration: 0.3 }} />
            ))}
          </motion.g>
        )}

        {/* ── DEAD TREE ─────────────────────────────────────────── */}
        {stage === 'dead' && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.rect
              x={cx - s*0.025} y={groundY - s*0.3}
              width={s*0.05} height={s*0.3} rx={s*0.025}
              fill="#94A3B8"
              animate={{ scaleY: [0, 1] }}
              style={{ transformOrigin: `${cx}px ${groundY}px` }}
              transition={{ duration: 0.4 }}
            />
            <motion.line
              x1={cx} y1={groundY - s*0.22} x2={cx - s*0.1} y2={groundY - s*0.3}
              stroke="#94A3B8" strokeWidth={s*0.025} strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            />
            <motion.line
              x1={cx} y1={groundY - s*0.16} x2={cx + s*0.1} y2={groundY - s*0.24}
              stroke="#94A3B8" strokeWidth={s*0.025} strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            />
            <motion.text
              x={cx} y={groundY - s*0.35}
              textAnchor="middle" fontSize={s*0.14} fill="#EF4444"
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: `${cx}px ${groundY - s*0.35}px` }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >✕</motion.text>
          </motion.g>
        )}

      </g>

      {/* ── COMPLETION BURST ─────────────────────────────────────── */}
      {isComplete && !isDead && !isWilting && sparkles.map((sp, i) => (
        <motion.circle
          key={i}
          cx={cx} cy={groundY - s*0.38}
          r={s*0.022}
          fill={i % 2 === 0 ? '#22C55E' : '#FDE68A'}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: [0, (sp.x - cx) * 0.6, sp.x - cx],
            y: [0, (sp.y - (groundY - s*0.38)) * 0.6, sp.y - (groundY - s*0.38)],
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.06,
            repeat: Infinity,
            repeatDelay: 3.5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Completion glow ring */}
      {isComplete && !isDead && !isWilting && (
        <motion.circle
          cx={cx} cy={groundY - s*0.48}
          r={s*0.24}
          fill="none"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          animate={{ opacity: [0.15, 0.55, 0.15], rotate: [0, 360] }}
          style={{ transformOrigin: `${cx}px ${groundY - s*0.48}px` }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </svg>
  )
}
