import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Coins, RefreshCw, ArrowUpDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OddsMatch } from "@/utils/sports.functions";

type Props = {
  title: string;
  subtitle: string;
  matches: OddsMatch[];
  source: "mock" | "live";
  onRefresh: () => void;
  refreshing: boolean;
};

const TABS = [
  { to: "/odds/today", label: "Today" },
  { to: "/odds/premier-league", label: "Premier League" },
  { to: "/odds/champions-league", label: "Champions League" },
] as const;

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function OddsTable({ title, subtitle, matches, source, onRefresh, refreshing }: Props) {
  const [query, setQuery] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = matches;
    if (q) {
      list = list.filter(
        (m) => m.home.toLowerCase().includes(q) || m.away.toLowerCase().includes(q) || m.league.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      const aMax = Math.max(a.bestHome?.value ?? 0, a.bestDraw?.value ?? 0, a.bestAway?.value ?? 0);
      const bMax = Math.max(b.bestHome?.value ?? 0, b.bestDraw?.value ?? 0, b.bestAway?.value ?? 0);
      return sortDesc ? bMax - aMax : aMax - bMax;
    });
    return list;
  }, [matches, query, sortDesc]);

  // Collect all bookmaker columns shown across these matches (preserve first-seen order)
  const bookCols = useMemo(() => {
    const seen = new Map<string, string>();
    matches.forEach((m) => m.bookmakers.forEach((b) => { if (!seen.has(b.key)) seen.set(b.key, b.title); }));
    return Array.from(seen.entries()).map(([key, title]) => ({ key, title }));
  }, [matches]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-surface grid place-items-center"><Coins className="h-5 w-5 text-primary" /></div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={source === "live" ? "bg-primary/15 text-primary border-primary/30" : "bg-warning/15 text-warning border-warning/30"}>
            {source === "live" ? "Live" : "Demo data"}
          </Badge>
          <Button size="sm" variant="outline" onClick={onRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <nav className="mt-6 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface whitespace-nowrap"
            activeProps={{ className: "px-4 py-2 rounded-md text-sm font-medium text-primary bg-surface whitespace-nowrap" }}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search team or league..." className="pl-9 bg-surface" />
        </div>
        <Button variant="outline" size="sm" onClick={() => setSortDesc((s) => !s)}>
          <ArrowUpDown className="h-4 w-4 mr-1" /> {sortDesc ? "Highest odds" : "Lowest odds"}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border/60 bg-gradient-card p-10 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">No matches found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search or refresh.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border/60 bg-gradient-card">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-surface-elevated text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Match</th>
                <th className="px-2 py-3 text-center">Best 1</th>
                <th className="px-2 py-3 text-center">Best X</th>
                <th className="px-2 py-3 text-center">Best 2</th>
                {bookCols.map((b) => (
                  <th key={b.key} className="px-3 py-3 text-center">{b.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t border-border/40 hover:bg-surface/50 transition-smooth">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{m.home} <span className="text-muted-foreground">vs</span> {m.away}</div>
                    <div className="text-xs text-muted-foreground">{m.league} • {fmtTime(m.commenceTime)}</div>
                  </td>
                  <td className="px-2 py-3 text-center">
                    {m.bestHome ? <BestCell value={m.bestHome.value} book={m.bestHome.book} /> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {m.bestDraw ? <BestCell value={m.bestDraw.value} book={m.bestDraw.book} /> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {m.bestAway ? <BestCell value={m.bestAway.value} book={m.bestAway.book} /> : <span className="text-muted-foreground">—</span>}
                  </td>
                  {bookCols.map((col) => {
                    const b = m.bookmakers.find((x) => x.key === col.key);
                    return (
                      <td key={col.key} className="px-3 py-3 text-center text-xs">
                        {b ? (
                          <div className="space-y-0.5">
                            <div>{b.homeOdds ?? "—"}</div>
                            <div className="text-muted-foreground">{b.drawOdds ?? "—"}</div>
                            <div>{b.awayOdds ?? "—"}</div>
                          </div>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-4">
        ⚠️ Odds are informational. Auto-refreshes every 5 minutes. Always verify on the bookmaker site before betting. {source === "mock" && "Showing demo data — add an Odds API key to see live prices."}
      </p>
    </div>
  );
}

function BestCell({ value, book }: { value: number; book: string }) {
  return (
    <div>
      <span className="inline-block px-2.5 py-1 rounded-md font-bold bg-primary text-primary-foreground">{value.toFixed(2)}</span>
      <div className="text-[10px] text-muted-foreground mt-1">{book}</div>
    </div>
  );
}