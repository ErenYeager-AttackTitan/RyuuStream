import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Nav from "./components/nav";
import AdminLayout from "./pages/admin/layout";
import AdminLogin from "./pages/admin/login";
import Home from "./pages/home";
import Series from "./pages/series";
import Watch from "./pages/watch";
import AdminDashboard from "./pages/admin";
import AdminSeries from "./pages/admin/series";
import AdminEpisodes from "./pages/admin/episodes";
import AdminUsers from "./pages/admin/users";
import NotFound from "./pages/not-found";
import { useQuery } from "@tanstack/react-query";

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    window.location.href = "/admin/login";
    return null;
  }

  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={() => <AdminRoute component={AdminDashboard} />} />
        <Route path="/admin/series" component={() => <AdminRoute component={AdminSeries} />} />
        <Route path="/admin/episodes" component={() => <AdminRoute component={AdminEpisodes} />} />
        <Route path="/admin/users" component={() => <AdminRoute component={AdminUsers} />} />
        <Route>
          <Nav />
          <main className="container mx-auto px-4 py-8">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/series/:id" component={Series} />
              <Route path="/watch/:id" component={Watch} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </Route>
      </Switch>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;