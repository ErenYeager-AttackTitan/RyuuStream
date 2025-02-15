import { useQuery } from "@tanstack/react-query";
import FeaturedSlider from "@/components/featured-slider";
import SeriesGrid from "@/components/series-grid";
import { Skeleton } from "@/components/ui/skeleton";
import type { Series } from "@shared/schema";

export default function Home() {
  const { data: series, isLoading } = useQuery<Series[]>({
    queryKey: ['/api/series']
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="aspect-[21/9] w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-3/4 mt-4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FeaturedSlider series={series || []} />
      <div>
        <h2 className="text-2xl font-bold mb-6">All Series</h2>
        <SeriesGrid series={series || []} />
      </div>
    </div>
  );
}