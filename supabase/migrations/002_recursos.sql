-- =============================================
-- NutriPeques — Recursos y Categorías
-- Ejecutar en el SQL Editor de Supabase
-- =============================================

-- Categorías de recursos
create table if not exists public.categorias_recursos (
  id        uuid default uuid_generate_v4() primary key,
  nombre    text not null,
  icono     text not null default '📄',
  orden     int  not null default 0,
  created_at timestamptz not null default now()
);

-- Recursos (PDFs con imagen y metadatos)
create table if not exists public.recursos (
  id           uuid default uuid_generate_v4() primary key,
  categoria_id uuid references public.categorias_recursos(id) on delete cascade,
  titulo       text not null,
  descripcion  text,
  pdf_url      text not null,
  imagen_url   text,
  orden        int  not null default 0,
  created_at   timestamptz not null default now()
);

-- RLS
alter table public.categorias_recursos enable row level security;
alter table public.recursos enable row level security;

-- Miembros autenticados pueden leer
create policy "categorias_select_auth" on public.categorias_recursos
  for select using (auth.role() = 'authenticated');

create policy "recursos_select_auth" on public.recursos
  for select using (auth.role() = 'authenticated');

-- =============================================
-- STORAGE: crear bucket "recursos" en Supabase
-- Dashboard → Storage → New bucket
-- Nombre: recursos  |  Public: true
-- =============================================
