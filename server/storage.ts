import { type Series, type InsertSeries, type Episode, type InsertEpisode, type User, type InsertUser } from "@shared/schema";
import { series, episodes, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User management
  getAllUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStatus(id: number, status: string): Promise<User | undefined>;
  updateUserRole(id: number, isAdmin: boolean): Promise<User | undefined>;

  // Series management
  getAllSeries(): Promise<Series[]>;
  getSeries(id: number): Promise<Series | undefined>;
  createSeries(series: InsertSeries, userId: number): Promise<Series>;
  updateSeriesStatus(id: number, status: string, userId: number): Promise<Series | undefined>;

  // Episode management
  getEpisodes(seriesId: number): Promise<Episode[]>;
  getAllEpisodes(): Promise<Episode[]>;
  getEpisode(id: number): Promise<Episode | undefined>;
  createEpisode(episode: InsertEpisode, userId: number): Promise<Episode>;
  updateEpisodeStatus(id: number, status: string, userId: number): Promise<Episode | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUserStatus(id: number, status: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        status, 
        updated: new Date().toISOString()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserRole(id: number, isAdmin: boolean): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        isAdmin, 
        updated: new Date().toISOString()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Series management
  async getAllSeries(): Promise<Series[]> {
    return await db.select().from(series);
  }

  async getSeries(id: number): Promise<Series | undefined> {
    const [result] = await db.select().from(series).where(eq(series.id, id));
    return result;
  }

  async createSeries(data: InsertSeries, userId: number): Promise<Series> {
    const [newSeries] = await db
      .insert(series)
      .values({
        ...data,
        createdBy: userId,
        updatedBy: userId,
      })
      .returning();
    return newSeries;
  }

  async updateSeriesStatus(id: number, status: string, userId: number): Promise<Series | undefined> {
    const [updatedSeries] = await db
      .update(series)
      .set({ 
        status, 
        updatedBy: userId,
        updated: new Date().toISOString()
      })
      .where(eq(series.id, id))
      .returning();
    return updatedSeries;
  }

  // Episode management
  async getEpisodes(seriesId: number): Promise<Episode[]> {
    return await db.select().from(episodes).where(eq(episodes.seriesId, seriesId));
  }

  async getAllEpisodes(): Promise<Episode[]> {
    return await db.select().from(episodes);
  }

  async getEpisode(id: number): Promise<Episode | undefined> {
    const [result] = await db.select().from(episodes).where(eq(episodes.id, id));
    return result;
  }

  async createEpisode(data: InsertEpisode, userId: number): Promise<Episode> {
    const [newEpisode] = await db
      .insert(episodes)
      .values({
        ...data,
        createdBy: userId,
        updatedBy: userId,
      })
      .returning();
    return newEpisode;
  }

  async updateEpisodeStatus(id: number, status: string, userId: number): Promise<Episode | undefined> {
    const [updatedEpisode] = await db
      .update(episodes)
      .set({ 
        status, 
        updatedBy: userId,
        updated: new Date().toISOString()
      })
      .where(eq(episodes.id, id))
      .returning();
    return updatedEpisode;
  }

  // Initialize with mock data
  async initializeMockData() {
    const mockSeries: InsertSeries[] = [
      {
        title: "Spirit Blade",
        description: "A young warrior discovers ancient powers through a mystical sword.",
        poster: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3",
        banner: "https://images.unsplash.com/photo-1558770147-a0e2842c5ea1",
        genre: "Action"
      },
      {
        title: "Cyber Academy",
        description: "Students at a futuristic academy learn to harness digital powers.",
        poster: "https://images.unsplash.com/photo-1625189659340-887baac3ea32",
        banner: "https://images.unsplash.com/photo-1558770147-68c0607adb26",
        genre: "Sci-Fi"
      }
    ];

    // Insert series
    for (const seriesData of mockSeries) {
      const [insertedSeries] = await db.insert(series).values(seriesData).returning();

      // Add episodes for each series
      for (let epNum = 1; epNum <= 12; epNum++) {
        const episodeData: InsertEpisode = {
          seriesId: insertedSeries.id,
          title: `Episode ${epNum}`,
          number: epNum,
          videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        };
        await db.insert(episodes).values(episodeData);
      }
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize mock data only in development
if (process.env.NODE_ENV !== 'production') {
  storage.initializeMockData().catch(console.error);
}