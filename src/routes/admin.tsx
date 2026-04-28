import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus, ShieldAlert, TrendingUp, Users, Newspaper, CreditCard, Lock, Crown, X } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SimpleBetHub" },
      { name: "description", content: "Manage predictions, news, users and payments on SimpleBetHub." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type Prediction = {
  id: string;
  league: string;
  match: string;
  pick: string;
  confidence: number;
  kickoff: string;
};

type NewsPost = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  time: string;
};

type AdminUser = {
  id: string;
  email: string;
  username: string;
  plan: "Free" | "Weekly" | "Monthly" | "Elite";
  joined: string;
};

type Payment = {
  id: string;
  user: string;
  plan: string;
  amount: string;
  method: "MTN MoMo" | "Airtel Money" | "Card";
  status: "Successful" | "Pending" | "Failed";
  date: string;
};

type VipPickRow = {
  id: string;
  match: string;
  league: string;
  pick: string;
  odds: number;
  stake_units: number;
  kickoff: string;
  status: "pending" | "won" | "lost" | "void";
};

type VipAccaLeg = { match: string; pick: string; odds: number };
type VipAccaRow = {
  id: string;
  title: string;
  total_odds: number;
  stake_units: number;
  status: "pending" | "won" | "lost" | "void";
  legs: VipAccaLeg[];
  scheduled_for: string;
};

const seedUsers: AdminUser[] = [
  { id: "u1", email: "kato@example.com", username: "kato_ug", plan: "Monthly", joined: "2025-03-12" },
  { id: "u2", email: "amina@example.com", username: "amina7", plan: "Weekly", joined: "2025-04-02" },
  { id: "u3", email: "joshua@example.com", username: "jay_pred", plan: "Elite", joined: "2025-01-18" },
  { id: "u4", email: "sarah@example.com", username: "sarah_b", plan: "Free", joined: "2025-04-21" },
];

const seedPayments: Payment[] = [
  { id: "p1", user: "kato_ug", plan: "Monthly", amount: "UGX 30,000", method: "MTN MoMo", status: "Successful", date: "2025-04-12" },
  { id: "p2", user: "amina7", plan: "Weekly", amount: "UGX 10,000", method: "Airtel Money", status: "Successful", date: "2025-04-19" },
  { id: "p3", user: "jay_pred", plan: "Elite", amount: "UGX 50,000", method: "MTN MoMo", status: "Successful", date: "2025-04-01" },
  { id: "p4", user: "sarah_b", plan: "Weekly", amount: "UGX 10,000", method: "Card", status: "Pending", date: "2025-04-23" },
];

function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-20 text-center">
        <div className="mx-auto h-14 w-14 rounded-xl bg-surface grid place-items-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-extrabold">Admin access required</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {user
            ? "Your account doesn't have admin privileges. Ask an existing admin to grant you the 'admin' role in the user_roles table."
            : "Sign in with an admin account to access this dashboard."}
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          {!user && <Button asChild className="bg-gradient-primary text-primary-foreground"><Link to="/auth">Sign in</Link></Button>}
          <Button asChild variant="outline"><Link to="/">Go home</Link></Button>
        </div>
      </div>
    );
  }

  return <AdminDashboardInner />;
}

