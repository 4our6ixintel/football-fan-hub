import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "./predictions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — SimpleBetHub" },
      { name: "description", content: "Get in touch with SimpleBetHub. WhatsApp, email, or send us a message." },
      { property: "og:title", content: "Contact — SimpleBetHub" },
      { property: "og:description", content: "We're here to help 24/7." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader icon={<MessageCircle className="h-6 w-6 text-primary" />} title="Get in Touch" subtitle="We typically respond within 1 hour." />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <a href="https://wa.me/000000000" className="flex items-center gap-4 p-5 rounded-xl bg-gradient-card border border-border/60 hover:border-primary/40 transition-smooth">
            <div className="h-12 w-12 rounded-lg bg-primary/15 grid place-items-center"><MessageCircle className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="font-bold">WhatsApp</div>
              <div className="text-sm text-muted-foreground">Chat with our team instantly</div>
            </div>
          </a>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-card border border-border/60">
            <div className="h-12 w-12 rounded-lg bg-primary/15 grid place-items-center"><Mail className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="font-bold">Email Support</div>
              <div className="text-sm text-muted-foreground">support@simplebethub.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-card border border-border/60">
            <div className="h-12 w-12 rounded-lg bg-primary/15 grid place-items-center"><MapPin className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="font-bold">Headquarters</div>
              <div className="text-sm text-muted-foreground">Accra, Ghana 🌍</div>
            </div>
          </div>
        </div>

        <form className="rounded-2xl bg-gradient-card border border-border/60 p-6 md:p-8 space-y-4" onSubmit={(e)=>e.preventDefault()}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="n">Name</Label>
              <Input id="n" placeholder="Your name" maxLength={100} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e">Email</Label>
              <Input id="e" type="email" placeholder="you@email.com" maxLength={255} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="s">Subject</Label>
            <Input id="s" placeholder="How can we help?" maxLength={150} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="m">Message</Label>
            <Textarea id="m" placeholder="Tell us more..." rows={6} maxLength={1000} required />
          </div>
          <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
