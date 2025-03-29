import { users, type User, type InsertUser, waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry, maids, type Maid, type InsertMaid } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getMaids(): Promise<Maid[]>;
  getMaidsByCity(city: string): Promise<Maid[]>;
  getMaidsByLocality(locality: string): Promise<Maid[]>;
  getMaidById(id: number): Promise<Maid | undefined>;
  getMaidByEmail(email: string): Promise<Maid | undefined>;
  createMaid(maid: InsertMaid): Promise<Maid>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlist: Map<number, WaitlistEntry>;
  private maids: Map<number, Maid>;
  currentUserId: number;
  currentWaitlistId: number;
  currentMaidId: number;

  constructor() {
    this.users = new Map();
    this.waitlist = new Map();
    this.maids = new Map();
    this.currentUserId = 1;
    this.currentWaitlistId = 1;
    this.currentMaidId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlist.values());
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    return Array.from(this.waitlist.values()).find(
      (entry) => entry.email === email,
    );
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.currentWaitlistId++;
    const joinedAt = new Date().toISOString();
    const company = insertEntry.company ?? null;
    const entry: WaitlistEntry = { ...insertEntry, company, id, joinedAt };
    this.waitlist.set(id, entry);
    return entry;
  }

  async getMaids(): Promise<Maid[]> {
    return Array.from(this.maids.values());
  }

  async getMaidsByCity(city: string): Promise<Maid[]> {
    return Array.from(this.maids.values()).filter(
      maid => maid.city.toLowerCase() === city.toLowerCase()
    );
  }

  async getMaidsByLocality(locality: string): Promise<Maid[]> {
    return Array.from(this.maids.values()).filter(
      maid => maid.locality.toLowerCase() === locality.toLowerCase()
    );
  }
  
  async getMaidById(id: number): Promise<Maid | undefined> {
    return this.maids.get(id);
  }

  async getMaidByEmail(email: string): Promise<Maid | undefined> {
    return Array.from(this.maids.values()).find(
      (maid) => maid.email === email,
    );
  }

  async createMaid(insertMaid: InsertMaid): Promise<Maid> {
    const id = this.currentMaidId++;
    const joinedAt = new Date().toISOString();
    
    // Create the maid object with all fields
    const maid: Maid = { 
      ...insertMaid, 
      id, 
      joinedAt
    };
    
    this.maids.set(id, maid);
    return maid;
  }
}

export const storage = new MemStorage();
