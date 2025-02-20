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
      
