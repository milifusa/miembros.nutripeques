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
          hijo_activo_id: string | null
          monto_pago: number | null
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
          hijo_activo_id?: string | null
          monto_pago?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          nombre?: string | null
          hijo_activo_id?: string | null
          updated_at?: string
        }
      }
      hijos: {
        Row: {
          id: string
          usuario_id: string
          nombre: string
          fecha_nacimiento: string
          pais: string | null
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          nombre: string
          fecha_nacimiento: string
          pais?: string | null
          created_at?: string
        }
        Update: {
          nombre?: string
          fecha_nacimiento?: string
          pais?: string | null
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
          hijo_id: string | null
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
          hijo_id?: string | null
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
          query: string
          respuesta: string
          edad_meses: number | null
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          query: string
          respuesta: string
          edad_meses?: number | null
          created_at?: string
        }
        Update: never
      }
      menus_semanales: {
        Row: {
          id: string
          usuario_id: string
          hijo_id: string | null
          semana: string
          edad_meses: number | null
          contenido: Json
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          hijo_id?: string | null
          semana: string
          edad_meses?: number | null
          contenido: Json
          created_at?: string
        }
        Update: {
          contenido?: Json
          edad_meses?: number | null
        }
      }
      recetas_guardadas: {
        Row: {
          id: string
          usuario_id: string
          hijo_id: string | null
          nombre: string
          emoji: string | null
          descripcion: string | null
          tiempo_preparacion: number | null
          tiempo_coccion: number | null
          porciones: string | null
          ingredientes: string[] | null
          preparacion: string[] | null
          nutricion: Record<string, string> | null
          alergenos: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          hijo_id?: string | null
          nombre: string
          emoji?: string | null
          descripcion?: string | null
          tiempo_preparacion?: number | null
          tiempo_coccion?: number | null
          porciones?: string | null
          ingredientes?: string[] | null
          preparacion?: string[] | null
          nutricion?: Record<string, string> | null
          alergenos?: string[] | null
          created_at?: string
        }
        Update: never
      }
      ideas_cumpleanos: {
        Row: {
          id: string
          usuario_id: string
          hijo_id: string | null
          mes: string
          edad_meses: number
          num_invitados: number | null
          pais: string | null
          resultado: Json
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          hijo_id?: string | null
          mes: string
          edad_meses: number
          num_invitados?: number | null
          pais?: string | null
          resultado: Json
          created_at?: string
        }
        Update: {
          resultado?: Json
        }
        Relationships: []
      }
      sustitutos_cache: {
        Row: {
          id: string
          usuario_id: string
          ingrediente: string
          edad_meses: number
          contexto: string | null
          resultado: Json
          created_at: string
          consultado_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          ingrediente: string
          edad_meses: number
          contexto?: string | null
          resultado: Json
          created_at?: string
          consultado_at?: string
        }
        Update: {
          consultado_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
