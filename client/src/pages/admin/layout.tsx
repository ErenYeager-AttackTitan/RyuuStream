import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Film,
  PlaySquare,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Series', href: '/admin/series', icon: Film },
  { name: 'Episodes', href: '/admin/episodes', icon: PlaySquare },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="grid lg:grid-cols-[280px_1fr] h-screen">
      <div className="hidden lg:flex flex-col border-r bg-card">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <span className="font-bold text-xl">RyuuStream</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">Admin Dashboard</p>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-6xl mx-auto py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}