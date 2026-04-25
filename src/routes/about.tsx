import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Target, Shield, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — SimpleBetHub" },
      { name: "description", content: "SimpleBetHub is Africa's trusted football data platform — predictions, odds comparison and VIP tips, built by fans for fans." },
      { property: "og:title", content: "About SimpleBetHub" },
      { property: "og:description", content: "Africa's trusted football predictions and odds platform." },
    ],
  }),
  component: About,
});

const values = [
  { icon: Target, title: "Data-Driven", text: "Every prediction is backed by stats, form analysis and historical patterns — never guesswork." },
  { icon: Shield, title: "Transparent", text: "All tips are timestamped and verifiable. We publish wins and losses honestly." },
  { icon: Users, title: "Community First", text: "Built for African football fans. Fast on mobile, low data, simple UX." },
  { icon: Trophy, title: "Responsible", text: "We promote informed, responsible betting. 18+ only. Never bet what you can't afford to lose." },
];

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-balance">About <span className="text-primary">SimpleBetHub</span></h1>
        <p className="mt-4 text-muted-foreground">We're a team of football analysts, data engineers and fans on a mission to bring transparent, statistically backed insights to African football lovers.</p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {values.map(v => (
          <div key={v.title} className="rounded-2xl border border-border/60 bg-gradient-card p-6">
            <div className="h-11 w-11 rounded-xl bg-primary/15 grid place-items-center mb-3"><v.icon className="h-5 w-5 text-primary" /></div>
            <h3 className="font-extrabold text-lg">{v.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{v.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-border/60 bg-gradient-card p-8">
        <h2 className="text-2xl font-extrabold mb-3">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed">SimpleBetHub started in 2024 with a simple idea: African football fans deserve the same quality of analysis and odds tools as anyone else in the world. We combine machine-learning models with expert human analysis to surface high-confidence picks across the Premier League, Champions League, La Liga, CAF competitions and more — delivered in a fast, mobile-first experience that works even on slow connections.</p>
      </section>

      <p className="text-xs text-muted-foreground text-center mt-10">⚠️ 18+ only. We do not guarantee winnings. Gamble responsibly.</p>
    </div>
  );
}
