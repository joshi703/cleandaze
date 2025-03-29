import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertMaidSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
