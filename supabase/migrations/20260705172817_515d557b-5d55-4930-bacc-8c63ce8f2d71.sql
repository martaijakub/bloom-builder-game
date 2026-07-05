
CREATE TABLE public.seating_plan (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.seating_plan TO anon, authenticated;
GRANT ALL ON public.seating_plan TO service_role;

ALTER TABLE public.seating_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read seating plan"
ON public.seating_plan FOR SELECT
USING (true);

-- Seed with initial data
INSERT INTO public.seating_plan (id, data) VALUES ('main', '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;
