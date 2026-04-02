'use client'

import { useState, useEffect, useRef } from 'react'

type Categoria = { id: string; nombre: string; icono: string; orden: number }
type Recurso = {
  id: string
  categoria_id: string | null
  titulo: string
  descripcion: string | null
  pdf_url: string
  imagen_url: string | null
  orden: number
  producto_id: string | null
}

const PRODUCTOS_OPCIONES = [
  { id: null,                 label: '🌟 Plan completo (todos los miembros)',       bg: '#F0FDF4', color: '#15803d' },
  { id: 'guia_ac',            label: '🥣 Guía inicio AC — 4 semanas',              bg: '#F0FDFA', color: '#0d9488' },
  { id: 'menu_anemia',        label: '🩸 Menú anti anemia completo',               bg: '#FFF1F2', color: '#e11d48' },
  { id: 'recetario_50',       label: '🍳 Recetario 50 recetas',                    bg: '#FEF3C7', color: '#D97706' },
  { id: 'metodo_nutripeques', label: '🌟 NutriPeques completo (exclusivo $299)',    bg: '#FFF7ED', color: '#E8821A' },
]

const ICONOS_SUGERIDOS = ['📄','📚','🥕','🍎','🍼','🥗','🩺','⚠️','🤲','🍽️','🩸','🐟','🥞','🍲','📋','🌿','💡','🎯','📝','🔑']

