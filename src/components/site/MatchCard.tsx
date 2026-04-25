import { Clock, TrendingUp } from "lucide-react";
import type { Match } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function MatchCard({ match }: { match: Match }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-card border border-border/60 p-5 shadow-card hover:shadow-elevated hover:border-primary/40 transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{match.league}</span>
        {match.status === "live" ? (
          <span className="flex items-center gap-1.5 text-xs font-bold text-live">
            <span className="h-2 w-2 rounded-full bg-live live-dot" /> LIVE {match.score}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{match.kickoff}</span>
        )}
      </div>
      <div className="flex items-center justify-between mb-5">
        <Team short={match.homeShort} name={match.home} />
        <span className="text-xs font-bold text-muted-foreground px-2">VS</span>
        <Team short={match.awayShort} name={match.away} reverse />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "1", val: match.odds.home },
          { label: "X", val: match.odds.draw },
          { label: "2", val: match.odds.away },
        ].map((o) => (
          <button key={o.label} className="rounded-md bg-background py-2 text-center hover:bg-primary hover:text-primary-foreground transition-smooth">
            <div className="text-[10px] text-muted-foreground group-hover:opacity-80">{o.label}</div>
            <div className="text-sm font-bold">{o.val.toFixed(2)}</div>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase">AI Tip</div>
          <div className="text-sm font-semibold">{match.prediction}</div>
        </div>
        <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">
          <TrendingUp className="h-3 w-3 mr-1" /> {match.confidence}%
        </Badge>
      </div>
    </div>
  );
}

function Team({ short, name, reverse }: { short: string; name: string; reverse?: boolean }) {
  return (
    <div className={`flex items-center gap-3 flex-1 ${reverse ? "flex-row-reverse text-right" : ""}`}>
      <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground shrink-0">
        {short}
      </div>
      <div className="text-sm font-semibold truncate">{name}</div>
    </div>
  );
}
