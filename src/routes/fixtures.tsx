import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { featuredMatches } from "@/lib/data";
import { PageHeader } from "./predictions";

export const Route = createFileRoute("/fixtures")({
  head: () => ({
    meta: [
      { title: "Fixtures, Live Scores & Results — SimpleBetHub" },
      { name: "description", content: "Upcoming football fixtures, live scores and past results from major leagues worldwide." },
      { property: "og:title", content: "Fixtures & Live Scores — SimpleBetHub" },
      { property: "og:description", content: "Stay updated with live football across the globe." },
    ],
  }),
  component: Fixtures,
});

function Fixtures() {
  const live = featuredMatches.filter(m => m.status === "live");
  const upcoming = featuredMatches.filter(m => m.status === "upcoming");
  const results = featuredMatches.slice(0, 4).map(m => ({...m, score: `${Math.floor(Math.random()*4)} - ${Math.floor(Math.random()*3)}`}));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader icon={<CalendarDays className="h-6 w-6 text-primary" />} title="Fixtures & Results" subtitle="Live scores update every 60 seconds." />
      <Tabs defaultValue="upcoming" className="mt-8">
        <TabsList className="bg-surface">
          <TabsTrigger value="live">Live <span className="ml-2 h-2 w-2 rounded-full bg-live live-dot" /></TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="mt-6">
          <FixtureList items={live} showScore />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-6">
          <FixtureList items={upcoming} />
        </TabsContent>
        <TabsContent value="results" className="mt-6">
          <FixtureList items={results} showScore finished />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FixtureList({ items, showScore, finished }: { items: typeof featuredMatches; showScore?: boolean; finished?: boolean }) {
  if (items.length === 0) return <p className="text-muted-foreground text-sm py-12 text-center">No matches right now. Check back soon.</p>;
  return (
    <div className="rounded-xl border border-border/60 bg-gradient-card divide-y divide-border/40">
      {items.map(m => (
        <div key={m.id} className="flex items-center gap-4 p-4">
          <div className="text-xs text-muted-foreground w-24 shrink-0">{m.league}</div>
          <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <div className="text-right text-sm font-semibold">{m.home}</div>
            {showScore ? (
              <div className={`text-base font-extrabold px-3 py-1 rounded ${finished ? "bg-surface" : "bg-live/20 text-live"}`}>{m.score ?? "0 - 0"}</div>
            ) : (
              <div className="text-xs text-muted-foreground px-2">vs</div>
            )}
            <div className="text-left text-sm font-semibold">{m.away}</div>
          </div>
          <div className="text-xs text-muted-foreground w-24 text-right shrink-0">{m.kickoff}</div>
        </div>
      ))}
    </div>
  );
}
