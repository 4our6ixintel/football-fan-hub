import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MatchCard } from "@/components/site/MatchCard";
import { featuredMatches } from "@/lib/data";
import { Sparkles, Target, Layers } from "lucide-react";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Daily Football Predictions — SimpleBetHub" },
      { name: "description", content: "Free daily football predictions with confidence levels: 1X2, BTTS, Over/Under and accumulator suggestions." },
      { property: "og:title", content: "Daily Football Predictions — SimpleBetHub" },
      { property: "og:description", content: "AI-backed tips with verified track record." },
    ],
  }),
  component: Predictions,
});

function Predictions() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader icon={<Sparkles className="h-6 w-6 text-primary" />} title="Daily Predictions" subtitle="Updated every morning. Confidence ratings powered by our model." />

      <Tabs defaultValue="all" className="mt-8">
        <TabsList className="bg-surface flex flex-wrap h-auto">
          <TabsTrigger value="all">All Tips</TabsTrigger>
          <TabsTrigger value="btts">BTTS</TabsTrigger>
          <TabsTrigger value="ou">Over / Under</TabsTrigger>
          <TabsTrigger value="acca">Accumulator</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </TabsContent>
        <TabsContent value="btts" className="mt-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredMatches.filter(m => m.prediction.includes("BTTS") || m.prediction.includes("Both")).map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </TabsContent>
        <TabsContent value="ou" className="mt-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredMatches.filter(m => m.prediction.toLowerCase().includes("over") || m.prediction.toLowerCase().includes("under")).map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </TabsContent>
        <TabsContent value="acca" className="mt-6">
          <div className="rounded-xl bg-gradient-card border border-border/60 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-lg bg-primary/15 grid place-items-center"><Layers className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="font-bold text-lg">Today's 5-Fold Accumulator</h3>
                <p className="text-sm text-muted-foreground">Combined odds: <span className="text-primary font-bold">28.45</span></p>
              </div>
              <span className="ml-auto px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center gap-1"><Target className="h-3 w-3"/> 84% confidence</span>
            </div>
            <ul className="space-y-3">
              {featuredMatches.slice(0,5).map((m,i) => (
                <li key={m.id} className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border/40">
                  <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{m.home} vs {m.away}</div>
                    <div className="text-xs text-muted-foreground">{m.league} • {m.kickoff}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{m.prediction}</div>
                    <div className="text-sm font-bold text-primary">{m.odds.home.toFixed(2)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function PageHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 grid place-items-center">{icon}</div>
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
