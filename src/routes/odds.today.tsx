import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { OddsTable } from "@/components/site/OddsTable";
import { getOdds, type OddsMatch } from "@/utils/sports.functions";

export const Route = createFileRoute("/odds/today")({
  head: () => ({
    meta: [
      { title: "Today's Football Odds — SimpleBetHub" },
      { name: "description", content: "Today's best football odds compared across Bet365, Betway, 1xBet, Betpawa and Ababet." },
      { property: "og:title", content: "Today's Football Odds — SimpleBetHub" },
      { property: "og:description", content: "Find the best price for today's football matches." },
    ],
  }),
  loader: () => getOdds({ data: { scope: "today" } }),
  component: TodayOdds,
});

function TodayOdds() {
  const initial = Route.useLoaderData();
  const [matches, setMatches] = useState<OddsMatch[]>(initial.matches);
  const [source, setSource] = useState<"mock" | "live">(initial.source);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await getOdds({ data: { scope: "today" } });
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
      title="Today's Odds"
      subtitle="Best prices across all leagues, refreshed automatically every 5 minutes."
      matches={matches}
      source={source}
      onRefresh={() => void refresh()}
      refreshing={refreshing}
    />
  );
}