import { Link } from "wouter";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import type { Episode } from "@shared/schema";

interface EpisodeListProps {
  episodes: Episode[];
}

export default function EpisodeList({ episodes }: EpisodeListProps) {
  return (
    <div className="grid gap-4">
      {episodes.map((episode) => (
        <Link 
          key={episode.id} 
          href={`/watch/${episode.id}`}
          className="block"
        >
          <Card className="transition-colors hover:bg-accent cursor-pointer">
            <CardHeader className="p-4">
              <div className="flex items-center gap-4">
                <Play className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Episode {episode.number}</h3>
                  <p className="text-sm text-muted-foreground">{episode.title}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}