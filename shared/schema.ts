import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  status: text("status").notNull().default("active"),
  lastLoginAt: timestamp("last_login_at"),
  created: text("created_at").notNull().default(new Date().toISOString()),
  updated: text("updated_at").notNull().default(new Date().toISOString())
});

export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  poster: text("poster").notNull(),
  banner: text("banner").notNull(),
  genre: text("genre").notNull(),
  status: text("status").notNull().default("draft"),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  created: text("created_at").notNull().default(new Date().toISOString()),
  updated: text("updated_at").notNull().default(new Date().toISOString())
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id").references(() => series.id).notNull(),
  title: text("title").notNull(),
  number: integer("number").notNull(),
  videoUrl: text("video_url").notNull(),
  status: text("status").notNull().default("draft"),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  created: text("created_at").notNull().default(new Date().toISOString()),
  updated: text("updated_at").notNull().default(new Date().toISOString())
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  series: many(series),
  episodes: many(episodes),
}));

export const seriesRelations = relations(series, ({ one, many }) => ({
  creator: one(users, {
    fields: [series.createdBy],
    references: [users.id],
  }),
  editor: one(users, {
    fields: [series.updatedBy],
    references: [users.id],
  }),
  episodes: many(episodes),
}));

export const episodesRelations = relations(episodes, ({ one }) => ({
  series: one(series, {
    fields: [episodes.seriesId],
    references: [series.id],
  }),
  creator: one(users, {
    fields: [episodes.createdBy],
    references: [users.id],
  }),
  editor: one(users, {
    fields: [episodes.updatedBy],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ 
    id: true, 
    lastLoginAt: true,
    created: true, 
    updated: true 
  });

export const insertSeriesSchema = createInsertSchema(series)
  .omit({ 
    id: true, 
    status: true,
    createdBy: true,
    updatedBy: true,
    created: true,
    updated: true 
  });

export const insertEpisodeSchema = createInsertSchema(episodes)
  .omit({ 
    id: true,
    status: true,
    createdBy: true,
    updatedBy: true,
    created: true,
    updated: true 
  });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Series = typeof series.$inferSelect;
export type InsertSeries = z.infer<typeof insertSeriesSchema>;
export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;