CREATE TABLE public.photo_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id text NOT NULL,
  reason text,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.photo_reports TO anon;
GRANT SELECT, INSERT ON public.photo_reports TO authenticated;
GRANT ALL ON public.photo_reports TO service_role;
ALTER TABLE public.photo_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can report a photo" ON public.photo_reports FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read photo reports" ON public.photo_reports FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX photo_reports_public_id_idx ON public.photo_reports (public_id);