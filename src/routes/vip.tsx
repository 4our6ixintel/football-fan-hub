import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Crown, Check, Smartphone, CreditCard, Lock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";

const PAYMENT_NUMBER = "+256 754 466 293";
const PAYMENT_NUMBER_RAW = "+256754466293";

export const Route = createFileRoute("/vip")({
  head: () => ({
    meta: [
      { title: "VIP Tips Membership — SimpleBetHub" },
      { name: "description", content: "Premium football tips with verified track record. Join Basic, Pro or Elite — pay via Mobile Money or card." },
      { property: "og:title", content: "VIP Football Tips — SimpleBetHub" },
      { property: "og:description", content: "Win smarter with daily premium picks. From $5/month." },
    ],
  }),
  component: VIP,
});

const plans = [
  { name: "Basic", price: 5, period: "month", color: "bg-surface", popular: false, features: ["3 daily tips", "Email delivery", "BTTS & O/U picks", "Community access"] },
  { name: "Pro", price: 15, period: "month", color: "bg-gradient-primary", popular: true, features: ["10 daily tips", "Telegram VIP channel", "Daily accumulator", "Bankroll guidance", "Live alerts", "Priority support"] },
  { name: "Elite", price: 39, period: "month", color: "bg-gradient-vip", popular: false, features: ["Unlimited tips", "1-on-1 strategy session", "Early-access odds", "Insider injury news", "Custom acca builder", "VIP-only matches"] },
];

const faqs = [
  { q: "Do you guarantee winnings?", a: "No. Football is unpredictable. We provide statistically backed analysis but never guarantee outcomes. Always bet responsibly within your means." },
  { q: "How are tips delivered?", a: "Via your dashboard, email, and Telegram channel for Pro/Elite members. All tips are time-stamped and verifiable." },
  { q: "Can I cancel anytime?", a: "Yes, cancel from your dashboard at any time. You keep access until the end of the billing period." },
  { q: "Which payment methods do you accept?", a: "MTN Mobile Money, M-Pesa, Airtel Money, Visa and Mastercard. All payments are secure." },
];

function VIP() {
  const { user, isSubscriber, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);

  const handleChoose = (plan: string) => {
    if (!user) {
      toast.info("Sign in to subscribe");
      void navigate({ to: "/auth" });
      return;
    }
    const found = plans.find((p) => p.name === plan);
    if (found) setSelectedPlan({ name: found.name, price: found.price });
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_NUMBER_RAW);
      toast.success("Payment number copied");
    } catch {
      toast.error("Could not copy — please copy manually");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      {!loading && user && isSubscriber && (
        <div className="mb-8 rounded-xl border border-primary/40 bg-primary/10 p-4 flex items-center gap-3">
          <Crown className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="font-bold text-sm">You're a VIP member</p>
            <p className="text-xs text-muted-foreground">Access your premium predictions and accumulators.</p>
          </div>
        </div>
      )}
      {!loading && !user && (
        <div className="mb-8 rounded-xl border border-border/60 bg-gradient-card p-4 flex items-center gap-3">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-bold text-sm">Sign in to subscribe</p>
            <p className="text-xs text-muted-foreground">Create a free account to manage your VIP plan.</p>
          </div>
          <Button asChild size="sm" variant="outline"><Link to="/auth">Sign in</Link></Button>
        </div>
      )}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vip/15 border border-vip/30 text-vip text-xs font-bold mb-4">
          <Crown className="h-3.5 w-3.5" /> VIP MEMBERSHIP
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-balance">Win smarter with <span className="text-primary">premium tips</span></h1>
        <p className="mt-4 text-muted-foreground">Choose a plan that fits your strategy. Cancel anytime. Pay with Mobile Money or card.</p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {plans.map(p => (
          <div key={p.name} className={`relative rounded-2xl border p-7 flex flex-col ${p.popular ? "border-primary shadow-glow scale-[1.02] bg-gradient-card" : "border-border/60 bg-gradient-card"}`}>
            {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">MOST POPULAR</div>}
            <div className={`h-12 w-12 rounded-xl ${p.color} grid place-items-center mb-4`}><Crown className="h-6 w-6 text-primary-foreground" /></div>
            <h3 className="text-xl font-extrabold">{p.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold">${p.price}</span>
              <span className="text-muted-foreground text-sm">/{p.period}</span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button onClick={() => handleChoose(p.name)} className={`mt-7 w-full ${p.popular ? "bg-gradient-primary text-primary-foreground" : "bg-surface-elevated"}`}>
              Choose {p.name}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
        <div className="rounded-xl bg-gradient-card border border-border/60 p-5 flex items-center gap-4">
          <Smartphone className="h-8 w-8 text-primary" />
          <div>
            <div className="font-bold">Mobile Money</div>
            <div className="text-xs text-muted-foreground">M-Pesa • MTN MoMo • Airtel Money</div>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-card border border-border/60 p-5 flex items-center gap-4">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <div className="font-bold">Card Payment</div>
            <div className="text-xs text-muted-foreground">Visa • Mastercard • Verve</div>
          </div>
        </div>
      </div>

      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="rounded-xl border border-border/60 bg-gradient-card divide-y divide-border/40">
          {faqs.map((f,i) => (
            <AccordionItem key={i} value={`i${i}`} className="px-5 border-0">
              <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <p className="text-xs text-muted-foreground text-center mt-10">⚠️ 18+ only. We do not guarantee winnings. Gamble responsibly.</p>

      <Dialog open={!!selectedPlan} onOpenChange={(o) => !o && setSelectedPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /> Pay with Mobile Money</DialogTitle>
            <DialogDescription>
              Send <span className="font-bold text-foreground">${selectedPlan?.price}</span> for the <span className="font-bold text-foreground">{selectedPlan?.name}</span> plan to the number below, then send a screenshot via WhatsApp to activate your subscription.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-5 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Send to</p>
            <p className="text-2xl font-extrabold mt-1">{PAYMENT_NUMBER}</p>
            <p className="text-xs text-muted-foreground mt-1">MTN MoMo • Airtel Money</p>
            <Button onClick={copyNumber} variant="outline" size="sm" className="mt-4">
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy number
            </Button>
          </div>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
            <li>Open your Mobile Money app or dial the USSD code.</li>
            <li>Send <span className="font-semibold text-foreground">${selectedPlan?.price}</span> to <span className="font-semibold text-foreground">{PAYMENT_NUMBER}</span>.</li>
            <li>Use your account email as the reference.</li>
            <li>Send the confirmation SMS to us via WhatsApp on the same number — your VIP access will be activated within minutes.</li>
          </ol>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlan(null)}>Close</Button>
            <Button asChild className="bg-gradient-primary text-primary-foreground">
              <a href={`https://wa.me/${PAYMENT_NUMBER_RAW.replace("+", "")}?text=${encodeURIComponent(`Hi, I just paid for the ${selectedPlan?.name} plan ($${selectedPlan?.price}). Here is my confirmation:`)}`} target="_blank" rel="noreferrer">
                Open WhatsApp
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
