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
    
    // Initialize with sample maids data
    this.initializeSampleMaids();
  }
  
  private initializeSampleMaids() {
    const sampleMaids = [
      {
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "9876543210",
        city: "Mumbai",
        locality: "Andheri",
        address: "123 Main Street, Andheri East",
        experience: "5 years",
        services: ["Cleaning", "Cooking", "Child Care"],
        joinedAt: "2023-01-15T08:30:00.000Z",
      },
      {
        name: "Anjali Patel",
        email: "anjali.patel@example.com",
        phone: "8765432109",
        city: "Mumbai",
        locality: "Bandra",
        address: "45 Park Avenue, Bandra West",
        experience: "3 years",
        services: ["Cleaning", "Laundry"],
        joinedAt: "2023-03-10T10:15:00.000Z",
      },
      {
        name: "Lakshmi Reddy",
        email: "lakshmi.reddy@example.com",
        phone: "7654321098",
        city: "Bangalore",
        locality: "Indiranagar",
        address: "78 Green View, Indiranagar",
        experience: "7 years",
        services: ["Cooking", "Cleaning", "Elder Care"],
        joinedAt: "2022-11-05T09:45:00.000Z",
      },
      {
        name: "Meena Kumari",
        email: "meena.kumari@example.com",
        phone: "6543210987",
        city: "Delhi",
        locality: "Saket",
        address: "25 Ring Road, Saket",
        experience: "4 years",
        services: ["Cooking", "Child Care"],
        joinedAt: "2023-02-22T14:30:00.000Z",
      },
      {
        name: "Sunita Devi",
        email: "sunita.devi@example.com",
        phone: "5432109876",
        city: "Delhi",
        locality: "Connaught Place",
        address: "10 Central Lane, Connaught Place",
        experience: "6 years",
        services: ["Cleaning", "Laundry", "Cooking"],
        joinedAt: "2022-12-18T11:20:00.000Z",
      },
      {
        name: "Rekha Mishra",
        email: "rekha.mishra@example.com",
        phone: "4321098765",
        city: "Kolkata",
        locality: "Salt Lake",
        address: "55 Lake View, Salt Lake",
        experience: "8 years",
        services: ["Cleaning", "Cooking", "Elder Care", "Child Care"],
        joinedAt: "2022-10-30T07:55:00.000Z",
      },
      {
        name: "Geeta Singh",
        email: "geeta.singh@example.com",
        phone: "3210987654",
        city: "Chennai",
        locality: "Adyar",
        address: "32 Beach Road, Adyar",
        experience: "2 years",
        services: ["Cleaning"],
        joinedAt: "2023-04-05T15:40:00.000Z",
      },
      {
        name: "Kavita Joshi",
        email: "kavita.joshi@example.com",
        phone: "2109876543",
        city: "Hyderabad",
        locality: "Banjara Hills",
        address: "89 Hill View, Banjara Hills",
        experience: "5 years",
        services: ["Cooking", "Child Care"],
        joinedAt: "2023-01-28T12:10:00.000Z",
      },
      {
        name: "Deepa Gupta",
        email: "deepa.gupta@example.com",
        phone: "1098765432",
        city: "Pune",
        locality: "Koregaon Park",
        address: "12 River Road, Koregaon Park",
        experience: "4 years",
        services: ["Cleaning", "Laundry", "Cooking"],
        joinedAt: "2023-02-14T13:25:00.000Z",
      },
      {
        name: "Asha Verma",
        email: "asha.verma@example.com",
        phone: "0987654321",
        city: "Jaipur",
        locality: "Malviya Nagar",
        address: "67 Pink City, Malviya Nagar",
        experience: "3 years",
        services: ["Cleaning", "Elder Care"],
        joinedAt: "2023-03-20T16:15:00.000Z",
      }
    ];
    
    // Add each sample maid to the storage
    sampleMaids.forEach((maid) => {
      const id = this.currentMaidId++;
      this.maids.set(id, { ...maid, id });
    });
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
    
    // Set default values for optional fields
    const address = insertMaid.address ?? null;
    const experience = insertMaid.experience ?? null;
    const services = insertMaid.services ?? [];
    
    // Create the maid object with all fields properly typed
    const maid: Maid = {
      id,
      name: insertMaid.name,
      email: insertMaid.email,
      phone: insertMaid.phone,
      city: insertMaid.city,
      locality: insertMaid.locality,
      address,
      experience,
      services,
      joinedAt
    };
    
    this.maids.set(id, maid);
    return maid;
  }
}

export const storage = new MemStorage();
