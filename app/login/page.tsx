'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Magic link: tokens en el hash de la URL
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', ''))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ data: { session } }) => {
          if (session) {
            const dest = session.user.email?.toLowerCase() === 'nutripequespro@gmail.com'
              ? '/admin'
              : '/configurar-contrasena'
            router.replace(dest)
          }
        })
      return
    }

    // Sesión ya activa → dashboard directamente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const dest = session.user.email?.toLowerCase() === 'nutripequespro@gmail.com'
          ? '/admin'
          : '/dashboard'
        router.replace(dest)
      }
    })
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email o contraseña incorrectos. Revisa tus datos e intenta de nuevo.')
      setLoading(false)
      return
    }

    const dest = email.trim().toLowerCase() === 'nutripequespro@gmail.com' ? '/admin' : '/dashboard'
    router.push(dest)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
            <span className="text-3xl">🥕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">NutriPeques</h1>
          <p className="text-gray-500 text-sm mt-1">Área exclusiva para miembros</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition text-gray-800 placeholder-gray-400"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition text-gray-800 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              {loading ? 'Iniciando sesión...' : 'Entrar al área de miembros'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Problemas para acceder?{' '}
            <a
              href="https://wa.me/5212225067864"
              className="text-teal-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Contáctanos
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Solo disponible para compradoras del Método NutriPeques
        </p>
      </div>
    </main>
  )
}
