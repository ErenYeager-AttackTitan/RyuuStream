import { series, episodes, users, notifications, type Series, type Episode, type InsertSeries, type InsertEpisode, type User, type InsertUser, type Notification, type InsertNotification } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Series management
  getAllSeries(): Promise<Series[]>;
  getSeriesById(id: number): Promise<Series | undefined>;
  createSeries(series: InsertSeries): Promise<Series>;
  deleteSeries(id: number): Promise<void>;

  // Episode management
  getEpisodesBySeriesId(seriesId: number): Promise<Episode[]>;
  getEpisodeById(id: number): Promise<Episode | undefined>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
  deleteEpisode(id: number): Promise<void>;

  // Session store
  sessionStore: session.Store;

  // Notification management
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;
  deleteNotification(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Series management
  async getAllSeries(): Promise<Series[]> {
    return await db.select().from(series);
  }

  async getSeriesById(id: number): Promise<Series | undefined> {
    const [result] = await db.select().from(series).where(eq(series.id, id));
    return result;
  }

  async createSeries(insertSeries: InsertSeries): Promise<Series> {
    const [result] = await db.insert(series).values(insertSeries).returning();
    return result;
  }

  async deleteSeries(id: number): Promise<void> {
    await db.delete(series).where(eq(series.id, id));
    // Delete associated episodes
    await db.delete(episodes).where(eq(episodes.seriesId, id));
  }

  // Episode management
  async getEpisodesBySeriesId(seriesId: number): Promise<Episode[]> {
    return await db
      .select()
      .from(episodes)
      .where(eq(episodes.seriesId, seriesId))
      .orderBy(episodes.episodeNumber);
  }

  async getEpisodeById(id: number): Promise<Episode | undefined> {
    const [result] = await db.select().from(episodes).where(eq(episodes.id, id));
    return result;
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const [result] = await db.insert(episodes).values(insertEpisode).returning();
    return result;
  }

  async deleteEpisode(id: number): Promise<void> {
    await db.delete(episodes).where(eq(episodes.id, id));
  }

  // Notification methods
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [result] = await db.insert(notifications).values(notification).returning();
    return result;
  }

  async getNotifications(): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  async deleteNotification(id: number): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
