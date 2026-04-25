import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Crown, Zap, Shield, TrendingUp, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/site/MatchCard";
import { featuredMatches, news } from "@/lib/data";
import heroImg from "@/assets/hero-stadium.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SimpleBetHub — Football Predictions, Odds & VIP Tips" },
      { name: "description", content: "Daily football predictions, odds comparison, fixtures, live scores and premium VIP tips trusted across Africa." },
      { property: "og:title", content: "SimpleBetHub — Africa's Football Tips Hub" },
      { property: "og:description", content: "AI-powered football predictions and VIP tips. Win smarter." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="Stadium" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-32">
          <div className="max-w-2xl animate-float-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold mb-5">
              <span className="h-2 w-2 rounded-full bg-primary live-dot" /> 87% AVG ACCURACY THIS WEEK
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-balance">
              Smarter football <span className="text-primary">predictions</span> & odds in one place.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Daily AI-powered tips, real-time odds comparison from top bookmakers, and exclusive VIP picks trusted by 50,000+ punters across Africa.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/predictions">View Predictions <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Link to="/vip"><Crown className="mr-2 h-4 w-4 text-vip" /> Join VIP Tips</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[{n:"50K+",l:"Members"},{n:"87%",l:"Accuracy"},{n:"24/7",l:"Tips"}].map(s=>(
                <div key={s.l}>
                  <div className="text-2xl md:text-3xl font-extrabold text-primary">{s.n}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured matches */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <SectionHeader title="Today's Top Matches" subtitle="Hand-picked games with our highest confidence predictions" cta={{to:"/predictions",label:"All predictions"}} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { Icon: Zap, title: "Lightning Fast", text: "Built mobile-first for African networks. Instant tips, no lag." },
            { Icon: Shield, title: "Trusted & Legal", text: "Licensed content platform. Transparent track record." },
            { Icon: TrendingUp, title: "Proven Results", text: "Verified 87% strike rate on premium picks last 30 days." },
          ].map(({Icon,title,text}) => (
            <div key={title} className="rounded-xl bg-gradient-card border border-border/60 p-6">
              <div className="h-11 w-11 rounded-lg bg-primary/15 grid place-items-center mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <SectionHeader title="Trending Football News" subtitle="Latest from the world of football" cta={{to:"/blog",label:"All news"}} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {news.map(n => (
            <article key={n.id} className="rounded-xl bg-gradient-card border border-border/60 overflow-hidden hover:border-primary/40 transition-smooth group">
              <div className="aspect-video bg-gradient-to-br from-primary/30 to-surface relative">
                <div className="absolute inset-0 grid place-items-center"><Trophy className="h-12 w-12 text-primary/40" /></div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="px-2 py-0.5 rounded bg-primary/15 text-primary font-medium">{n.category}</span>
                  <span>{n.time}</span>
                </div>
                <h3 className="font-bold leading-snug group-hover:text-primary transition-smooth">{n.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <SectionHeader title="What Our Members Say" subtitle="Real wins from real punters" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: "Kwame A.", country: "Ghana 🇬🇭", text: "Hit a 5-fold accumulator on my first week with VIP. The accuracy is unreal." },
            { name: "Amara O.", country: "Nigeria 🇳🇬", text: "The odds comparison alone has paid for my subscription many times over." },
            { name: "Joseph M.", country: "Kenya 🇰🇪", text: "Clean app, fast on mobile data, and the BTTS tips are spot on most days." },
          ].map((t,i) => (
            <div key={i} className="rounded-xl bg-gradient-card border border-border/60 p-6">
              <div className="flex items-center gap-1 text-vip mb-3">{"★★★★★"}</div>
              <p className="text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground"><Users className="h-4 w-4" /></div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="rounded-2xl bg-gradient-primary p-10 md:p-14 text-center shadow-glow">
          <Crown className="h-12 w-12 text-primary-foreground mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">Ready to win smarter?</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">Join thousands getting daily premium tips and start your winning streak today.</p>
          <Button asChild size="lg" className="mt-6 bg-background text-foreground hover:bg-background/90">
            <Link to="/vip">Become a VIP Member <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ title, subtitle, cta }: { title: string; subtitle?: string; cta?: { to: "/predictions"|"/blog"; label: string } }) {
  return (
    <div className="flex items-end justify-between mb-7 gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {cta && (
        <Link to={cta.to} className="text-sm font-semibold text-primary hover:underline shrink-0 flex items-center gap-1">
          {cta.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
