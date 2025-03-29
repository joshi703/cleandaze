import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enhanced users table with role
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("customer"), // admin, customer
  createdAt: text("created_at").notNull(),
});

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  company: text("company"),
  joinedAt: text("joined_at").notNull(),
});

export const maids = pgTable("maids", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  locality: text("locality").notNull(),
  address: text("address"),
  experience: text("experience"),
  services: text("services").array(),
  joinedAt: text("joined_at").notNull(),
  isAvailable: boolean("is_available").default(true),
});

// Bookings table to store service booking information
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // who booked the service
  maidId: integer("maid_id").notNull(), // which maid was booked
  serviceType: text("service_type").notNull(), // type of service booked
  bookingDate: text("booking_date").notNull(), // when the service is scheduled for
  bookingTime: text("booking_time").notNull(), // time of the service
  address: text("address").notNull(), // service location
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

// Company settings table for dashboard configuration
export const companySettings = pgTable("company_settings", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  address: text("address").notNull(),
  logo: text("logo"),
  servicesOffered: text("services_offered").array(),
  operatingHours: text("operating_hours"),
  updatedAt: text("updated_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWaitlistSchema = createInsertSchema(waitlistEntries).pick({
  name: true,
  email: true,
  company: true,
});

export const insertMaidSchema = createInsertSchema(maids).pick({
  name: true,
  email: true,
  phone: true,
  city: true,
  locality: true,
  address: true,
  experience: true,
  services: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertCompanySettingsSchema = createInsertSchema(companySettings).omit({
  id: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;

export type InsertMaid = z.infer<typeof insertMaidSchema>;
export type Maid = typeof maids.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;
export type CompanySettings = typeof companySettings.$inferSelect;

export type LoginCredentials = z.infer<typeof loginSchema>;
