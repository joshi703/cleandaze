import { 
  users, type User, type InsertUser, 
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry, 
  maids, type Maid, type InsertMaid, 
  bookings, type Booking, type InsertBooking,
  companySettings, type CompanySettings, type InsertCompanySettings
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Waitlist methods
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  
  // Maid methods
  getMaids(): Promise<Maid[]>;
  getMaidsByCity(city: string): Promise<Maid[]>;
  getMaidsByLocality(locality: string): Promise<Maid[]>;
  getMaidById(id: number): Promise<Maid | undefined>;
  getMaidByEmail(email: string): Promise<Maid | undefined>;
  createMaid(maid: InsertMaid): Promise<Maid>;
  updateMaidAvailability(id: number, isAvailable: boolean): Promise<Maid | undefined>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  getBookingsByMaidId(maidId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Company settings methods
  getCompanySettings(): Promise<CompanySettings | undefined>;
  createOrUpdateCompanySettings(settings: InsertCompanySettings): Promise<CompanySettings>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlist: Map<number, WaitlistEntry>;
  private maids: Map<number, Maid>;
  private bookings: Map<number, Booking>;
  private companySettings: CompanySettings | undefined;
  
  currentUserId: number;
  currentWaitlistId: number;
  currentMaidId: number;
  currentBookingId: number;
  sessionStore: session.Store; // Express session store

  constructor() {
    this.users = new Map();
    this.waitlist = new Map();
    this.maids = new Map();
    this.bookings = new Map();
    this.currentUserId = 1;
    this.currentWaitlistId = 1;
    this.currentMaidId = 1;
    this.currentBookingId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample data
    this.initializeSampleMaids();
    // Initialize admin user and company settings
    this.initialize();
  }
  
  // We need to use async initialization separately
  private async initialize() {
    await this.initializeAdminUser();
    await this.initializeCompanySettings();
  }
  
  private async initializeAdminUser() {
    // Check if admin user already exists
    const existingAdmin = await this.getUserByUsername("admin");
    if (!existingAdmin) {
      // Import the hashPassword function from auth.ts
      const { scrypt, randomBytes } = await import("crypto");
      const { promisify } = await import("util");
      
      const scryptAsync = promisify(scrypt);
      
      // Simple password hashing function for initialization
      const hashPassword = async (password: string) => {
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString("hex")}.${salt}`;
      };
      
      // Create admin user with hashed password
      await this.createUser({
        username: "admin",
        password: await hashPassword("admin123"),
        email: "admin@maideasy.com",
        name: "Admin User",
        role: "admin"
      } as InsertUser);
    }
  }

  private async initializeCompanySettings() {
    const settings = await this.getCompanySettings();
    if (!settings) {
      await this.createOrUpdateCompanySettings({
        companyName: "MaidEasy",
        contactEmail: "contact@maideasy.com",
        contactPhone: "+91 9876543210",
        address: "123 Main Street, Mumbai, India",
        logo: "/logo.png",
        servicesOffered: ["Cleaning", "Cooking", "Child Care", "Elderly Care", "Laundry", "Pet Care"],
        operatingHours: "Monday to Saturday, 8:00 AM to 8:00 PM"
      } as InsertCompanySettings);
    }
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
      this.maids.set(id, { ...maid, id, isAvailable: true });
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date().toISOString();
    const role = insertUser.role ?? "customer";
    const user: User = { ...insertUser, id, createdAt, role };
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
      joinedAt,
      isAvailable: true
    };
    
    this.maids.set(id, maid);
    return maid;
  }
  
  async updateMaidAvailability(id: number, isAvailable: boolean): Promise<Maid | undefined> {
    const maid = await this.getMaidById(id);
    if (maid) {
      const updatedMaid = { ...maid, isAvailable };
      this.maids.set(id, updatedMaid);
      return updatedMaid;
    }
    return undefined;
  }
  
  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async getBookingsByMaidId(maidId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.maidId === maidId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const createdAt = new Date().toISOString();
    const status = "pending";
    const notes = insertBooking.notes ?? null;
    
    const booking: Booking = {
      ...insertBooking,
      notes,
      id,
      status,
      createdAt
    };
    
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = await this.getBookingById(id);
    if (booking) {
      const updatedBooking = { ...booking, status };
      this.bookings.set(id, updatedBooking);
      return updatedBooking;
    }
    return undefined;
  }
  
  // Company settings methods
  async getCompanySettings(): Promise<CompanySettings | undefined> {
    return this.companySettings;
  }

  async createOrUpdateCompanySettings(insertSettings: InsertCompanySettings): Promise<CompanySettings> {
    const updatedAt = new Date().toISOString();
    
    // Handle optional fields with null defaults
    const logo = insertSettings.logo ?? null;
    const servicesOffered = insertSettings.servicesOffered ?? null;
    const operatingHours = insertSettings.operatingHours ?? null;
    
    if (this.companySettings) {
      this.companySettings = {
        ...this.companySettings,
        ...insertSettings,
        logo,
        servicesOffered,
        operatingHours,
        updatedAt
      };
    } else {
      this.companySettings = {
        ...insertSettings,
        logo,
        servicesOffered,
        operatingHours,
        id: 1,
        updatedAt
      };
    }
    
    return this.companySettings!;
  }
}

export const storage = new MemStorage();
