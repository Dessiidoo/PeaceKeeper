import { type Officer, type InsertOfficer, type Route, type InsertRoute, type Alert, type InsertAlert, type Incident, type InsertIncident, type EmergencyService, type InsertEmergencyService } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Officers
  getOfficer(id: string): Promise<Officer | undefined>;
  getOfficerByBadge(badge: string): Promise<Officer | undefined>;
  createOfficer(officer: InsertOfficer): Promise<Officer>;
  
  // Routes
  getRoutes(): Promise<Route[]>;
  getRoute(id: string): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  
  // Alerts
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  deactivateAlert(id: string): Promise<void>;
  
  // Incidents
  getIncidents(): Promise<Incident[]>;
  getIncident(id: string): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncidentStatus(id: string, status: string): Promise<void>;
  
  // Emergency Services
  getEmergencyServices(): Promise<EmergencyService[]>;
  getNearbyEmergencyServices(type: string): Promise<EmergencyService[]>;
  createEmergencyService(service: InsertEmergencyService): Promise<EmergencyService>;
}

export class MemStorage implements IStorage {
  private officers: Map<string, Officer>;
  private routes: Map<string, Route>;
  private alerts: Map<string, Alert>;
  private incidents: Map<string, Incident>;
  private emergencyServices: Map<string, EmergencyService>;

  constructor() {
    this.officers = new Map();
    this.routes = new Map();
    this.alerts = new Map();
    this.incidents = new Map();
    this.emergencyServices = new Map();
    this.initializeTestData();
  }

  private initializeTestData() {
    // Create test officer
    const officer: Officer = {
      id: randomUUID(),
      badge: "4127",
      name: "Officer Johnson",
      unit: "Unit 12",
      status: "active"
    };
    this.officers.set(officer.id, officer);

    // Create test routes
    const routes: Route[] = [
      {
        id: randomUUID(),
        name: "Route Alpha",
        description: "Main Street → Highway 101",
        safetyScore: 94,
        riskFactors: "Low traffic, clear weather",
        coordinates: [
          { lat: 40.7128, lng: -74.0060 },
          { lat: 40.7589, lng: -73.9851 }
        ],
        estimatedTime: 12,
        distance: 3.2,
        status: "available"
      },
      {
        id: randomUUID(),
        name: "Route Beta",
        description: "Downtown → Bridge",
        safetyScore: 67,
        riskFactors: "High pedestrian traffic",
        coordinates: [
          { lat: 40.7128, lng: -74.0060 },
          { lat: 40.7505, lng: -73.9934 }
        ],
        estimatedTime: 18,
        distance: 4.1,
        status: "available"
      },
      {
        id: randomUUID(),
        name: "Route Gamma",
        description: "School Zone → Mall",
        safetyScore: 23,
        riskFactors: "School hours, construction",
        coordinates: [
          { lat: 40.7128, lng: -74.0060 },
          { lat: 40.7831, lng: -73.9712 }
        ],
        estimatedTime: 25,
        distance: 5.8,
        status: "available"
      }
    ];

    routes.forEach(route => this.routes.set(route.id, route));

    // Create test alerts
    const alerts: Alert[] = [
      {
        id: randomUUID(),
        type: "HIGH PRIORITY",
        priority: "high",
        message: "Multiple vehicles reported ahead on Main St",
        location: "Main Street & 5th Ave",
        coordinates: { lat: 40.7489, lng: -73.9857 },
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isActive: true
      },
      {
        id: randomUUID(),
        type: "TRAFFIC UPDATE",
        priority: "medium",
        message: "School dismissal in progress - increased pedestrian activity",
        location: "Lincoln Elementary School",
        coordinates: { lat: 40.7614, lng: -73.9776 },
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isActive: true
      }
    ];

    alerts.forEach(alert => this.alerts.set(alert.id, alert));

    // Create test emergency services
    const services: EmergencyService[] = [
      {
        id: randomUUID(),
        type: "fire",
        name: "Fire Station 12",
        location: "Station 12 - Engine Company",
        coordinates: { lat: 40.7505, lng: -73.9934 },
        distance: 0.8,
        isAvailable: true
      },
      {
        id: randomUUID(),
        type: "ems",
        name: "EMS Unit 7",
        location: "Ambulance Unit 7",
        coordinates: { lat: 40.7831, lng: -73.9712 },
        distance: 1.2,
        isAvailable: true
      },
      {
        id: randomUUID(),
        type: "police",
        name: "Backup Units",
        location: "Police Precinct 15",
        coordinates: { lat: 40.7589, lng: -73.9851 },
        distance: 0.5,
        isAvailable: true
      }
    ];

    services.forEach(service => this.emergencyServices.set(service.id, service));
  }

  async getOfficer(id: string): Promise<Officer | undefined> {
    return this.officers.get(id);
  }

  async getOfficerByBadge(badge: string): Promise<Officer | undefined> {
    return Array.from(this.officers.values()).find(officer => officer.badge === badge);
  }

  async createOfficer(insertOfficer: InsertOfficer): Promise<Officer> {
    const id = randomUUID();
    const officer: Officer = { ...insertOfficer, id, status: "active" };
    this.officers.set(id, officer);
    return officer;
  }

  async getRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const route: Route = { ...insertRoute, id, status: "available" };
    this.routes.set(id, route);
    return route;
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(alert => alert.isActive);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { ...insertAlert, id, timestamp: new Date(), isActive: true };
    this.alerts.set(id, alert);
    return alert;
  }

  async deactivateAlert(id: string): Promise<void> {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.isActive = false;
      this.alerts.set(id, alert);
    }
  }

  async getIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values());
  }

  async getIncident(id: string): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = randomUUID();
    const incident: Incident = { ...insertIncident, id, timestamp: new Date(), status: "open" };
    this.incidents.set(id, incident);
    return incident;
  }

  async updateIncidentStatus(id: string, status: string): Promise<void> {
    const incident = this.incidents.get(id);
    if (incident) {
      incident.status = status;
      this.incidents.set(id, incident);
    }
  }

  async getEmergencyServices(): Promise<EmergencyService[]> {
    return Array.from(this.emergencyServices.values());
  }

  async getNearbyEmergencyServices(type: string): Promise<EmergencyService[]> {
    return Array.from(this.emergencyServices.values())
      .filter(service => service.type === type && service.isAvailable)
      .sort((a, b) => a.distance - b.distance);
  }

  async createEmergencyService(insertService: InsertEmergencyService): Promise<EmergencyService> {
    const id = randomUUID();
    const service: EmergencyService = { ...insertService, id, isAvailable: true };
    this.emergencyServices.set(id, service);
    return service;
  }
}

export const storage = new MemStorage();