function AdminDashboardInner() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [payments] = useState<Payment[]>(seedPayments);
  const [vipPicks, setVipPicks] = useState<VipPickRow[]>([]);
  const [vipAccas, setVipAccas] = useState<VipAccaRow[]>([]);

  // Prediction form
  const [pLeague, setPLeague] = useState("");
  const [pMatch, setPMatch] = useState("");
  const [pPick, setPPick] = useState("");
  const [pConfidence, setPConfidence] = useState("80");
  const [pKickoff, setPKickoff] = useState("");

  // News form
  const [nTitle, setNTitle] = useState("");
  const [nCategory, setNCategory] = useState("");
  const [nExcerpt, setNExcerpt] = useState("");

  // VIP pick form
  const [vMatch, setVMatch] = useState("");
  const [vLeague, setVLeague] = useState("");
  const [vPick, setVPick] = useState("");
  const [vOdds, setVOdds] = useState("1.85");
  const [vStake, setVStake] = useState("1");
  const [vKickoff, setVKickoff] = useState("");

  // VIP acca form
  const [aTitle, setATitle] = useState("");
  const [aStake, setAStake] = useState("1");
  const [aWhen, setAWhen] = useState("");
  const [aLegs, setALegs] = useState<VipAccaLeg[]>([{ match: "", pick: "", odds: 1.5 }]);

  useEffect(() => {
    void loadAll();
  }, []);

  const loadAll = async () => {
    const [predRes, newsRes, vipPicksRes, vipAccasRes] = await Promise.all([
      supabase.from("predictions").select("*").order("created_at", { ascending: false }),
      supabase.from("news_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("vip_picks").select("*").order("kickoff", { ascending: false }),
      supabase.from("vip_accumulators").select("*").order("scheduled_for", { ascending: false }),
    ]);
    if (predRes.data) {
      setPredictions(predRes.data.map((p) => ({
        id: p.id, league: p.league, match: p.match, pick: p.pick,
        confidence: p.confidence, kickoff: p.kickoff,
      })));
    }
    if (newsRes.data) {
      setPosts(newsRes.data.map((n) => ({
        id: n.id, title: n.title, category: n.category, excerpt: n.excerpt,
        time: new Date(n.created_at).toLocaleDateString(),
      })));
    }
    if (vipPicksRes.data) setVipPicks(vipPicksRes.data as VipPickRow[]);
    if (vipAccasRes.data) {
      setVipAccas(vipAccasRes.data.map((a: any) => ({
        ...a,
        legs: Array.isArray(a.legs) ? a.legs : [],
      })) as VipAccaRow[]);
    }
  };

  const stats = [
    { label: "Total Users", value: users.length, icon: Users },
    { label: "Active Predictions", value: predictions.length, icon: TrendingUp },
    { label: "News Posts", value: posts.length, icon: Newspaper },
    {
      label: "Revenue (UGX)",
      value: payments
        .filter((p) => p.status === "Successful")
        .reduce((sum, p) => sum + parseInt(p.amount.replace(/[^0-9]/g, ""), 10), 0)
        .toLocaleString(),
      icon: CreditCard,
    },
  ];

  const addPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pLeague || !pMatch || !pPick || !pKickoff) {
      toast.error("Fill all prediction fields");
      return;
    }
    const { error, data } = await supabase.from("predictions").insert({
      league: pLeague, match: pMatch, pick: pPick,
      confidence: Number(pConfidence) || 0, kickoff: pKickoff,
      created_by: user?.id ?? null,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setPredictions((prev) => [{ id: data.id, league: data.league, match: data.match, pick: data.pick, confidence: data.confidence, kickoff: data.kickoff }, ...prev]);
    setPLeague(""); setPMatch(""); setPPick(""); setPConfidence("80"); setPKickoff("");
    toast.success("Prediction published");
  };

  const deletePrediction = async (id: string) => {
    const { error } = await supabase.from("predictions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setPredictions((prev) => prev.filter((p) => p.id !== id));
    toast.success("Prediction removed");
  };

  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nTitle || !nCategory || !nExcerpt) {
      toast.error("Fill all news fields");
      return;
    }
    const { error, data } = await supabase.from("news_posts").insert({
      title: nTitle, category: nCategory, excerpt: nExcerpt,
      created_by: user?.id ?? null,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setPosts((prev) => [{ id: data.id, title: data.title, category: data.category, excerpt: data.excerpt, time: "Just now" }, ...prev]);
    setNTitle(""); setNCategory(""); setNExcerpt("");
    toast.success("News post published");
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Post removed");
  };

  const changePlan = (id: string, plan: AdminUser["plan"]) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, plan } : u)));
    toast.success("Plan updated");
  };

  // VIP picks
  const addVipPick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vMatch || !vLeague || !vPick || !vKickoff) {
      toast.error("Fill all VIP pick fields");
      return;
    }
    const { error, data } = await supabase.from("vip_picks").insert({
      match: vMatch, league: vLeague, pick: vPick,
      odds: Number(vOdds) || 1, stake_units: Number(vStake) || 1,
      kickoff: new Date(vKickoff).toISOString(),
      created_by: user?.id ?? null,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setVipPicks((prev) => [data as VipPickRow, ...prev]);
    setVMatch(""); setVLeague(""); setVPick(""); setVOdds("1.85"); setVStake("1"); setVKickoff("");
    toast.success("VIP pick published");
  };

  const setVipPickStatus = async (id: string, status: VipPickRow["status"]) => {
    const { error } = await supabase.from("vip_picks").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setVipPicks((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast.success("Status updated");
  };

  const deleteVipPick = async (id: string) => {
    const { error } = await supabase.from("vip_picks").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setVipPicks((prev) => prev.filter((p) => p.id !== id));
    toast.success("VIP pick removed");
  };

  // VIP accumulators
  const updateLeg = (i: number, field: keyof VipAccaLeg, val: string) => {
    setALegs((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: field === "odds" ? Number(val) || 0 : val } : l));
  };
  const addLeg = () => setALegs((prev) => [...prev, { match: "", pick: "", odds: 1.5 }]);
  const removeLeg = (i: number) => setALegs((prev) => prev.filter((_, idx) => idx !== i));

  const totalAccaOdds = aLegs.reduce((acc, l) => acc * (Number(l.odds) || 1), 1);

  const addVipAcca = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTitle || !aWhen || aLegs.some((l) => !l.match || !l.pick || !l.odds)) {
      toast.error("Fill title, date and all legs");
      return;
    }
    const { error, data } = await supabase.from("vip_accumulators").insert({
      title: aTitle,
      total_odds: totalAccaOdds,
      stake_units: Number(aStake) || 1,
      legs: aLegs as any,
      scheduled_for: new Date(aWhen).toISOString(),
      created_by: user?.id ?? null,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setVipAccas((prev) => [{ ...(data as any), legs: Array.isArray((data as any).legs) ? (data as any).legs : [] }, ...prev]);
    setATitle(""); setAStake("1"); setAWhen(""); setALegs([{ match: "", pick: "", odds: 1.5 }]);
    toast.success("Accumulator published");
  };

  const setAccaStatus = async (id: string, status: VipAccaRow["status"]) => {
    const { error } = await supabase.from("vip_accumulators").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setVipAccas((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success("Status updated");
  };

  const deleteAcca = async (id: string) => {
    const { error } = await supabase.from("vip_accumulators").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setVipAccas((prev) => prev.filter((a) => a.id !== id));
    toast.success("Accumulator removed");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <ShieldAlert className="h-5 w-5 text-primary-foreground" />
            </span>
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Predictions and news are saved to your database. Users and payments are demo only.</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">Live DB</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <s.icon className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="predictions" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 max-w-3xl">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Prediction</CardTitle>
              <CardDescription>Publish a new tip to the predictions page.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addPrediction} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pLeague">League</Label>
                  <Input id="pLeague" value={pLeague} onChange={(e) => setPLeague(e.target.value)} placeholder="Premier League" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pMatch">Match</Label>
                  <Input id="pMatch" value={pMatch} onChange={(e) => setPMatch(e.target.value)} placeholder="Arsenal vs Chelsea" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pPick">Pick</Label>
                  <Input id="pPick" value={pPick} onChange={(e) => setPPick(e.target.value)} placeholder="Over 2.5 Goals" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pKickoff">Kickoff</Label>
                  <Input id="pKickoff" value={pKickoff} onChange={(e) => setPKickoff(e.target.value)} placeholder="Sat 17:30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pConfidence">Confidence (%)</Label>
                  <Input id="pConfidence" type="number" min="0" max="100" value={pConfidence} onChange={(e) => setPConfidence(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="bg-gradient-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-1" /> Add Prediction
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Manage Predictions</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>League</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Pick</TableHead>
                    <TableHead>Conf.</TableHead>
                    <TableHead>Kickoff</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictions.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-muted-foreground">{p.league}</TableCell>
                      <TableCell className="font-medium">{p.match}</TableCell>
                      <TableCell>{p.pick}</TableCell>
                      <TableCell><Badge variant="secondary">{p.confidence}%</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{p.kickoff}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => deletePrediction(p.id)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish News Post</CardTitle>
              <CardDescription>Add a new article to the news section.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addPost} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nTitle">Title</Label>
                    <Input id="nTitle" value={nTitle} onChange={(e) => setNTitle(e.target.value)} placeholder="Mbappé scores hat-trick..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nCategory">Category</Label>
                    <Input id="nCategory" value={nCategory} onChange={(e) => setNCategory(e.target.value)} placeholder="La Liga" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nExcerpt">Excerpt</Label>
                  <Textarea id="nExcerpt" value={nExcerpt} onChange={(e) => setNExcerpt(e.target.value)} placeholder="Short summary..." rows={3} />
                </div>
                <Button type="submit" className="bg-gradient-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Publish
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Manage Posts</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium max-w-md truncate">{p.title}</TableCell>
                      <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{p.time}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => deletePost(p.id)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Crown className="h-4 w-4 text-vip" /> Add VIP Pick</CardTitle>
              <CardDescription>Subscriber-only pick. Set the result later to update ROI on the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addVipPick} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vLeague">League</Label>
                  <Input id="vLeague" value={vLeague} onChange={(e) => setVLeague(e.target.value)} placeholder="Premier League" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vMatch">Match</Label>
                  <Input id="vMatch" value={vMatch} onChange={(e) => setVMatch(e.target.value)} placeholder="Arsenal vs Chelsea" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vPick">Pick</Label>
                  <Input id="vPick" value={vPick} onChange={(e) => setVPick(e.target.value)} placeholder="BTTS — Yes" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vKickoff">Kickoff</Label>
                  <Input id="vKickoff" type="datetime-local" value={vKickoff} onChange={(e) => setVKickoff(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vOdds">Odds</Label>
                  <Input id="vOdds" type="number" step="0.01" min="1" value={vOdds} onChange={(e) => setVOdds(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vStake">Stake (units)</Label>
                  <Input id="vStake" type="number" step="0.5" min="0.5" value={vStake} onChange={(e) => setVStake(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="bg-gradient-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-1" /> Publish VIP Pick
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Manage VIP Picks</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Match</TableHead>
                    <TableHead>Pick</TableHead>
                    <TableHead>Odds</TableHead>
                    <TableHead>Stake</TableHead>
                    <TableHead>Kickoff</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vipPicks.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        <div>{p.match}</div>
                        <div className="text-xs text-muted-foreground">{p.league}</div>
                      </TableCell>
                      <TableCell>{p.pick}</TableCell>
                      <TableCell>{Number(p.odds).toFixed(2)}</TableCell>
                      <TableCell>{Number(p.stake_units).toFixed(2)}u</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{new Date(p.kickoff).toLocaleString()}</TableCell>
                      <TableCell>
                        <Select value={p.status} onValueChange={(v) => setVipPickStatus(p.id, v as VipPickRow["status"])}>
                          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="won">Won</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                            <SelectItem value="void">Void</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => deleteVipPick(p.id)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Crown className="h-4 w-4 text-vip" /> Add Accumulator</CardTitle>
              <CardDescription>Build a multi-leg slip. Total odds are calculated automatically.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addVipAcca} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aTitle">Title</Label>
                    <Input id="aTitle" value={aTitle} onChange={(e) => setATitle(e.target.value)} placeholder="Saturday Banker x4" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aWhen">Scheduled for</Label>
                    <Input id="aWhen" type="datetime-local" value={aWhen} onChange={(e) => setAWhen(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aStake">Stake (units)</Label>
                    <Input id="aStake" type="number" step="0.5" min="0.5" value={aStake} onChange={(e) => setAStake(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Legs</Label>
                    <span className="text-sm text-muted-foreground">Total odds: <span className="font-bold text-primary">{totalAccaOdds.toFixed(2)}</span></span>
                  </div>
                  {aLegs.map((leg, i) => (
                    <div key={i} className="grid md:grid-cols-[1fr_1fr_120px_40px] gap-2 items-center">
                      <Input placeholder="Match" value={leg.match} onChange={(e) => updateLeg(i, "match", e.target.value)} />
                      <Input placeholder="Pick (e.g. Over 2.5)" value={leg.pick} onChange={(e) => updateLeg(i, "pick", e.target.value)} />
                      <Input type="number" step="0.01" min="1" placeholder="Odds" value={leg.odds} onChange={(e) => updateLeg(i, "odds", e.target.value)} />
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeLeg(i)} disabled={aLegs.length === 1} aria-label="Remove leg">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addLeg}>
                    <Plus className="h-4 w-4 mr-1" /> Add Leg
                  </Button>
                </div>

                <Button type="submit" className="bg-gradient-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Publish Accumulator
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Manage Accumulators</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {vipAccas.length === 0 && <p className="text-sm text-muted-foreground">No accumulators yet.</p>}
              {vipAccas.map((a) => (
                <div key={a.id} className="rounded-lg border border-border/50 p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-bold">{a.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(a.scheduled_for).toLocaleString()} • {a.legs.length} legs • @ {Number(a.total_odds).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={a.status} onValueChange={(v) => setAccaStatus(a.id, v as VipAccaRow["status"])}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="won">Won</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="void">Void</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => deleteAcca(a.id)} aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                    {a.legs.map((leg, i) => (
                      <li key={i}>• {leg.match} — {leg.pick} <span className="text-primary font-semibold">@ {Number(leg.odds).toFixed(2)}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>View users and change their subscription plan.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Plan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.username}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                      <TableCell>
                        <Select value={u.plan} onValueChange={(v) => changePlan(u.id, v as AdminUser["plan"])}>
                          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Elite">Elite</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Recent VIP subscription transactions.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.user}</TableCell>
                      <TableCell>{p.plan}</TableCell>
                      <TableCell>{p.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{p.method}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            p.status === "Successful"
                              ? "bg-primary/15 text-primary border-primary/30"
                              : p.status === "Pending"
                                ? "bg-warning/15 text-warning border-warning/30"
                                : "bg-destructive/15 text-destructive border-destructive/30"
                          }
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}