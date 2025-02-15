import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import VideoPlayer from "@/components/video-player";
import EpisodeList from "@/components/episode-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import type { Episode } from "@shared/schema";

export default function WatchPage() {
  const { id } = useParams();
  const episodeId = Number(id);

  const { data: episode, isLoading: loadingEpisode } = useQuery<Episode>({
    queryKey: [`/api/episodes/${episodeId}`]
  });

  const { data: seriesEpisodes, isLoading: loadingEpisodes } = useQuery<Episode[]>({
    queryKey: episode ? [`/api/series/${episode.seriesId}/episodes`] : [],
    enabled: !!episode
  });

  if (loadingEpisode || loadingEpisodes) {
    return (
      <div className="space-y-8">
        <Skeleton className="aspect-video w-full" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!episode || !seriesEpisodes) return null;

  return (
    <div className="space-y-8">
      <VideoPlayer episode={episode} />

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Episodes</h2>
        <EpisodeList episodes={seriesEpisodes} />
      </Card>
    </div>
  );
}