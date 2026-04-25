import { Link } from "@tanstack/react-router";
import { Trophy, Facebook, Twitter, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </span>
            Simple<span className="text-primary">Bet</span>Hub
          </div>
          <p className="text-sm text-muted-foreground">Africa's trusted football predictions, odds and VIP tips platform.</p>
          <div className="flex gap-2 pt-2">
            {[Facebook, Twitter, Instagram, Send].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-md bg-background hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/predictions" className="hover:text-primary">Predictions</Link></li>
            <li><Link to="/odds" className="hover:text-primary">Odds Compare</Link></li>
            <li><Link to="/fixtures" className="hover:text-primary">Fixtures</Link></li>
            <li><Link to="/vip" className="hover:text-primary">VIP Membership</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/blog" className="hover:text-primary">News</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-3">Get daily tips delivered to your inbox.</p>
          <form className="flex gap-2">
            <Input type="email" placeholder="you@email.com" className="bg-background" />
            <Button type="submit" className="bg-gradient-primary text-primary-foreground">Join</Button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SimpleBetHub. All rights reserved.</p>
          <p className="text-center">⚠️ 18+ only. We do not guarantee winnings. Gamble responsibly. BeGambleAware.</p>
        </div>
      </div>
    </footer>
  );
}
