'use client'

import { useEffect, useState } from 'react'

// Fecha fija de fin de promoción — cambia esto cuando lances una nueva promo
const PROMO_END = new Date('2026-03-31T23:59:59-06:00').getTime()

function getEndTime() {
  return PROMO_END
}

export function UrgencyCountdown() {
  const [time, setTime] = useState({ h: '23', m: '59', s: '59' })

  useEffect(() => {
    const end = getEndTime()
    function tick() {
      const diff = Math.max(0, end - Date.now())
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTime({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span>
      ⌛ OFERTA TERMINA EN{' '}
      <strong>{time.h}</strong>:<strong>{time.m}</strong>:
      <strong>{time.s}</strong>
    </span>
  )
}

export function HeroCountdown() {
  const [time, setTime] = useState({ h: 23, m: 59, s: 59 })

  useEffect(() => {
    const end = getEndTime()
    function tick() {
      const diff = Math.max(0, end - Date.now())
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  const box = (val: number, label: string) => (
    <div style={{ background: 'rgba(255,255,255,.2)', borderRadius: 12, padding: '12px 20px', textAlign: 'center', minWidth: 70 }}>
      <span style={{ display: 'block', fontSize: 32, fontWeight: 700, fontFamily: "'Fredoka', sans-serif" }}>{pad(val)}</span>
      <span style={{ fontSize: 12, opacity: .85 }}>{label}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
      {box(time.h, 'Horas')}
      {box(time.m, 'Min')}
      {box(time.s, 'Segs')}
    </div>
  )
}
