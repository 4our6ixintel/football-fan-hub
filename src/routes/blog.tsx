import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { Newspaper, Trophy, Search, RefreshCw, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNews, type NewsArticle } from "@/utils/sports.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Football News, Transfers & Match Previews — SimpleBetHub" },
      { name: "description", content: "Latest football news, transfer rumours, match previews and analysis from across Europe and Africa." },
      { property: "og:title", content: "Football News & Previews — SimpleBetHub" },
      { property: "og:description", content: "Stay ahead with the latest football stories." },
    ],
  }),
  loader: () => getNews({ data: {} }),
  component: Blog,
});

function timeAgo(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.round(hrs / 24);
    return `${days}d ago`;
  } catch {
    return iso;
  }
}

function Blog() {
  const initial = Route.useLoaderData();
  const [articles, setArticles] = useState<NewsArticle[]>(initial.articles);
  const [source, setSource] = useState<"mock" | "live">(initial.source);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [editorial, setEditorial] = useState<Array<{ id: string; title: string; category: string; excerpt: string; created_at: string }>>([]);

  useEffect(() => {
    void supabase.from("news_posts").select("*").order("created_at", { ascending: false }).limit(6).then(({ data }) => {
      if (data) setEditorial(data);
    });
  }, []);

  const runSearch = useCallback(async (q: string) => {
    setBusy(true);
    try {
      const res = await getNews({ data: { q: q || undefined } });
      setArticles(res.articles);
      setSource(res.source);
      setQuery(q);
    } finally {
      setBusy(false);
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch(searchInput.trim());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-surface grid place-items-center"><Newspaper className="h-5 w-5 text-primary" /></div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Football News</h1>
            <p className="text-sm text-muted-foreground mt-1">Transfers, previews and the stories shaping the game.</p>
          </div>
        </div>
        <Badge variant="secondary" className={source === "live" ? "bg-primary/15 text-primary border-primary/30" : "bg-warning/15 text-warning border-warning/30"}>
          {source === "live" ? "Live" : "Demo data"}
        </Badge>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex gap-2 flex-wrap max-w-xl">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search transfers, teams, leagues..." className="pl-9 bg-surface" />
        </div>
        <Button type="submit" disabled={busy} className="bg-gradient-primary text-primary-foreground">
          <RefreshCw className={`h-4 w-4 mr-1 ${busy ? "animate-spin" : ""}`} /> Search
        </Button>
      </form>
      {query && (
        <p className="text-xs text-muted-foreground mt-2">
          Showing results for <span className="text-foreground font-medium">"{query}"</span> ·{" "}
          <button type="button" className="text-primary hover:underline" onClick={() => { setSearchInput(""); void runSearch(""); }}>clear</button>
        </p>
      )}

      {editorial.length > 0 && !query && (
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold">Editor's Desk</h2>
            <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30">From our team</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {editorial.map((p) => (
              <article key={p.id} className="rounded-xl bg-gradient-card border border-border/60 p-5">
                <Badge variant="outline" className="mb-2">{p.category}</Badge>
                <h3 className="font-bold leading-snug">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.excerpt}</p>
                <div className="text-xs text-muted-foreground mt-3">{timeAgo(p.created_at)}</div>
              </article>
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border/60 bg-gradient-card p-10 text-center">
          <Newspaper className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">No articles found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((n) => {
            const isExternal = n.url && n.url !== "#";
            const Wrapper: React.ElementType = isExternal ? "a" : "article";
            const wrapperProps = isExternal
              ? { href: n.url, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <Wrapper
                key={n.id}
                {...wrapperProps}
                className="rounded-xl bg-gradient-card border border-border/60 overflow-hidden hover:border-primary/40 transition-smooth group cursor-pointer block"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/30 to-surface relative overflow-hidden">
                  {n.image ? (
                    <img src={n.image} alt={n.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center"><Trophy className="h-12 w-12 text-primary/40" /></div>
                  )}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-background/80 backdrop-blur text-primary text-xs font-bold">{n.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold leading-snug group-hover:text-primary transition-smooth flex items-start gap-1">
                    <span className="flex-1">{n.title}</span>
                    {isExternal && <ExternalLink className="h-3.5 w-3.5 mt-1 shrink-0 text-muted-foreground" />}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{n.excerpt}</p>
                  <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
                    <span>{n.source}</span>
                    <span>{timeAgo(n.publishedAt)}</span>
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      )}

      {source === "mock" && (
        <p className="text-xs text-muted-foreground mt-6">📰 Showing demo articles. Add a News API key to see live headlines.</p>
      )}
    </div>
  );
}
