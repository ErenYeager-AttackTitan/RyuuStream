import ReactPlayer from "react-player";
import { Card } from "@/components/ui/card";
import type { Episode } from "@shared/schema";

interface VideoPlayerProps {
  episode: Episode;
}

export default function VideoPlayer({ episode }: VideoPlayerProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video">
        <ReactPlayer
          url={episode.videoUrl}
          width="100%"
          height="100%"
          controls
          playing
          playsinline
          config={{
            file: {
              forceHLS: true,
              attributes: {
                crossOrigin: "anonymous"
              }
            }
          }}
        />
      </div>
    </Card>
  );
}