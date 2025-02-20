import { useQuery, useMutation } from "@tanstack/react-query";
import { Series, insertSeriesSchema, insertEpisodeSchema, insertNotificationSchema, Notification } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Trash2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/SearchBar";
import { useState } from "react";

export default function AdminPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: series, isLoading: seriesLoading } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const seriesForm = useForm({
    resolver: zodResolver(insertSeriesSchema),
  });

  const episodeForm = useForm({
    resolver: zodResolver(insertEpisodeSchema),
  });

  const notificationForm = useForm({
    resolver: zodResolver(insertNotificationSchema),
  });

  const createSeriesMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/series", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      toast({ title: "Series created successfully" });
      seriesForm.reset();
    },
  });

  const createEpisodeMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/episodes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      toast({ title: "Episode created successfully" });
      episodeForm.reset();
    },
  });

  const deleteSeriesMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/series/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      toast({ title: "Series deleted successfully" });
    },
  });

  const createNotificationMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/notifications", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({ title: "Notification sent successfully" });
      notificationForm.reset();
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({ title: "Notification deleted successfully" });
    },
  });

  const filteredSeries = series?.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (seriesLoading || notificationsLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Tabs defaultValue="series">
        <TabsList className="w-full">
          <TabsTrigger value="series">Manage Series</TabsTrigger>
          <TabsTrigger value="episodes">Manage Episodes</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="series" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Series</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={seriesForm.handleSubmit((data) => createSeriesMutation.mutate(data))} className="space-y-4">
                <Input placeholder="Title" {...seriesForm.register("title")} />
                <Textarea placeholder="Description" {...seriesForm.register("description")} />
                <Input placeholder="Cover Image URL" {...seriesForm.register("coverImage")} />
                <Input type="number" placeholder="Total Episodes" {...seriesForm.register("totalEpisodes", { valueAsNumber: true })} />
                <Button type="submit" disabled={createSeriesMutation.isPending}>
                  {createSeriesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Series
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Series</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <SearchBar onSearch={setSearchQuery} />
              </div>
              <div className="space-y-4">
                {filteredSeries?.map(s => (
                  <div key={s.id} className="flex justify-between items-center p-4 border rounded">
                    <span>{s.title}</span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteSeriesMutation.mutate(s.id)}
                      disabled={deleteSeriesMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="episodes">
          <Card>
            <CardHeader>
              <CardTitle>Add New Episode</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={episodeForm.handleSubmit((data) => createEpisodeMutation.mutate(data))} className="space-y-4">
                <select 
                  className="w-full p-2 border rounded"
                  {...episodeForm.register("seriesId", { valueAsNumber: true })}
                >
                  <option value="">Select Series</option>
                  {series?.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
                <Input type="number" placeholder="Episode Number" {...episodeForm.register("episodeNumber", { valueAsNumber: true })} />
                <Input placeholder="Episode Title" {...episodeForm.register("title")} />
                <Input placeholder="Embed URL" {...episodeForm.register("embedUrl")} />
                <Button type="submit" disabled={createEpisodeMutation.isPending}>
                  {createEpisodeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Episode
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Send Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={notificationForm.handleSubmit((data) => createNotificationMutation.mutate(data))} className="space-y-4">
                <Input placeholder="Title" {...notificationForm.register("title")} />
                <Textarea placeholder="Message" {...notificationForm.register("message")} />
                <select 
                  className="w-full p-2 border rounded"
                  {...notificationForm.register("seriesId", { valueAsNumber: true })}
                >
                  <option value="">Select Related Series (Optional)</option>
                  {series?.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
                <Button type="submit" disabled={createNotificationMutation.isPending}>
                  {createNotificationMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Notification
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications?.map(notification => (
                  <div key={notification.id} className="flex justify-between items-start p-4 border rounded">
                    <div>
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteNotificationMutation.mutate(notification.id)}
                      disabled={deleteNotificationMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
                             }
