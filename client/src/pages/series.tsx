import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import EpisodeList from "@/components/episode-list";
import type { Series, Episode } from "@shared/schema";

export default function SeriesPage() {
  const { id } = useParams();
  const seriesId = Number(id);

  const { data: series, isLoading: loadingSeries } = useQuery<Series>({
    queryKey: [`/api/series/${seriesId}`]
  });

  const { data: episodes, isLoading: loadingEpisodes } = useQuery<Episode[]>({
    queryKey: [`/api/series/${seriesId}/episodes`]
  });

  if (loadingSeries || loadingEpisodes) {
    return (
      <div className="space-y-8">
        <Skeleton className="aspect-[21/9] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!series || !episodes) return null;

  return (
    <div className="space-y-8">
      <AspectRatio ratio={21/9}>
        <img
          src={series.banner}
          alt={series.title}
          className="object-cover w-full h-full rounded-lg"
        />
      </AspectRatio>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{series.title}</h1>
        <p className="text-lg text-muted-foreground">{series.description}</p>
      </div>

      <EpisodeList episodes={episodes} />
    </div>
  );
}
