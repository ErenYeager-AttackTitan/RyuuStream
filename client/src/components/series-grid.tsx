import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Series } from "@shared/schema";

interface SeriesGridProps {
  series: Series[];
  className?: string;
}

export default function SeriesGrid({ series, className = "" }: SeriesGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ${className}`}>
      {series.map((item) => (
        <Link 
          key={item.id} 
          href={`/series/${item.id}`}
          className="group block"
        >
          <Card className="border-0 bg-transparent overflow-hidden">
            <AspectRatio ratio={3/4}>
              <img
                src={item.poster}
                alt={item.title}
                className="object-cover w-full h-full rounded-md transition-transform group-hover:scale-105"
              />
            </AspectRatio>
            <div className="p-2">
              <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {item.genre}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}