export default function RecursosManager() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [recursos, setRecursos] = useState<Recurso[]>([])
  const [catSeleccionada, setCatSeleccionada] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Formulario categoría
  const [showCatForm, setShowCatForm] = useState(false)
  const [catNombre, setCatNombre] = useState('')
  const [catIcono, setCatIcono] = useState('📄')
  const [catOrden, setCatOrden] = useState(0)
  const [savingCat, setSavingCat] = useState(false)

  // Formulario recurso
  const [showRecursoForm, setShowRecursoForm] = useState(false)
  const [rTitulo, setRTitulo] = useState('')
  const [rDescripcion, setRDescripcion] = useState('')
  const [rOrden, setROrden] = useState(0)
  const [rProductoId, setRProductoId] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [pdfPreview, setPdfPreview] = useState('')
  const [imagenPreview, setImagenPreview] = useState('')
  const [savingRecurso, setSavingRecurso] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const imgInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [catRes, recRes] = await Promise.all([
      fetch('/api/admin/categorias').then(r => r.json()),
      fetch('/api/admin/recursos').then(r => r.json()),
    ])
    setCategorias(catRes)
    setRecursos(recRes)
    setLoading(false)
  }

  async function uploadFile(file: File, tipo: string): Promise<string> {
    const ext = file.name.split('.').pop()

    // 1. Pedir URL firmada al servidor
    const res = await fetch('/api/admin/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, ext }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error)

    // 2. Subir directo a Supabase (sin límite de tamaño del servidor)
    const uploadRes = await fetch(json.signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
    if (!uploadRes.ok) throw new Error('Error al subir el archivo a Storage')

    // 3. Construir URL pública
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/recursos/${json.path}`
  }

  async function guardarCategoria() {
    if (!catNombre.trim()) return
    setSavingCat(true)
    const res = await fetch('/api/admin/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: catNombre.trim(), icono: catIcono, orden: catOrden }),
    })
    if (res.ok) {
      await fetchAll()
      setCatNombre(''); setCatIcono('📄'); setCatOrden(0); setShowCatForm(false)
    }
    setSavingCat(false)
  }

  async function eliminarCategoria(id: string) {
    if (!confirm('¿Eliminar esta categoría y todos sus recursos?')) return
    await fetch(`/api/admin/categorias?id=${id}`, { method: 'DELETE' })
    if (catSeleccionada === id) setCatSeleccionada(null)
    await fetchAll()
  }

  async function guardarRecurso() {
    if (!rTitulo.trim() || (!pdfFile && !pdfPreview)) return
    setSavingRecurso(true)
    try {
      let pdf_url = pdfPreview
      let imagen_url = imagenPreview || null

      if (pdfFile) {
        setUploadProgress('Subiendo PDF...')
        pdf_url = await uploadFile(pdfFile, 'pdf')
      }
      if (imagenFile) {
        setUploadProgress('Subiendo imagen...')
        imagen_url = await uploadFile(imagenFile, 'imagen')
      }

      setUploadProgress('Guardando...')
      const res = await fetch('/api/admin/recursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoria_id: catSeleccionada,
          titulo: rTitulo.trim(),
          descripcion: rDescripcion.trim() || null,
          pdf_url,
          imagen_url,
          orden: rOrden,
          producto_id: rProductoId,
        }),
      })
      if (res.ok) {
        await fetchAll()
        resetRecursoForm()
      }
    } catch (e) {
      alert('Error al subir archivo: ' + (e as Error).message)
    }
    setUploadProgress('')
    setSavingRecurso(false)
  }

  function resetRecursoForm() {
    setRTitulo(''); setRDescripcion(''); setROrden(0); setRProductoId(null)
    setPdfFile(null); setImagenFile(null); setPdfPreview(''); setImagenPreview('')
    setShowRecursoForm(false)
    if (pdfInputRef.current) pdfInputRef.current.value = ''
    if (imgInputRef.current) imgInputRef.current.value = ''
  }

  async function eliminarRecurso(id: string) {
    if (!confirm('¿Eliminar este recurso?')) return
    await fetch(`/api/admin/recursos?id=${id}`, { method: 'DELETE' })
    await fetchAll()
  }

  const recursosCat = catSeleccionada
    ? recursos.filter(r => r.categoria_id === catSeleccionada)
    : recursos.filter(r => !r.categoria_id)

  if (loading) return <p style={{ color: '#9ca3af', padding: 32 }}>Cargando recursos...</p>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

      {/* ── Panel izquierdo: Categorías ── */}
      <div>
        <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 1px 6px rgba(0,0,0,.06)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 600, color: '#1f2937' }}>Categorías</span>
            <button
              onClick={() => setShowCatForm(v => !v)}
              style={{ background: '#0D9488', color: 'white', border: 'none', borderRadius: 10, padding: '5px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              + Nueva
            </button>
          </div>

          {/* Form nueva categoría */}
          {showCatForm && (
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', background: '#f8fafc' }}>
              <input
                placeholder="Nombre de categoría"
                value={catNombre}
                onChange={e => setCatNombre(e.target.value)}
                style={inputStyle}
              />
              <p style={{ fontSize: 12, color: '#6b7280', margin: '10px 0 6px', fontWeight: 600 }}>Icono</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {ICONOS_SUGERIDOS.map(ic => (
                  <button
                    key={ic}
                    onClick={() => setCatIcono(ic)}
                    style={{
                      fontSize: 20, background: catIcono === ic ? '#CCFBF1' : '#f3f4f6',
                      border: catIcono === ic ? '2px solid #0D9488' : '2px solid transparent',
                      borderRadius: 8, width: 36, height: 36, cursor: 'pointer',
                    }}
                  >
                    {ic}
                  </button>
                ))}
                <input
                  placeholder="otro"
                  value={ICONOS_SUGERIDOS.includes(catIcono) ? '' : catIcono}
                  onChange={e => setCatIcono(e.target.value)}
                  style={{ ...inputStyle, width: 60, fontSize: 20, textAlign: 'center', padding: '4px 8px' }}
                />
              </div>
              <input
                type="number"
                placeholder="Orden (0, 1, 2...)"
                value={catOrden}
                onChange={e => setCatOrden(Number(e.target.value))}
                style={{ ...inputStyle, marginBottom: 10 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={guardarCategoria} disabled={savingCat || !catNombre.trim()} style={btnPrimary}>
                  {savingCat ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => setShowCatForm(false)} style={btnSecondary}>Cancelar</button>
              </div>
            </div>
          )}

          {/* Lista categorías */}
          <div>
            {categorias.length === 0 && (
              <p style={{ padding: '20px', color: '#9ca3af', fontSize: 14, textAlign: 'center' }}>Sin categorías aún</p>
            )}
            {categorias.map(cat => (
              <div
                key={cat.id}
                onClick={() => setCatSeleccionada(cat.id === catSeleccionada ? null : cat.id)}
                style={{
                  padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', borderBottom: '1px solid #f9fafb',
                  background: catSeleccionada === cat.id ? '#F0FDFA' : 'white',
                  borderLeft: catSeleccionada === cat.id ? '3px solid #0D9488' : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: 22 }}>{cat.icono}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#1f2937', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.nombre}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
                    {recursos.filter(r => r.categoria_id === cat.id).length} recursos · orden {cat.orden}
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); eliminarCategoria(cat.id) }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, padding: 4 }}
                  title="Eliminar categoría"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panel derecho: Recursos ── */}
      <div>
        <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 1px 6px rgba(0,0,0,.06)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 600, color: '#1f2937' }}>
                {catSeleccionada
                  ? (categorias.find(c => c.id === catSeleccionada)?.icono + ' ' + categorias.find(c => c.id === catSeleccionada)?.nombre)
                  : 'Sin categoría'}
              </span>
              <span style={{ marginLeft: 10, background: '#CCFBF1', color: '#0d9488', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 10 }}>
                {recursosCat.length} recursos
              </span>
            </div>
            <button
              onClick={() => setShowRecursoForm(v => !v)}
              style={{ background: '#E8821A', color: 'white', border: 'none', borderRadius: 10, padding: '5px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              + Nuevo PDF
            </button>
          </div>

          {/* Form nuevo recurso */}
          {showRecursoForm && (
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: '#fffdf5' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Título *</label>
                  <input placeholder="Ej: Guía de inicio AC" value={rTitulo} onChange={e => setRTitulo(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Orden</label>
                  <input type="number" value={rOrden} onChange={e => setROrden(Number(e.target.value))} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Descripción</label>
                <textarea
                  placeholder="Breve descripción del recurso..."
                  value={rDescripcion}
                  onChange={e => setRDescripcion(e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>🔑 ¿Quién puede ver este recurso? *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {PRODUCTOS_OPCIONES.map(p => (
                    <button
                      key={String(p.id)}
                      type="button"
                      onClick={() => setRProductoId(p.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 14px', borderRadius: 10, textAlign: 'left',
                        border: `2px solid ${rProductoId === p.id ? p.color : '#e5e7eb'}`,
                        background: rProductoId === p.id ? p.bg : 'white',
                        cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                        color: rProductoId === p.id ? p.color : '#6b7280',
                        transition: 'all .12s',
                      }}
                    >
                      <span style={{ fontSize: 16, flexShrink: 0 }}>
                        {rProductoId === p.id ? '●' : '○'}
                      </span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>📄 Archivo PDF *</label>
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={e => { const f = e.target.files?.[0]; if (f) { setPdfFile(f); setPdfPreview('') } }}
                    style={{ display: 'none' }}
                    id="pdf-input"
                  />
                  <label htmlFor="pdf-input" style={fileLabel}>
                    {pdfFile ? `✅ ${pdfFile.name}` : '+ Seleccionar PDF'}
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>🖼 Imagen de portada</label>
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => { const f = e.target.files?.[0]; if (f) { setImagenFile(f); setImagenPreview('') } }}
                    style={{ display: 'none' }}
                    id="img-input"
                  />
                  <label htmlFor="img-input" style={fileLabel}>
                    {imagenFile ? `✅ ${imagenFile.name}` : '+ Seleccionar imagen'}
                  </label>
                </div>
              </div>
              {uploadProgress && (
                <p style={{ fontSize: 13, color: '#0D9488', fontWeight: 600, marginBottom: 10 }}>⏳ {uploadProgress}</p>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={guardarRecurso} disabled={savingRecurso || !rTitulo.trim() || (!pdfFile && !pdfPreview)} style={btnPrimary}>
                  {savingRecurso ? 'Guardando...' : 'Guardar recurso'}
                </button>
                <button onClick={resetRecursoForm} style={btnSecondary}>Cancelar</button>
              </div>
            </div>
          )}

          {/* Lista recursos */}
          <div>
            {recursosCat.length === 0 && (
              <p style={{ padding: '32px', color: '#9ca3af', fontSize: 14, textAlign: 'center' }}>
                {catSeleccionada ? 'No hay recursos en esta categoría' : 'Selecciona una categoría para ver sus recursos'}
              </p>
            )}
            {recursosCat.map(r => (
              <div key={r.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f9fafb', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* Imagen */}
                <div style={{ width: 64, height: 64, borderRadius: 12, background: '#f3f4f6', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {r.imagen_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={r.imagen_url} alt={r.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 28 }}>📄</span>
                  }
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#1f2937', fontSize: 15 }}>{r.titulo}</p>
                  {r.descripcion && <p style={{ margin: '0 0 6px', color: '#6b7280', fontSize: 13 }}>{r.descripcion}</p>}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <a href={r.pdf_url} target="_blank" rel="noreferrer"
                      style={{ background: '#DBEAFE', color: '#1d4ed8', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 8, textDecoration: 'none' }}
                    >
                      📥 Ver PDF
                    </a>
                    {(() => {
                      const p = PRODUCTOS_OPCIONES.find(o => o.id === r.producto_id)
                      return p ? (
                        <span style={{ background: p.bg, color: p.color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>
                          {p.label.split(' ').slice(0, 2).join(' ')}
                        </span>
                      ) : (
                        <span style={{ background: '#f3f4f6', color: '#9ca3af', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 8 }}>
                          Sin producto
                        </span>
                      )
                    })()}
                    <span style={{ color: '#d1d5db', fontSize: 12 }}>orden: {r.orden}</span>
                  </div>
                </div>
                {/* Eliminar */}
                <button
                  onClick={() => eliminarRecurso(r.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18, padding: 4, flexShrink: 0 }}
                  title="Eliminar recurso"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb',
  fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  background: 'white', color: '#1f2937',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 5,
}
const fileLabel: React.CSSProperties = {
  display: 'block', padding: '9px 12px', borderRadius: 10, border: '1.5px dashed #d1d5db',
  fontSize: 13, color: '#6b7280', cursor: 'pointer', textAlign: 'center',
  background: '#f9fafb', fontFamily: 'inherit',
}
const btnPrimary: React.CSSProperties = {
  background: '#0D9488', color: 'white', border: 'none', borderRadius: 10,
  padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
}
const btnSecondary: React.CSSProperties = {
  background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: 10,
  padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
}
