-- Ideas de cumpleaños (una por hijo por mes)
CREATE TABLE IF NOT EXISTS ideas_cumpleanos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hijo_id uuid REFERENCES hijos(id) ON DELETE CASCADE,
  mes text NOT NULL, -- format: 'YYYY-MM'
  edad_meses integer NOT NULL,
  num_invitados integer,
  pais text,
  resultado jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ideas_cumpleanos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuarios ven sus ideas cumpleanos" ON ideas_cumpleanos
  FOR ALL USING (auth.uid() = usuario_id);

-- Caché de sustitutos por usuario + ingrediente + edad
CREATE TABLE IF NOT EXISTS sustitutos_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ingrediente text NOT NULL,
  edad_meses integer NOT NULL,
  contexto text,
  resultado jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  consultado_at timestamptz DEFAULT now()
);
ALTER TABLE sustitutos_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuarios ven sus sustitutos cache" ON sustitutos_cache
  FOR ALL USING (auth.uid() = usuario_id);
