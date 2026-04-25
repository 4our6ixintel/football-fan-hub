import { createFileRoute } from "@tanstack/react-router";
import { Newspaper, Trophy } from "lucide-react";
import { news } from "@/lib/data";
import { PageHeader } from "./predictions";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Football News, Transfers & Match Previews — SimpleBetHub" },
      { name: "description", content: "Latest football news, transfer rumours, match previews and analysis from across Europe and Africa." },
      { property: "og:title", content: "Football News & Previews — SimpleBetHub" },
      { property: "og:description", content: "Stay ahead with the latest football stories." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const all = [...news, ...news.map(n => ({...n, id: n.id+"b"}))];
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader icon={<Newspaper className="h-6 w-6 text-primary" />} title="Football News" subtitle="Transfers, previews and the stories shaping the game." />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {all.map(n => (
          <article key={n.id} className="rounded-xl bg-gradient-card border border-border/60 overflow-hidden hover:border-primary/40 transition-smooth group cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-primary/30 to-surface relative">
              <div className="absolute inset-0 grid place-items-center"><Trophy className="h-12 w-12 text-primary/40" /></div>
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-background/80 backdrop-blur text-primary text-xs font-bold">{n.category}</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold leading-snug group-hover:text-primary transition-smooth">{n.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{n.excerpt}</p>
              <div className="text-xs text-muted-foreground mt-3">{n.time}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
