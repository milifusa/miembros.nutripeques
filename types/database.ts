export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string | null
          fecha_compra: string
          productos_activos: string[]
          edad_bebe_meses: number | null
          nombre_bebe: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nombre?: string | null
          fecha_compra?: string
          productos_activos?: string[]
          edad_bebe_meses?: number | null
          nombre_bebe?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string | null
          fecha_compra?: string
          productos_activos?: string[]
          edad_bebe_meses?: number | null
          nombre_bebe?: string | null
          updated_at?: string
        }
      }
      sesiones: {
        Row: {
          id: string
          usuario_id: string
          token: string
          dispositivo: string | null
          ip: string | null
          activa: boolean
          created_at: string
          ultimo_acceso: string
        }
        Insert: {
          id?: string
          usuario_id: string
          token: string
          dispositivo?: string | null
          ip?: string | null
          activa?: boolean
          created_at?: string
          ultimo_acceso?: string
        }
        Update: {
          activa?: boolean
          ultimo_acceso?: string
        }
      }
      bitacora_bebe: {
        Row: {
          id: string
          usuario_id: string
          alimento: string
          fecha_introduccion: string
          reaccion: 'ninguna' | 'leve' | 'moderada'
          aceptacion: number
          notas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          alimento: string
          fecha_introduccion: string
          reaccion: 'ninguna' | 'leve' | 'moderada'
          aceptacion: number
          notas?: string | null
          created_at?: string
        }
        Update: {
          alimento?: string
          fecha_introduccion?: string
          reaccion?: 'ninguna' | 'leve' | 'moderada'
          aceptacion?: number
          notas?: string | null
        }
      }
      busquedas_ia: {
        Row: {
          id: string
          usuario_id: string
          consulta: string
          respuesta: string
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          consulta: string
          respuesta: string
          created_at?: string
        }
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
