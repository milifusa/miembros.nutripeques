'use client'

import { useEffect, useState } from 'react'

function getEndTime() {
  const key = 'np_countdown_end'
  if (typeof window === 'undefined') return Date.now() + 24 * 60 * 60 * 1000
  let end = Number(localStorage.getItem(key))
  if (!end || end < Date.now()) {
    end = Date.now() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000
    localStorage.setItem(key, String(end))
  }
  return end
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
