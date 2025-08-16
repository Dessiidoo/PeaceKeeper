import { Car, Flame, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Route, EmergencyService } from "@shared/schema";

interface MissionSidebarProps {
  threatLevel: string;
  responseTime: string;
  routes: Route[];
  emergencyServices: EmergencyService[];
  selectedRoute: string | null;
  onRouteSelect: (routeId: string) => void;
}

export default function MissionSidebar({ 
  threatLevel, 
  responseTime, 
  routes,
  emergencyServices,
  selectedRoute,
  onRouteSelect 
}: MissionSidebarProps) {
  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-danger-red text-black';
      case 'MEDIUM': return 'bg-warning-amber text-black';
      case 'LOW': return 'bg-safety-green text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return 'bg-safety-green';
    if (score >= 50) return 'bg-warning-amber';
    return 'bg-danger-red';
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'fire': return <Flame className="text-orange-500 h-5 w-5" />;
      case 'ems': return <Ambulance className="text-red-500 h-5 w-5" />;
      case 'police': return <Car className="text-tactical-blue h-5 w-5" />;
      default: return <Car className="text-tactical-blue h-5 w-5" />;
    }
  };

  return (
    <aside className="w-64 tactical-surface border-r flex flex-col">
      {/* Mission Status */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold mb-3 text-tactical-blue" data-testid="text-mission-status">
          MISSION STATUS
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span data-testid="text-threat-level-label">Threat Level</span>
            <span 
              className={`px-2 py-1 rounded text-sm font-bold ${getThreatLevelColor(threatLevel)}`}
              data-testid="text-threat-level"
            >
              {threatLevel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span data-testid="text-ai-systems-label">AI Systems</span>
            <span className="text-safety-green font-semibold" data-testid="text-ai-systems">
              3 ACTIVE
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span data-testid="text-response-time-label">Response Time</span>
            <span className="text-white font-mono" data-testid="text-response-time">
              {responseTime}
            </span>
          </div>
        </div>
      </div>

      {/* AI Assessment */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold mb-3 text-tactical-blue" data-testid="text-ai-assessment">
          AI SAFETY ASSESSMENT
        </h3>
        <div className="space-y-3">
          {routes.map((route) => (
            <div 
              key={route.id} 
              className={`bg-gray-800 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedRoute === route.id ? 'border-2 border-tactical-blue' : 'hover:bg-gray-700'
              }`}
              onClick={() => onRouteSelect(route.id)}
              data-testid={`card-route-${route.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium" data-testid={`text-route-name-${route.id}`}>
                  {route.name}
                </span>
                <div className="flex items-center">
                  <div 
                    className={`w-4 h-4 rounded mr-2 ${getSafetyScoreColor(route.safetyScore)}`}
                    data-testid={`indicator-safety-${route.id}`}
                  />
                  <span className="text-sm font-bold" data-testid={`text-safety-score-${route.id}`}>
                    {route.safetyScore}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-300" data-testid={`text-route-description-${route.id}`}>
                {route.description}
              </div>
              <div className="text-xs text-gray-400 mt-1" data-testid={`text-route-risks-${route.id}`}>
                {route.riskFactors}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Services */}
      <div className="p-4 flex-1">
        <h3 className="font-semibold mb-3 text-tactical-blue" data-testid="text-emergency-coordination">
          EMERGENCY COORDINATION
        </h3>
        <div className="space-y-2">
          {emergencyServices.map((service) => (
            <Button
              key={service.id}
              variant="ghost"
              className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-left transition-colors justify-start"
              data-testid={`button-emergency-service-${service.id}`}
            >
              <div className="flex items-center">
                {getServiceIcon(service.type)}
                <div className="ml-3">
                  <div className="font-medium" data-testid={`text-service-name-${service.id}`}>
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-300" data-testid={`text-service-location-${service.id}`}>
                    {service.location} - {service.distance}mi
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}
