import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSeriesSchema, insertEpisodeSchema, insertNotificationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Series routes
  app.get("/api/series", async (req, res) => {
    const series = await storage.getAllSeries();
    res.json(series);
  });

  app.get("/api/series/:id", async (req, res) => {
    const series = await storage.getSeriesById(parseInt(req.params.id));
    if (!series) return res.sendStatus(404);
    res.json(series);
  });

  // Protected admin routes
  app.post("/api/series", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const parsed = insertSeriesSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const series = await storage.createSeries(parsed.data);
    res.status(201).json(series);
  });

  app.delete("/api/series/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    await storage.deleteSeries(parseInt(req.params.id));
    res.sendStatus(200);
  });

  // Episode routes
  app.get("/api/series/:id/episodes", async (req, res) => {
    const episodes = await storage.getEpisodesBySeriesId(parseInt(req.params.id));
    res.json(episodes);
  });

  app.get("/api/episodes/:id", async (req, res) => {
    const episode = await storage.getEpisodeById(parseInt(req.params.id));
    if (!episode) return res.sendStatus(404);
    res.json(episode);
  });

  app.post("/api/episodes", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const parsed = insertEpisodeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const episode = await storage.createEpisode(parsed.data);
    res.status(201).json(episode);
  });

  app.delete("/api/episodes/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    await storage.deleteEpisode(parseInt(req.params.id));
    res.sendStatus(200);
  });

  // Add these routes after the existing episode routes
  app.get("/api/notifications", async (req, res) => {
    const notifications = await storage.getNotifications();
    res.json(notifications);
  });

  app.post("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const parsed = insertNotificationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const notification = await storage.createNotification(parsed.data);
    res.status(201).json(notification);
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    await storage.markNotificationAsRead(parseInt(req.params.id));
    res.sendStatus(200);
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    await storage.deleteNotification(parseInt(req.params.id));
    res.sendStatus(200);
  });

  // Secret notification push endpoint with API key authentication
  const API_KEY = process.env.NOTIFICATION_API_KEY || "dev-api-key";
  app.post("/api/notifications/push", async (req, res) => {
    const providedKey = req.headers["x-api-key"];
    if (providedKey !== API_KEY) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    const parsed = insertNotificationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const notification = await storage.createNotification(parsed.data);
    res.status(201).json(notification);
  });

  const httpServer = createServer(app);
  return httpServer;
    }
