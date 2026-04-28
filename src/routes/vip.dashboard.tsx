import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Crown, Lock, TrendingUp, TrendingDown, Layers, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/vip/dashboard")({
  head: () => ({
    meta: [
      { title: "VIP Dashboard — SimpleBetHub" },
      { name: "description", content: "Your premium picks, accumulators, and ROI tracker. Subscriber-only access." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: VipDashboard,
});

type VipPick = {
  id: string;
  match: string;
  league: string;
  pick: string;
  odds: number;
  stake_units: number;
  kickoff: string;
  status: "pending" | "won" | "lost" | "void";
  notes: string | null;
};

type VipAcca = {
  id: string;
  title: string;
  total_odds: number;
  stake_units: number;
  status: "pending" | "won" | "lost" | "void";
  legs: { match: string; pick: string; odds: number }[];
  scheduled_for: string;
};

function VipDashboard() {
  const { user, isSubscriber, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!user) {
    return <Gate title="Sign in to access your VIP dashboard" cta="Sign In" to="/auth" />;
  }

  if (!isSubscriber && !isAdmin) {
    return <Gate title="VIP membership required" message="Upgrade to a VIP plan to access daily premium picks, accumulators and the ROI tracker." cta="See VIP Plans" to="/vip" />;
  }

  return <DashboardInner />;
}

function Gate({ title, message, cta, to }: { title: string; message?: string; cta: string; to: "/auth" | "/vip" }) {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-20 text-center">
      <div className="mx-auto h-14 w-14 rounded-xl bg-surface grid place-items-center mb-4">
        <Lock className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-extrabold">{title}</h1>
      {message && <p className="text-sm text-muted-foreground mt-2">{message}</p>}
      <div className="mt-6 flex gap-2 justify-center">
        <Button asChild className="bg-gradient-primary text-primary-foreground"><Link to={to}>{cta}</Link></Button>
        <Button asChild variant="outline"><Link to="/">Go home</Link></Button>
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function statusBadge(status: VipPick["status"]) {
  const map: Record<VipPick["status"], string> = {
    pending: "bg-warning/15 text-warning border-warning/30",
    won: "bg-primary/15 text-primary border-primary/30",
    lost: "bg-destructive/15 text-destructive border-destructive/30",
    void: "bg-muted text-muted-foreground border-border",
  };
  return <Badge variant="secondary" className={map[status]}>{status.toUpperCase()}</Badge>;
}

function DashboardInner() {
  const [picks, setPicks] = useState<VipPick[]>([]);
  const [accas, setAccas] = useState<VipAcca[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    setLoading(true);
    const [picksRes, accasRes] = await Promise.all([
      supabase.from("vip_picks").select("*").order("kickoff", { ascending: false }).limit(100),
      supabase.from("vip_accumulators").select("*").order("scheduled_for", { ascending: false }).limit(50),
    ]);
    if (picksRes.data) setPicks(picksRes.data as VipPick[]);
    if (accasRes.data) {
      setAccas(accasRes.data.map((a: any) => ({
        ...a,
        legs: Array.isArray(a.legs) ? a.legs : [],
      })) as VipAcca[]);
    }
    setLoading(false);
  };

  // ROI calculation: profit in units / total staked
  const settled = picks.filter((p) => p.status === "won" || p.status === "lost");
  const wins = settled.filter((p) => p.status === "won");
  const losses = settled.filter((p) => p.status === "lost");
  const totalStaked = settled.reduce((s, p) => s + Number(p.stake_units), 0);
  const profitUnits = wins.reduce((s, p) => s + (Number(p.odds) - 1) * Number(p.stake_units), 0)
    - losses.reduce((s, p) => s + Number(p.stake_units), 0);
  const roi = totalStaked > 0 ? (profitUnits / totalStaked) * 100 : 0;
  const winRate = settled.length > 0 ? (wins.length / settled.length) * 100 : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysPicks = picks.filter((p) => {
    const k = new Date(p.kickoff);
    return k >= today && k < new Date(today.getTime() + 86400000);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-vip shadow-glow">
              <Crown className="h-5 w-5 text-primary-foreground" />
            </span>
            VIP Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Your premium picks, accumulators and performance tracker.</p>
        </div>
        <Badge variant="secondary" className="bg-vip/15 text-vip border-vip/30">VIP MEMBER</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard label="Today's Picks" value={todaysPicks.length} icon={Target} />
        <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} icon={Trophy} />
        <StatCard
          label="ROI"
          value={`${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%`}
          icon={roi >= 0 ? TrendingUp : TrendingDown}
          tone={roi >= 0 ? "positive" : "negative"}
        />
        <StatCard
          label="Profit (units)"
          value={`${profitUnits >= 0 ? "+" : ""}${profitUnits.toFixed(2)}`}
          icon={Layers}
          tone={profitUnits >= 0 ? "positive" : "negative"}
        />
      </div>

      <Tabs defaultValue="picks" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="picks">Daily Picks</TabsTrigger>
          <TabsTrigger value="accas">Accumulators</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="picks" className="mt-6 space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading picks…</p>}
          {!loading && todaysPicks.length === 0 && (
            <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No picks for today yet — check back soon.</CardContent></Card>
          )}
          {todaysPicks.map((p) => <PickCard key={p.id} pick={p} />)}
        </TabsContent>

        <TabsContent value="accas" className="mt-6 space-y-4">
          {loading && <p className="text-sm text-muted-foreground">Loading accumulators…</p>}
          {!loading && accas.length === 0 && (
            <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No accumulators published yet.</CardContent></Card>
          )}
          {accas.map((a) => (
            <Card key={a.id} className="bg-gradient-card border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold text-lg">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{fmtDate(a.scheduled_for)} • {a.legs.length} legs</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-base px-3 py-1">@ {Number(a.total_odds).toFixed(2)}</Badge>
                    {statusBadge(a.status)}
                  </div>
                </div>
                <ul className="mt-4 divide-y divide-border/40 rounded-lg border border-border/40 bg-surface/40">
                  {a.legs.map((leg, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
                      <div>
                        <span className="font-medium">{leg.match}</span>
                        <span className="text-muted-foreground"> — {leg.pick}</span>
                      </div>
                      <span className="font-bold text-primary">{Number(leg.odds).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-3">
          {settled.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No settled picks yet.</CardContent></Card>
          ) : (
            settled.map((p) => <PickCard key={p.id} pick={p} />)
          )}
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center mt-12">⚠️ 18+ only. Past performance does not guarantee future results. Bet responsibly.</p>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: string | number; icon: any; tone?: "positive" | "negative" }) {
  const valueClass = tone === "positive" ? "text-primary" : tone === "negative" ? "text-destructive" : "";
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${valueClass}`}>{value}</p>
          </div>
          <Icon className="h-8 w-8 text-primary/60" />
        </div>
      </CardContent>
    </Card>
  );
}

function PickCard({ pick }: { pick: VipPick }) {
  return (
    <Card className="bg-gradient-card border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{pick.league} • {fmtDate(pick.kickoff)}</div>
            <div className="font-bold mt-1">{pick.match}</div>
            <div className="text-sm mt-1"><span className="text-muted-foreground">Pick:</span> <span className="font-semibold text-primary">{pick.pick}</span></div>
            {pick.notes && <p className="text-xs text-muted-foreground mt-2">{pick.notes}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-base px-3 py-1">@ {Number(pick.odds).toFixed(2)}</Badge>
            <div className="text-xs text-muted-foreground">Stake: {Number(pick.stake_units).toFixed(2)}u</div>
            {statusBadge(pick.status)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
