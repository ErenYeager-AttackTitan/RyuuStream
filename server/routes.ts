import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { setupAuth, requireAdmin } from "./auth";

export async function registerRoutes(app: Express) {
  // Setup authentication
  setupAuth(app);

  // Protected admin routes
  app.get("/api/users", requireAdmin, async (_req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.post("/api/users/:id/status", requireAdmin, async (req, res) => {
    const user = await storage.updateUserStatus(Number(req.params.id), req.body.status);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.post("/api/users/:id/role", requireAdmin, async (req, res) => {
    const user = await storage.updateUserRole(Number(req.params.id), req.body.isAdmin);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Series routes
  app.get("/api/series", requireAdmin, async (_req, res) => {
    const series = await storage.getAllSeries();
    res.json(series);
  });

  app.get("/api/series/:id", requireAdmin, async (req, res) => {
    const series = await storage.getSeries(Number(req.params.id));
    if (!series) {
      return res.status(404).json({ message: "Series not found" });
    }
    res.json(series);
  });

  app.get("/api/series/:id/episodes", requireAdmin, async (req, res) => {
    const episodes = await storage.getEpisodes(Number(req.params.id));
    res.json(episodes);
  });

  app.post("/api/series/:id/status", requireAdmin, async (req, res) => {
    const series = await storage.updateSeriesStatus(
      Number(req.params.id),
      req.body.status,
      req.body.userId
    );
    if (!series) {
      return res.status(404).json({ message: "Series not found" });
    }
    res.json(series);
  });

  // Episode routes
  app.get("/api/episodes", requireAdmin, async (_req, res) => {
    const episodes = await storage.getAllEpisodes();
    res.json(episodes);
  });

  app.get("/api/episodes/:id", requireAdmin, async (req, res) => {
    const episode = await storage.getEpisode(Number(req.params.id));
    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }
    res.json(episode);
  });

  app.post("/api/episodes/:id/status", requireAdmin, async (req, res) => {
    const episode = await storage.updateEpisodeStatus(
      Number(req.params.id),
      req.body.status,
      req.body.userId
    );
    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }
    res.json(episode);
  });

  return createServer(app);
}