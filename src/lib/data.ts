export type Match = {
  id: string;
  league: string;
  home: string;
  away: string;
  homeShort: string;
  awayShort: string;
  kickoff: string;
  prediction: string;
  confidence: number;
  odds: { home: number; draw: number; away: number };
  status?: "live" | "upcoming" | "finished";
  score?: string;
};

export const featuredMatches: Match[] = [
  { id: "1", league: "Premier League", home: "Arsenal", away: "Chelsea", homeShort: "ARS", awayShort: "CHE", kickoff: "Today 20:00", prediction: "Arsenal Win & Over 2.5", confidence: 87, odds: { home: 1.85, draw: 3.6, away: 4.2 }, status: "upcoming" },
  { id: "2", league: "La Liga", home: "Real Madrid", away: "Barcelona", homeShort: "RMA", awayShort: "BAR", kickoff: "Live 65'", prediction: "Both Teams to Score", confidence: 92, odds: { home: 2.1, draw: 3.4, away: 3.1 }, status: "live", score: "2 - 1" },
  { id: "3", league: "Serie A", home: "Inter Milan", away: "Juventus", homeShort: "INT", awayShort: "JUV", kickoff: "Tomorrow 18:45", prediction: "Inter Win", confidence: 78, odds: { home: 1.95, draw: 3.3, away: 3.9 }, status: "upcoming" },
  { id: "4", league: "Bundesliga", home: "Bayern", away: "Dortmund", homeShort: "BAY", awayShort: "BVB", kickoff: "Sat 17:30", prediction: "Over 3.5 Goals", confidence: 81, odds: { home: 1.55, draw: 4.5, away: 5.5 }, status: "upcoming" },
  { id: "5", league: "Ligue 1", home: "PSG", away: "Marseille", homeShort: "PSG", awayShort: "MAR", kickoff: "Sun 21:00", prediction: "PSG -1.5 AH", confidence: 74, odds: { home: 1.40, draw: 4.8, away: 7.0 }, status: "upcoming" },
  { id: "6", league: "Champions League", home: "Man City", away: "Real Madrid", homeShort: "MCI", awayShort: "RMA", kickoff: "Tue 21:00", prediction: "BTTS & Over 2.5", confidence: 89, odds: { home: 2.0, draw: 3.5, away: 3.4 }, status: "upcoming" },
];

export const news = [
  { id: "1", title: "Mbappé hat-trick stuns Camp Nou as Real Madrid go top", excerpt: "A masterclass performance sees Los Blancos reclaim La Liga's summit after a thrilling Clásico.", category: "La Liga", time: "2h ago", image: "stadium-1" },
  { id: "2", title: "Arsenal close in on €80m midfield signing", excerpt: "The Gunners are reportedly set to break their transfer record this January window.", category: "Transfers", time: "5h ago", image: "stadium-2" },
  { id: "3", title: "Champions League draw: All-English quarter-final looms", excerpt: "Premier League sides dominate the latter stages once again as the draw is confirmed.", category: "UCL", time: "1d ago", image: "stadium-3" },
  { id: "4", title: "AFCON 2025 preview: Dark horses to watch", excerpt: "Our complete tactical breakdown of every group ahead of the continent's biggest tournament.", category: "AFCON", time: "1d ago", image: "stadium-4" },
];

export const bookmakers = ["Bet365", "1xBet", "Betway", "SportyBet", "MelBet"];
