import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
import { Trash2, Plus, ShieldAlert, TrendingUp, Users, Newspaper, CreditCard, Lock } from "lucide-react";
import { featuredMatches, news as initialNews } from "@/lib/data";

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

const seedPredictions: Prediction[] = featuredMatches.map((m) => ({
  id: m.id,
  league: m.league,
  match: `${m.home} vs ${m.away}`,
  pick: m.prediction,
  confidence: m.confidence,
  kickoff: m.kickoff,
}));

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

  const [predictions, setPredictions] = useState<Prediction[]>(seedPredictions);
  const [posts, setPosts] = useState<NewsPost[]>(
    initialNews.map((n) => ({ id: n.id, title: n.title, category: n.category, excerpt: n.excerpt, time: n.time })),
  );
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [payments] = useState<Payment[]>(seedPayments);

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

  const addPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pLeague || !pMatch || !pPick || !pKickoff) {
      toast.error("Fill all prediction fields");
      return;
    }
    setPredictions((prev) => [
      { id: crypto.randomUUID(), league: pLeague, match: pMatch, pick: pPick, confidence: Number(pConfidence) || 0, kickoff: pKickoff },
      ...prev,
    ]);
    setPLeague(""); setPMatch(""); setPPick(""); setPConfidence("80"); setPKickoff("");
    toast.success("Prediction added");
  };

  const deletePrediction = (id: string) => {
    setPredictions((prev) => prev.filter((p) => p.id !== id));
    toast.success("Prediction removed");
  };

  const addPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nTitle || !nCategory || !nExcerpt) {
      toast.error("Fill all news fields");
      return;
    }
    setPosts((prev) => [
      { id: crypto.randomUUID(), title: nTitle, category: nCategory, excerpt: nExcerpt, time: "Just now" },
      ...prev,
    ]);
    setNTitle(""); setNCategory(""); setNExcerpt("");
    toast.success("News post published");
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Post removed");
  };

  const changePlan = (id: string, plan: AdminUser["plan"]) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, plan } : u)));
    toast.success("Plan updated");
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
          <p className="text-sm text-muted-foreground mt-2">Demo mode — changes are not persisted. Connect Lovable Cloud to save data.</p>
        </div>
        <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/30">Demo</Badge>
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
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