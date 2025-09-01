import { Plus, Minus, Crosshair, Route, Mic, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Route as RouteType, Alert } from "@shared/schema";

interface TacticalMapProps {
  routes: RouteType[];
  alerts: Alert[];
  selectedRoute: string | null;
  onRouteSelect: (routeId: string) => void;
  onVoiceGuidance: () => void;
  onRequestBackup: () => void;
  onIncidentLog: () => void;
}

export default function TacticalMap({ 
  routes, 
  alerts, 
  selectedRoute, 
  onRouteSelect,
  onVoiceGuidance,
  onRequestBackup,
  onIncidentLog 
}: TacticalMapProps) {
  const handleExecuteRecommendedRoute = () => {
    // Find the route with highest safety score
    const bestRoute = routes.reduce((best, current) => 
      current.safetyScore > best.safetyScore ? current : best
    );
    onRouteSelect(bestRoute.id);
  };

  return (
    <main className="flex-1 flex flex-col">
      
      <div className="flex-1 relative bg-gray-900">
        
        <div
  className="w-full h-[50vh] bg-cover bg-center relative"
  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000')" }}
  data-testid="container-map"
/>
          data-testid="container-map"
        
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          {/* Map Overlay Controls */}
          <div className="absolute top-4 left-4 space-y-2">
            <Button 
              size="icon"
              className="tactical-surface bg-opacity-90 hover:bg-opacity-100 p-3 rounded-lg transition-all"
              data-testid="button-zoom-in"
            >
              <Plus className="h-4 w-4 text-white" />
            </Button>
            <Button 
              size="icon"
              className="tactical-surface bg-opacity-90 hover:bg-opacity-100 p-3 rounded-lg transition-all"
              data-testid="button-zoom-out"
            >
              <Minus className="h-4 w-4 text-white" />
            </Button>
            <Button 
              size="icon"
              className="tactical-surface bg-opacity-90 hover:bg-opacity-100 p-3 rounded-lg transition-all"
              data-testid="button-center-location"
            >
              <Crosshair className="h-4 w-4 text-white" />
            </Button>
          </div>

          {/* Route Indicators */}
          <div 
            className="absolute top-1/3 left-1/3 w-4 h-4 bg-safety-green rounded-full border-2 border-white shadow-lg"
            data-testid="marker-route-start"
          />
          <div 
            className="absolute top-1/2 right-1/3 w-4 h-4 bg-warning-amber rounded-full border-2 border-white shadow-lg"
            data-testid="marker-route-waypoint"
          />
          <div 
            className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-danger-red rounded-full border-2 border-white shadow-lg"
            data-testid="marker-threat-location"
          />

          {/* Current Location Indicator */}
          <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div 
              className="w-6 h-6 bg-tactical-blue rounded-full border-4 border-white shadow-xl animate-pulse"
              data-testid="marker-current-position"
            />
          </div>

          
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                alert.priority === 'critical' ? 'bg-danger-red animate-pulse' :
                alert.priority === 'high' ? 'bg-danger-red' :
                'bg-warning-amber'
            `}
              style={{
  top: `}30 + index * 10{%`,
  left `}40 + index * 1{%`
}}
data-testid={`marker-alert-${alert.id}`}
/>
          ))}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 tactical-surface bg-opacity-95 p-4 rounded-lg">
          <h4 className="font-semibold mb-2" data-testid="text-legend-title">LEGEND</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-tactical-blue rounded-full mr-2" />
              <span data-testid="text-legend-current">Current Position</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-safety-green rounded-full mr-2" />
              <span data-testid="text-legend-safe">Safe Route</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-warning-amber rounded-full mr-2" />
              <span data-testid="text-legend-caution">Caution Zone</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-danger-red rounded-full mr-2" />
              <span data-testid="text-legend-risk">High Risk Area</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tactical Control Panel */}
      <div className="tactical-surface border-t p-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            className="tactical-button-success p-3 rounded-lg font-bold"
            onClick={handleExecuteRecommendedRoute}
            data-testid="button-execute-safe-route"
          >
            <Route className="mb-2 h-6 w-6" />
            EXECUTE SAFE ROUTE
          </Button>
          
          <Button
            className="tactical-button-primary p-3 rounded-lg font-bold"
            onClick={onVoiceGuidance}
            data-testid="button-voice-guidance"
          >
            <Mic className="mb-2 h-6 w-6" />
            VOICE GUIDANCE
          </Button>
          
          <Button
            className="tactical-button-warning p-3 rounded-lg font-bold"
            onClick={onRequestBackup}
            data-testid="button-request-backup"
          >
            <Users className="mb-2 h-6 w-6" />
            REQUEST BACKUP
          </Button>
          
          <Button
            variant="secondary"
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg font-bold transition-colors"
            onClick={onIncidentLog}
            data-testid="button-incident-log"
          >
            <ClipboardList className="mb-2 h-6 w-6" />
            INCIDENT LOG
          </Button>
        </div>
      </div>
    </main>
  );
}
