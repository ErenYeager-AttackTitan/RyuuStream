import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, PlaySquare, Users, TrendingUp } from "lucide-react";
import type { Series, Episode } from "@shared/schema";

export default function AdminDashboard() {
  const { data: series } = useQuery<Series[]>({
    queryKey: ['/api/series']
  });

  const { data: episodes } = useQuery<Episode[]>({
    queryKey: ['/api/episodes']
  });

  const stats = [
    {
      name: 'Total Series',
      value: series?.length ?? 0,
      icon: Film,
      change: '+4.75%',
      changeType: 'positive' as const
    },
    {
      name: 'Total Episodes',
      value: episodes?.length ?? 0,
      icon: PlaySquare,
      change: '+54.4%',
      changeType: 'positive' as const
    },
    {
      name: 'Active Users',
      value: '2,345',
      icon: Users,
      change: '+5.25%',
      changeType: 'positive' as const
    },
    {
      name: 'Watch Time',
      value: '24.5K',
      icon: TrendingUp,
      change: '+2.5%',
      changeType: 'positive' as const
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, here's an overview of your streaming platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
