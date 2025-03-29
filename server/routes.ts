import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertMaidSchema, insertBookingSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  // Waitlist API routes
  app.post("/api/waitlist", async (req: Request, res: Response) => {
    try {
      // Validate the request body against the schema
      const result = insertWaitlistSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      // Check if email already exists in waitlist
      const existingEntry = await storage.getWaitlistEntryByEmail(result.data.email);
      if (existingEntry) {
        return res.status(409).json({
          message: "Email already registered on waitlist"
        });
      }
      
      // Create new waitlist entry
      const waitlistEntry = await storage.createWaitlistEntry(result.data);
      
      return res.status(201).json({
        message: "Successfully added to waitlist",
        data: waitlistEntry
      });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  });

  // Get waitlist entries count
  app.get("/api/waitlist/count", async (_req: Request, res: Response) => {
    try {
      const entries = await storage.getWaitlistEntries();
      return res.status(200).json({
        count: entries.length
      });
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  });

  // Maid API routes
  app.post("/api/maids", async (req: Request, res: Response) => {
    try {
      // Validate the request body against the schema
      const result = insertMaidSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      // Check if email already exists
      const existingMaid = await storage.getMaidByEmail(result.data.email);
      if (existingMaid) {
        return res.status(409).json({
          message: "Email already registered"
        });
      }
      
      // Create new maid entry
      const maid = await storage.createMaid(result.data);
      
      return res.status(201).json({
        message: "Successfully registered as a maid",
        data: maid
      });
    } catch (error) {
      console.error("Error registering maid:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  });

  // Get all maids
  app.get("/api/maids", async (_req: Request, res: Response) => {
    try {
      const maids = await storage.getMaids();
      return res.status(200).json({
        maids
      });
    } catch (error) {
      console.error("Error getting maids:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  });

  // Get maids by city
  app.get("/api/maids/city/:city", async (req: Request, res: Response) => {
    try {
      const { city } = req.params;
      const maids = await storage.getMaidsByCity(city);
      return res.status(200).json({
        maids
      });
    } catch (error) {
      console.error("Error getting maids by city:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  });

  // Get maids by locality
  app.get("/api/maids/locality/:locality", async (req: Request, res: Response) => {
    try {
      const { locality } = req.params;
      const maids = await storage.getMaidsByLocality(locality);
      return res.status(200).json({
        maids
      });
    } catch (error) {
      console.error("Error getting maids by locality:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  });

  // Get maid by ID
  app.get("/api/maids/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid ID format"
        });
      }
      
      const maid = await storage.getMaidById(id);
      if (!maid) {
        return res.status(404).json({
          message: "Maid not found"
        });
      }
      
      return res.status(200).json({
        maid
      });
    } catch (error) {
      console.error("Error getting maid by ID:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  });

  // Booking API routes
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Validate the request body
      const result = insertBookingSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      // Check if maid exists
      const maid = await storage.getMaidById(result.data.maidId);
      if (!maid) {
        return res.status(404).json({ message: "Maid not found" });
      }
      
      // Create the booking
      const booking = await storage.createBooking(result.data);
      
      return res.status(201).json({ 
        message: "Booking created successfully",
        data: booking
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/bookings", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Admin can see all bookings, users can only see their own
      const user = req.user as any;
      let bookings;
      
      if (user.role === "admin") {
        bookings = await storage.getBookings();
      } else {
        bookings = await storage.getBookingsByUserId(user.id);
      }
      
      return res.status(200).json({ bookings });
    } catch (error) {
      console.error("Error getting bookings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const booking = await storage.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if user is admin or the booking belongs to the user
      const user = req.user as any;
      if (user.role !== "admin" && booking.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      return res.status(200).json({ booking });
    } catch (error) {
      console.error("Error getting booking by ID:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Validate status
      if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const booking = await storage.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if user is admin or the booking belongs to the user
      const user = req.user as any;
      if (user.role !== "admin" && booking.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(id, status);
      
      return res.status(200).json({ 
        message: "Booking status updated successfully",
        data: updatedBooking
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Company settings API (admin only)
  app.get("/api/company-settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getCompanySettings();
      if (!settings) {
        return res.status(404).json({ message: "Company settings not found" });
      }
      
      return res.status(200).json({ settings });
    } catch (error) {
      console.error("Error getting company settings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/company-settings", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Check if user is admin
      const user = req.user as any;
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const settings = await storage.createOrUpdateCompanySettings(req.body);
      
      return res.status(200).json({ 
        message: "Company settings updated successfully",
        data: settings
      });
    } catch (error) {
      console.error("Error updating company settings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
