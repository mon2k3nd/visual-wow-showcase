CREATE TABLE public.wedding_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 1 AND 100),
  phone text CHECK (phone IS NULL OR char_length(phone) BETWEEN 8 AND 20),
  guest_count integer NOT NULL DEFAULT 1 CHECK (guest_count BETWEEN 1 AND 20),
  vegetarian boolean NOT NULL DEFAULT false,
  children boolean NOT NULL DEFAULT false,
  note text CHECK (note IS NULL OR char_length(note) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.wedding_rsvps TO anon, authenticated;
GRANT ALL ON public.wedding_rsvps TO service_role;
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests can submit RSVP"
ON public.wedding_rsvps FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE TABLE public.wedding_wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 1 AND 100),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wedding_wishes TO anon, authenticated;
GRANT ALL ON public.wedding_wishes TO service_role;
ALTER TABLE public.wedding_wishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read wedding wishes"
ON public.wedding_wishes FOR SELECT TO anon, authenticated
USING (true);
CREATE POLICY "Guests can send wedding wishes"
ON public.wedding_wishes FOR INSERT TO anon, authenticated
WITH CHECK (true);