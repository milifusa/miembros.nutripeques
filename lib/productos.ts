export const PRODUCTOS = {
  metodo_nutripeques: { id: 'metodo_nutripeques', nombre: 'NutriPeques Completo', emoji: '🌟', precio: 29900, descripcion: 'Acceso completo a toda la plataforma' },
  guia_ac:            { id: 'guia_ac',            nombre: 'Guía inicio AC — 4 semanas', emoji: '🥣', precio: 9900, descripcion: 'Guía de 4 semanas para inicio de AC' },
  menu_anemia:        { id: 'menu_anemia',         nombre: 'Menú anti anemia completo', emoji: '🩸', precio: 9900, descripcion: 'Menú completo para prevenir anemia' },
  recetario_50:       { id: 'recetario_50',        nombre: 'Recetario 50 recetas', emoji: '🍳', precio: 9900, descripcion: '50 recetas para bebés' },
} as const

export type ProductoId = keyof typeof PRODUCTOS

export function tieneAccesoCompleto(productosActivos: string[]): boolean {
  return productosActivos.includes('metodo_nutripeques')
}
