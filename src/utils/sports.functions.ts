import { createServerFn } from "@tanstack/react-start";

export type OddsBookmaker = {
  key: string;
  title: string;
  homeOdds: number | null;
  drawOdds: number | null;
  awayOdds: number | null;
};

export type OddsMatch = {
  id: string;
  league: string;
  home: string;
  away: string;
  commenceTime: string;
  bookmakers: OddsBookmaker[];
  bestHome: { value: number; book: string } | null;
  bestDraw: { value: number; book: string } | null;
  bestAway: { value: number; book: string } | null;
};

export type NewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
  image: string | null;
};

const TARGET_BOOKMAKERS = [
  { key: "bet365", title: "Bet365" },
  { key: "betway", title: "Betway" },
  { key: "1xbet", title: "1xBet" },
  { key: "betpawa", title: "Betpawa" },
  { key: "ababet", title: "Ababet" },
];

const SCOPE_TO_API_KEY: Record<string, string> = {
  today: "soccer",
  "premier-league": "soccer_epl",
  "champions-league": "soccer_uefa_champs_league",
};

function pickBest(values: { value: number; book: string }[]) {
  if (!values.length) return null;
  return values.reduce((best, cur) => (cur.value > best.value ? cur : best));
}

function buildMockOdds(scope: string): OddsMatch[] {
  const seeds = [
    { league: "Premier League", home: "Arsenal", away: "Chelsea", base: 1.85, draw: 3.6, away2: 4.2 },
    { league: "Premier League", home: "Liverpool", away: "Man United", base: 1.65, draw: 4.0, away2: 5.0 },
    { league: "Premier League", home: "Man City", away: "Tottenham", base: 1.45, draw: 4.5, away2: 6.5 },
    { league: "Champions League", home: "Real Madrid", away: "Bayern", base: 2.1, draw: 3.4, away2: 3.2 },
    { league: "Champions League", home: "PSG", away: "Inter", base: 2.3, draw: 3.2, away2: 2.9 },
    { league: "La Liga", home: "Barcelona", away: "Atletico", base: 1.95, draw: 3.5, away2: 3.7 },
    { league: "Serie A", home: "Juventus", away: "Napoli", base: 2.0, draw: 3.3, away2: 3.5 },
  ];

  const filtered =
    scope === "premier-league"
      ? seeds.filter((s) => s.league === "Premier League")
      : scope === "champions-league"
        ? seeds.filter((s) => s.league === "Champions League")
        : seeds;

  return filtered.map((s, idx) => {
    const bookmakers: OddsBookmaker[] = TARGET_BOOKMAKERS.map((b, i) => ({
      key: b.key,
      title: b.title,
      homeOdds: +(s.base + i * 0.07 - 0.1).toFixed(2),
      drawOdds: +(s.draw + i * 0.05 - 0.05).toFixed(2),
      awayOdds: +(s.away2 + i * 0.08 - 0.12).toFixed(2),
    }));

    return {
      id: `mock-${scope}-${idx}`,
      league: s.league,
      home: s.home,
      away: s.away,
      commenceTime: new Date(Date.now() + (idx + 1) * 3600 * 1000).toISOString(),
      bookmakers,
      bestHome: pickBest(bookmakers.filter((b) => b.homeOdds != null).map((b) => ({ value: b.homeOdds!, book: b.title }))),
      bestDraw: pickBest(bookmakers.filter((b) => b.drawOdds != null).map((b) => ({ value: b.drawOdds!, book: b.title }))),
      bestAway: pickBest(bookmakers.filter((b) => b.awayOdds != null).map((b) => ({ value: b.awayOdds!, book: b.title }))),
    };
  });
}

function buildMockNews(): NewsArticle[] {
  const items = [
    { title: "Mbappé hat-trick stuns Camp Nou as Real Madrid go top", category: "La Liga", excerpt: "A masterclass performance sees Los Blancos reclaim La Liga's summit after a thrilling Clásico." },
    { title: "Arsenal close in on €80m midfield signing", category: "Transfers", excerpt: "The Gunners are reportedly set to break their transfer record this January window." },
    { title: "Champions League draw: All-English quarter-final looms", category: "UCL", excerpt: "Premier League sides dominate the latter stages once again as the draw is confirmed." },
    { title: "AFCON 2025 preview: Dark horses to watch", category: "AFCON", excerpt: "Our complete tactical breakdown of every group ahead of the continent's biggest tournament." },
    { title: "Haaland injury blow leaves City sweating ahead of UCL tie", category: "Premier League", excerpt: "Pep Guardiola confirms the Norwegian striker will undergo scans on Monday." },
    { title: "Match preview: Man City vs Real Madrid — what to expect", category: "Match Preview", excerpt: "Tactical breakdown, key battles and our prediction for tonight's blockbuster clash." },
    { title: "Liverpool agree personal terms with Bundesliga starlet", category: "Transfers", excerpt: "Reds beat Premier League rivals to secure the signature of one of Europe's hottest prospects." },
    { title: "Serie A title race tightens as Inter drop points at home", category: "Serie A", excerpt: "Milan and Juventus both within striking distance after a shock home draw at San Siro." },
    { title: "PSG sack manager after Champions League exit", category: "Ligue 1", excerpt: "Parisians on the hunt for a new boss after another disappointing European campaign." },
  ];
  return items.map((it, i) => ({
    id: `mock-news-${i}`,
    title: it.title,
    excerpt: it.excerpt,
    url: "#",
    source: "SimpleBet Newsroom",
    category: it.category,
    publishedAt: new Date(Date.now() - (i + 1) * 3600 * 1000).toISOString(),
    image: null,
  }));
}

