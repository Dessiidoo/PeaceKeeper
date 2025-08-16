import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const officers = pgTable("officers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  badge: text("badge").notNull().unique(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  status: text("status").notNull().default("active"),
});

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  safetyScore: integer("safety_score").notNull(),
  riskFactors: text("risk_factors").notNull(),
  coordinates: json("coordinates").$type<Array<{lat: number, lng: number}>>().notNull(),
  estimatedTime: integer("estimated_time").notNull(), // in minutes
  distance: real("distance").notNull(), // in miles
  status: text("status").notNull().default("available"),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  priority: text("priority").notNull(),
  message: text("message").notNull(),
  location: text("location").notNull(),
  coordinates: json("coordinates").$type<{lat: number, lng: number}>(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  officerId: varchar("officer_id").notNull().references(() => officers.id),
  type: text("type").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  coordinates: json("coordinates").$type<{lat: number, lng: number}>(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  status: text("status").notNull().default("open"),
  threatLevel: text("threat_level").notNull(),
});

export const emergencyServices = pgTable("emergency_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // fire, ems, police
  name: text("name").notNull(),
  location: text("location").notNull(),
  coordinates: json("coordinates").$type<{lat: number, lng: number}>().notNull(),
  distance: real("distance").notNull(), // distance from current location
  isAvailable: boolean("is_available").notNull().default(true),
});

export const insertOfficerSchema = createInsertSchema(officers).pick({
  badge: true,
  name: true,
  unit: true,
});

export const insertRouteSchema = createInsertSchema(routes).pick({
  name: true,
  description: true,
  safetyScore: true,
  riskFactors: true,
  coordinates: true,
  estimatedTime: true,
  distance: true,
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  type: true,
  priority: true,
  message: true,
  location: true,
  coordinates: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).pick({
  officerId: true,
  type: true,
  description: true,
  location: true,
  coordinates: true,
  threatLevel: true,
});

export const insertEmergencyServiceSchema = createInsertSchema(emergencyServices).pick({
  type: true,
  name: true,
  location: true,
  coordinates: true,
  distance: true,
});

export type InsertOfficer = z.infer<typeof insertOfficerSchema>;
export type Officer = typeof officers.$inferSelect;

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

export type InsertEmergencyService = z.infer<typeof insertEmergencyServiceSchema>;
export type EmergencyService = typeof emergencyServices.$inferSelect;
