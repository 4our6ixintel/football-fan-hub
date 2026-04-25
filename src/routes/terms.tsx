import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SimpleBetHub" },
      { name: "description", content: "The terms governing your use of SimpleBetHub predictions, odds and VIP tips services." },
      { property: "og:title", content: "Terms of Service — SimpleBetHub" },
      { property: "og:description", content: "Read the SimpleBetHub terms of service." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">1. Acceptance</h2>
          <p>By using SimpleBetHub you agree to these terms. If you do not agree, do not use the service.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">2. Eligibility</h2>
          <p>You must be at least <strong className="text-foreground">18 years old</strong> and legally allowed to bet in your jurisdiction. It is your responsibility to verify local laws.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">3. Service Description</h2>
          <p>We provide football predictions, statistics, odds comparison and premium tips for informational purposes only. We are not a bookmaker and do not accept bets.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">4. No Guarantees</h2>
          <p><strong className="text-foreground">We do not guarantee winnings.</strong> Football is unpredictable. All tips and predictions are opinions based on analysis; outcomes are never certain. Past performance does not guarantee future results.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">5. VIP Subscriptions</h2>
          <p>VIP plans are billed as stated on the pricing page. You may cancel anytime; access continues until the end of the current billing period. Refunds are at our discretion and generally not provided for partially used periods.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">6. Acceptable Use</h2>
          <p>Do not redistribute our predictions, scrape the site, or share VIP content. Accounts found doing so will be terminated without refund.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">7. Limitation of Liability</h2>
          <p>SimpleBetHub is not liable for any losses you incur from betting based on our content. You bet at your own risk and discretion.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">8. Responsible Gambling</h2>
          <p>If gambling is causing you harm, please seek help: <a href="https://www.begambleaware.org" target="_blank" rel="noopener" className="text-primary">BeGambleAware.org</a>.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">9. Contact</h2>
          <p>Questions? Email <a href="mailto:legal@simplebethub.com" className="text-primary">legal@simplebethub.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