export const getOdds = createServerFn({ method: "GET" })
  .inputValidator((data: { scope: "today" | "premier-league" | "champions-league" }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.ODDS_API_KEY;
    const scope = data.scope;

    if (!apiKey) {
      return { matches: buildMockOdds(scope), source: "mock" as const };
    }

    try {
      const sportKey = SCOPE_TO_API_KEY[scope] ?? "soccer";
      const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?regions=uk,eu,us&markets=h2h&oddsFormat=decimal&apiKey=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Odds API error:", res.status);
        return { matches: buildMockOdds(scope), source: "mock" as const };
      }
      const raw = (await res.json()) as Array<{
        id: string;
        sport_title: string;
        commence_time: string;
        home_team: string;
        away_team: string;
        bookmakers: Array<{
          key: string;
          title: string;
          markets: Array<{ key: string; outcomes: Array<{ name: string; price: number }> }>;
        }>;
      }>;

      const matches: OddsMatch[] = raw.slice(0, 30).map((g) => {
        const targetSet = new Set(TARGET_BOOKMAKERS.map((b) => b.key));
        const filteredBooks = g.bookmakers.filter((b) => targetSet.has(b.key));
        const useBooks = filteredBooks.length ? filteredBooks : g.bookmakers.slice(0, 5);
        const bookmakers: OddsBookmaker[] = useBooks.map((b) => {
          const h2h = b.markets.find((m) => m.key === "h2h");
          const home = h2h?.outcomes.find((o) => o.name === g.home_team)?.price ?? null;
          const away = h2h?.outcomes.find((o) => o.name === g.away_team)?.price ?? null;
          const draw = h2h?.outcomes.find((o) => o.name === "Draw")?.price ?? null;
          return { key: b.key, title: b.title, homeOdds: home, drawOdds: draw, awayOdds: away };
        });
        return {
          id: g.id,
          league: g.sport_title,
          home: g.home_team,
          away: g.away_team,
          commenceTime: g.commence_time,
          bookmakers,
          bestHome: pickBest(bookmakers.filter((b) => b.homeOdds != null).map((b) => ({ value: b.homeOdds!, book: b.title }))),
          bestDraw: pickBest(bookmakers.filter((b) => b.drawOdds != null).map((b) => ({ value: b.drawOdds!, book: b.title }))),
          bestAway: pickBest(bookmakers.filter((b) => b.awayOdds != null).map((b) => ({ value: b.awayOdds!, book: b.title }))),
        };
      });

      return { matches, source: "live" as const };
    } catch (err) {
      console.error("Odds fetch failed:", err);
      return { matches: buildMockOdds(scope), source: "mock" as const };
    }
  });

export const getNews = createServerFn({ method: "GET" })
  .inputValidator((data: { q?: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.NEWS_API_KEY;
    const query = data.q?.trim() || "football";

    if (!apiKey) {
      const all = buildMockNews();
      const filtered = data.q
        ? all.filter(
            (n) =>
              n.title.toLowerCase().includes(data.q!.toLowerCase()) ||
              n.excerpt.toLowerCase().includes(data.q!.toLowerCase()),
          )
        : all;
      return { articles: filtered, source: "mock" as const };
    }

    try {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=20&apikey=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error("News API error:", res.status);
        return { articles: buildMockNews(), source: "mock" as const };
      }
      const raw = (await res.json()) as {
        articles: Array<{
          title: string;
          description: string;
          url: string;
          image: string | null;
          publishedAt: string;
          source: { name: string };
        }>;
      };
      const articles: NewsArticle[] = (raw.articles ?? []).map((a, i) => ({
        id: `live-${i}-${a.publishedAt}`,
        title: a.title,
        excerpt: a.description ?? "",
        url: a.url,
        source: a.source?.name ?? "Unknown",
        category: "Football",
        publishedAt: a.publishedAt,
        image: a.image,
      }));
      return { articles, source: "live" as const };
    } catch (err) {
      console.error("News fetch failed:", err);
      return { articles: buildMockNews(), source: "mock" as const };
    }
  });