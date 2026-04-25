import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { OddsTable } from "@/components/site/OddsTable";
import { getOdds, type OddsMatch } from "@/utils/sports.functions";

export const Route = createFileRoute("/odds/champions-league")({
  head: () => ({
    meta: [
      { title: "Champions League Odds — SimpleBetHub" },
      { name: "description", content: "Compare UEFA Champions League odds across Bet365, Betway, 1xBet, Betpawa and Ababet." },
      { property: "og:title", content: "Champions League Odds — SimpleBetHub" },
      { property: "og:description", content: "Best UCL prices compared in real-time." },
    ],
  }),
  loader: () => getOdds({ data: { scope: "champions-league" } }),
  component: ChampionsLeagueOdds,
});

function ChampionsLeagueOdds() {
  const initial = Route.useLoaderData();
  const [matches, setMatches] = useState<OddsMatch[]>(initial.matches);
  const [source, setSource] = useState<"mock" | "live">(initial.source);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await getOdds({ data: { scope: "champions-league" } });
      setMatches(res.matches);
      setSource(res.source);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => { void refresh(); }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <OddsTable
      title="Champions League Odds"
      subtitle="Best UCL prices, refreshed automatically every 5 minutes."
      matches={matches}
      source={source}
      onRefresh={() => void refresh()}
      refreshing={refreshing}
    />
  );
}