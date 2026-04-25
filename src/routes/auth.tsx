import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or sign up — SimpleBetHub" },
      { name: "description", content: "Create your SimpleBetHub account or sign in to access predictions, odds and VIP tips." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: "/vip" });
    }
  }, [user, loading, navigate]);

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-12">
      <Link to="/" className="flex items-center justify-center gap-2 font-bold text-lg mb-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
          <Trophy className="h-5 w-5 text-primary-foreground" />
        </span>
        <span>Simple<span className="text-primary">Bet</span>Hub</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Sign in or create an account to access VIP tips.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
              <TabsTrigger value="forgot">Forgot</TabsTrigger>
            </TabsList>
            <TabsContent value="signin"><SignInForm /></TabsContent>
            <TabsContent value="signup"><SignUpForm /></TabsContent>
            <TabsContent value="forgot"><ForgotForm /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center mt-6">18+ only. By continuing you agree to our <Link to="/terms" className="text-primary">Terms</Link> and <Link to="/privacy" className="text-primary">Privacy Policy</Link>.</p>
    </div>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
    void navigate({ to: "/vip" });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="si-email">Email</Label>
        <Input id="si-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="si-password">Password</Label>
        <Input id="si-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground">
        {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Sign in
      </Button>
    </form>
  );
}

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { username, display_name: username },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created — you're signed in!");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="su-username">Username</Label>
        <Input id="su-username" required value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-email">Email</Label>
        <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-password">Password</Label>
        <Input id="su-password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="text-xs text-muted-foreground">Min 6 characters. Avoid common/leaked passwords.</p>
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground">
        {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Create account
      </Button>
    </form>
  );
}

function ForgotForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your email for a reset link.");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="fp-email">Email</Label>
        <Input id="fp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground">
        {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Send reset link
      </Button>
    </form>
  );
}