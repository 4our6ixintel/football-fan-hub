-- VIP picks (daily premium tips)
CREATE TABLE public.vip_picks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match TEXT NOT NULL,
  league TEXT NOT NULL,
  pick TEXT NOT NULL,
  odds NUMERIC(6,2) NOT NULL DEFAULT 1.00,
  stake_units NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  kickoff TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT vip_picks_status_chk CHECK (status IN ('pending','won','lost','void'))
);

ALTER TABLE public.vip_picks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscribers and admins can view vip picks"
  ON public.vip_picks FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'subscriber'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert vip picks"
  ON public.vip_picks FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update vip picks"
  ON public.vip_picks FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete vip picks"
  ON public.vip_picks FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_vip_picks_updated
  BEFORE UPDATE ON public.vip_picks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_vip_picks_kickoff ON public.vip_picks(kickoff DESC);

-- VIP accumulators
CREATE TABLE public.vip_accumulators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  total_odds NUMERIC(8,2) NOT NULL DEFAULT 1.00,
  stake_units NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  status TEXT NOT NULL DEFAULT 'pending',
  legs JSONB NOT NULL DEFAULT '[]'::jsonb,
  scheduled_for TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT vip_accas_status_chk CHECK (status IN ('pending','won','lost','void'))
);

ALTER TABLE public.vip_accumulators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscribers and admins can view vip accas"
  ON public.vip_accumulators FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'subscriber'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert vip accas"
  ON public.vip_accumulators FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update vip accas"
  ON public.vip_accumulators FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete vip accas"
  ON public.vip_accumulators FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_vip_accas_updated
  BEFORE UPDATE ON public.vip_accumulators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_vip_accas_scheduled ON public.vip_accumulators(scheduled_for DESC);