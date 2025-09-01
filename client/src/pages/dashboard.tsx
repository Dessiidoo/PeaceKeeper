import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import TacticalHeader from "@/components/tactical-header";
import MissionSidebar from "@/components/mission-sidebar";
import TacticalMap from "@/components/tactical-map";
import AlertsPanel from "@/components/alerts-panel";
import EmergencyModal from "@/components/emergency-modal";
import { useWebSocket } from "@/hooks/use-websocket";
import type { Officer, Route, Alert, EmergencyService } from "@shared/schema";

export default function Dashboard() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [missionTime, setMissionTime] = useState(154); // seconds
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const { isConnected, lastMessage, sendMessage } = useWebSocket();

  // Fetch officer data
  const { data: officer } = useQuery<Officer>({
    queryKey: ["/api/officer/4127"],
  });

  // Fetch routes
  const { data: routes = [] } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  // Fetch alerts
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  // Fetch emergency services
  const { data: emergencyServices = [] } = useQuery<EmergencyService[]>({
    queryKey: ["/api/emergency-services"],
  });

  // Update mission timer
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'new_alert':
          // Refetch alerts when new alert is received
          queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
          break;
        case 'emergency_alert':
          // Show emergency notification
          console.log('Emergency alert received:', lastMessage.data);
          break;
      }
    }
  }, [lastMessage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmergencyAlert = () => {
    setShowEmergencyModal(true);
  };

  const handleConfirmEmergency = () => {
    sendMessage({
      type: 'emergency_alert',
      data: {
        officerId: officer?.id,
        location: 'Current location',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      }
    });
    setShowEmergencyModal(false);
  };

  const handleExecuteRoute = (routeId: string) => {
    setSelectedRoute(routeId);
    sendMessage({
      type: 'route_selected',
      data: { routeId }
    });
  };

  const threatLevel = alerts.some(alert => alert.priority === 'critical') ? 'HIGH' : 
                     alerts.some(alert => alert.priority === 'high') ? 'MEDIUM' : 'LOW';


    <return (
  <div className="h-[100svh] max-h-[100svh] overflow-y-auto bg-darker-surface text-white font-tactical">
      <TacticalHeader
        officer={officer}
        isConnected={isConnected}
        onEmergencyAlert={handleEmergencyAlert}
      />
      
      <div className="flex h-[calc(100vh-64px)]">
        <MissionSidebar
          threatLevel={threatLevel}
          responseTime={formatTime(missionTime)}
          routes={routes}
          emergencyServices={emergencyServices}
          selectedRoute={selectedRoute}
          onRouteSelect={handleExecuteRoute}
        />
        
        <TacticalMap
          routes={routes}
          alerts={alerts}
          selectedRoute={selectedRoute}
          onRouteSelect={handleExecuteRoute}
          onVoiceGuidance={() => console.log('Voice guidance activated')}
          onRequestBackup={() => console.log('Backup requested')}
          onIncidentLog={() => console.log('Incident log opened')}
        />
        
        <AlertsPanel
          alerts={alerts}
          emergencyServices={emergencyServices}
          onVoiceControl={() => console.log('Voice control activated')}
        />
      </div>

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        onConfirm={handleConfirmEmergency}
      />
    </div>
  );
}
