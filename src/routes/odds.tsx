import { createFileRoute } from "@tanstack/react-router";
import { Search, Coins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { featuredMatches, bookmakers } from "@/lib/data";
import { PageHeader } from "./predictions";

export const Route = createFileRoute("/odds")({
  head: () => ({
    meta: [
      { title: "Odds Comparison — SimpleBetHub" },
      { name: "description", content: "Compare football odds from top bookmakers in one place. Always bet at the best price." },
      { property: "og:title", content: "Live Odds Comparison — SimpleBetHub" },
      { property: "og:description", content: "Find the best odds from Bet365, 1xBet, Betway and more." },
    ],
  }),
  component: Odds,
});

function Odds() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader icon={<Coins className="h-6 w-6 text-primary" />} title="Odds Comparison" subtitle="Real-time odds from leading bookmakers." />
      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search team or league..." className="pl-9 bg-surface" />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border/60 bg-gradient-card">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-surface-elevated text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Match</th>
              {bookmakers.map(b => <th key={b} className="px-4 py-3 text-center">{b}</th>)}
            </tr>
          </thead>
          <tbody>
            {featuredMatches.map(m => (
              <tr key={m.id} className="border-t border-border/40 hover:bg-surface/50 transition-smooth">
                <td className="px-4 py-3">
                  <div className="font-semibold">{m.home} <span className="text-muted-foreground">vs</span> {m.away}</div>
                  <div className="text-xs text-muted-foreground">{m.league} • {m.kickoff}</div>
                </td>
                {bookmakers.map((b, i) => {
                  const odd = (m.odds.home + (i * 0.07) - 0.1).toFixed(2);
                  const isBest = i === 1;
                  return (
                    <td key={b} className="px-4 py-3 text-center">
                      <span className={`inline-block px-3 py-1 rounded-md font-bold ${isBest ? "bg-primary text-primary-foreground" : "bg-background"}`}>{odd}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-4">⚠️ Odds shown for informational purposes only. Always verify on the bookmaker site before placing a bet.</p>
    </div>
  );
}
