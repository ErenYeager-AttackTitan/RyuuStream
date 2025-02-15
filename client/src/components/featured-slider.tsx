import { useCallback } from "react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Series } from "@shared/schema";

interface FeaturedSliderProps {
  series: Series[];
}

export default function FeaturedSlider({ series }: FeaturedSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {series.map((item) => (
            <div key={item.id} className="flex-[0_0_100%] min-w-0">
              <div className="block">
                <AspectRatio ratio={21/9}>
                  <img
                    src={item.banner}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="container px-4 space-y-4">
                      <h2 className="text-4xl md:text-5xl font-bold text-white max-w-2xl">{item.title}</h2>
                      <p className="text-lg text-white/90 max-w-2xl line-clamp-2">{item.description}</p>
                      <Link href={`/series/${item.id}`}>
                        <Button className="gap-2">
                          <Play className="h-5 w-5" />
                          Start Watching
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={scrollNext}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  );
}