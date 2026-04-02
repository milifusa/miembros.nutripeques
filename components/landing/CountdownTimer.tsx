'use client'

import { useEffect, useState } from 'react'

// Fecha fija de fin de promoción — cambia esto cuando lances una nueva promo
const PROMO_END = new Date('2026-04-06T23:59:59-06:00').getTime()

function calcTime() {
  const diff = Math.max(0, PROMO_END - Date.now())
  const totalSeconds = Math.floor(diff / 1000)
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return { d, h, m, s }
}

const pad = (n: number) => String(n).padStart(2, '0')

export function UrgencyCountdown() {
  const [time, setTime] = useState<ReturnType<typeof calcTime> | null>(null)

  useEffect(() => {
    setTime(calcTime())
    const id = setInterval(() => setTime(calcTime()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return <span>⌛ OFERTA POR TIEMPO LIMITADO</span>

  return (
    <span>
      ⌛ OFERTA TERMINA EN{' '}
      {time.d > 0 && <><strong>{time.d}</strong>d </>}
      <strong>{pad(time.h)}</strong>:<strong>{pad(time.m)}</strong>:
      <strong>{pad(time.s)}</strong>
    </span>
  )
}

export function HeroCountdown() {
  const [time, setTime] = useState<ReturnType<typeof calcTime> | null>(null)

  useEffect(() => {
    setTime(calcTime())
    const id = setInterval(() => setTime(calcTime()), 1000)
    return () => clearInterval(id)
  }, [])

  const box = (val: number, label: string) => (
    <div style={{ background: 'rgba(255,255,255,.2)', borderRadius: 12, padding: '12px 20px', textAlign: 'center', minWidth: 70 }}>
      <span style={{ display: 'block', fontSize: 32, fontWeight: 700, fontFamily: "'Fredoka', sans-serif" }}>{pad(val)}</span>
      <span style={{ fontSize: 12, opacity: .85 }}>{label}</span>
    </div>
  )

  if (!time) return <div style={{ height: 82, marginBottom: 24 }} />

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
      {time.d > 0 && box(time.d, 'Días')}
      {box(time.h, 'Horas')}
      {box(time.m, 'Min')}
      {box(time.s, 'Segs')}
    </div>
  )
}
