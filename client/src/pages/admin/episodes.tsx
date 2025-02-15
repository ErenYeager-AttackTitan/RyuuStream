import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Episode, Series } from "@shared/schema";

export default function AdminEpisodesPage() {
  const { data: series } = useQuery<Series[]>({
    queryKey: ['/api/series']
  });

  const { data: episodes } = useQuery<Episode[]>({
    queryKey: ['/api/episodes']
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Episodes</h2>
          <p className="text-muted-foreground">
            Manage your anime episodes
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Episode
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Series</TableHead>
                <TableHead>Episode</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {episodes?.map((episode) => {
                const seriesTitle = series?.find(s => s.id === episode.seriesId)?.title;
                return (
                  <TableRow key={episode.id}>
                    <TableCell className="font-medium">{seriesTitle}</TableCell>
                    <TableCell>Episode {episode.number}</TableCell>
                    <TableCell>{episode.title}</TableCell>
                    <TableCell>{new Date(episode.created).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}