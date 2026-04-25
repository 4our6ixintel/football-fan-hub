import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/odds")({
  head: () => ({
    meta: [
      { title: "Live Odds Comparison — SimpleBetHub" },
      { name: "description", content: "Compare live football odds from Bet365, Betway, 1xBet, Betpawa and Ababet. Find the best price for every match." },
      { property: "og:title", content: "Live Odds Comparison — SimpleBetHub" },
      { property: "og:description", content: "Find the best odds from Bet365, Betway, 1xBet, Betpawa and Ababet." },
    ],
  }),
  beforeLoad: ({ location }) => {
    if (location.pathname === "/odds") {
      throw redirect({ to: "/odds/today" });
    }
  },
  component: () => <Outlet />,
});
