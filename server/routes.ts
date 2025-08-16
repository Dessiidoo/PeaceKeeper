import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertAlertSchema, insertIncidentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API Routes
  app.get("/api/officer/:badge", async (req, res) => {
    try {
      const officer = await storage.getOfficerByBadge(req.params.badge);
      if (!officer) {
        return res.status(404).json({ message: "Officer not found" });
      }
      res.json(officer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch officer" });
    }
  });

  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });

  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'new_alert',
            data: alert
          }));
        }
      });
      
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ message: "Failed to create alert" });
    }
  });

  app.get("/api/incidents", async (req, res) => {
    try {
      const incidents = await storage.getIncidents();
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const validatedData = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(validatedData);
      res.status(201).json(incident);
    } catch (error) {
      res.status(400).json({ message: "Failed to create incident" });
    }
  });

  app.get("/api/emergency-services", async (req, res) => {
    try {
      const services = await storage.getEmergencyServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emergency services" });
    }
  });

  app.post("/api/emergency-alert", async (req, res) => {
    try {
      const { officerId, location, message } = req.body;
      
      // Create emergency alert
      const alert = await storage.createAlert({
        type: "EMERGENCY",
        priority: "critical",
        message: message || "Officer requires immediate assistance",
        location: location || "Unknown location",
        coordinates: req.body.coordinates
      });

      // Broadcast emergency alert to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'emergency_alert',
            data: alert
          }));
        }
      });
      
      res.status(201).json({ message: "Emergency alert sent", alert });
    } catch (error) {
      res.status(500).json({ message: "Failed to send emergency alert" });
    }
  });

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'WebSocket connection established'
    }));

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'location_update':
            // Broadcast location update to all clients
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'location_update',
                  data: data.data
                }));
              }
            });
            break;
            
          case 'route_request':
            // Handle route calculation request
            const routes = await storage.getRoutes();
            ws.send(JSON.stringify({
              type: 'route_response',
              data: routes
            }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Simulate real-time updates every 30 seconds
  setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'status_update',
          data: {
            timestamp: new Date().toISOString(),
            systemStatus: 'operational',
            activeUnits: Math.floor(Math.random() * 5) + 3
          }
        }));
      }
    });
  }, 30000);

  return httpServer;
}
