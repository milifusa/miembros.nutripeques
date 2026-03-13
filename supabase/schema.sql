-- =============================================
-- NutriPeques - Esquema de base de datos
-- Ejecutar en el SQL Editor de Supabase
-- =============================================

-- Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- =============================================
-- TABLA: usuarios
-- Extiende auth.users de Supabase
-- =============================================
create table if not exists public.usuarios (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  nombre text,
  fecha_compra timestamptz not null default now(),
  productos_activos text[] not null default '{}',
  edad_bebe_meses int check (edad_bebe_meses >= 6 and edad_bebe_meses <= 24),
  nombre_bebe text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger para actualizar updated_at automáticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_usuarios_updated
  before update on public.usuarios
  for each row execute procedure public.handle_updated_at();

-- =============================================
-- TABLA: sesiones
-- Control de sesión única por usuario
-- =============================================
create table if not exists public.sesiones (
  id uuid default uuid_generate_v4() primary key,
  usuario_id uuid references public.usuarios(id) on delete cascade not null,
  token text not null unique,
  dispositivo text,
  ip text,
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  ultimo_acceso timestamptz not null default now()
);

create index idx_sesiones_usuario_id on public.sesiones(usuario_id);
create index idx_sesiones_token on public.sesiones(token);

-- =============================================
-- TABLA: bitacora_bebe
-- Registro de alimentos introducidos
-- =============================================
create table if not exists public.bitacora_bebe (
  id uuid default uuid_generate_v4() primary key,
  usuario_id uuid references public.usuarios(id) on delete cascade not null,
  alimento text not null,
  fecha_introduccion date not null default current_date,
  reaccion text not null default 'ninguna' check (reaccion in ('ninguna', 'leve', 'moderada')),
  aceptacion int not null default 3 check (aceptacion >= 1 and aceptacion <= 5),
  notas text,
  created_at timestamptz not null default now()
);

create index idx_bitacora_usuario_id on public.bitacora_bebe(usuario_id);

-- =============================================
-- TABLA: busquedas_ia
-- Historial del buscador IA por usuaria
-- =============================================
create table if not exists public.busquedas_ia (
  id uuid default uuid_generate_v4() primary key,
  usuario_id uuid references public.usuarios(id) on delete cascade not null,
  consulta text not null,
  respuesta text not null,
  created_at timestamptz not null default now()
);

create index idx_busquedas_usuario_id on public.busquedas_ia(usuario_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuaria solo accede a sus propios datos
-- =============================================

alter table public.usuarios enable row level security;
alter table public.sesiones enable row level security;
alter table public.bitacora_bebe enable row level security;
alter table public.busquedas_ia enable row level security;

-- Políticas: usuarios
create policy "usuarios_select_own" on public.usuarios
  for select using (auth.uid() = id);

create policy "usuarios_update_own" on public.usuarios
  for update using (auth.uid() = id);

-- Políticas: sesiones
create policy "sesiones_select_own" on public.sesiones
  for select using (auth.uid() = usuario_id);

-- Políticas: bitacora_bebe
create policy "bitacora_select_own" on public.bitacora_bebe
  for select using (auth.uid() = usuario_id);

create policy "bitacora_insert_own" on public.bitacora_bebe
  for insert with check (auth.uid() = usuario_id);

create policy "bitacora_update_own" on public.bitacora_bebe
  for update using (auth.uid() = usuario_id);

create policy "bitacora_delete_own" on public.bitacora_bebe
  for delete using (auth.uid() = usuario_id);

-- Políticas: busquedas_ia
create policy "busquedas_select_own" on public.busquedas_ia
  for select using (auth.uid() = usuario_id);

create policy "busquedas_insert_own" on public.busquedas_ia
  for insert with check (auth.uid() = usuario_id);

-- =============================================
-- FUNCIÓN: crear usuario al hacer compra
-- Llamada desde el webhook de Hotmart via service_role
-- =============================================
create or replace function public.crear_usuario_hotmart(
  p_email text,
  p_nombre text,
  p_producto text,
  p_password text
)
returns json as $$
declare
  v_user_id uuid;
  v_result json;
begin
  -- Intentar obtener usuario existente
  select id into v_user_id
  from auth.users
  where email = p_email;

  if v_user_id is null then
    -- El usuario se crea via Admin API desde la API route
    raise exception 'Usuario no encontrado: %', p_email;
  end if;

  -- Insertar o actualizar en tabla usuarios
  insert into public.usuarios (id, email, nombre, productos_activos)
  values (v_user_id, p_email, p_nombre, array[p_producto])
  on conflict (id) do update
    set productos_activos = array_append(
      array_remove(public.usuarios.productos_activos, p_producto),
      p_producto
    ),
    updated_at = now();

  return json_build_object('success', true, 'user_id', v_user_id);
end;
$$ language plpgsql security definer;
