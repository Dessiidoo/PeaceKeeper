import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

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
      setMissionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;
    switch (lastMessage.type) {
      case "new_alert":
        queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
        break;
      case "emergency_alert":
        console.log("Emergency alert received:", lastMessage.data);
        setShowEmergencyModal(true);
        break;
    }
  }, [lastMessage, queryClient]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleExecuteRoute = (routeId: string) => {
    setSelectedRoute(routeId);
    sendMessage({ type: "route_selected", data: { routeId } });
  };

  return (
    <div className="h-[100svh] max-h-[100svh] overflow-y-auto bg-darker-surface text-white font-tactical">
      <TacticalHeader
        officer={officer}
        isConnected={isConnected}
        onEmergencyAlert={() => setShowEmergencyModal(true)}
      />

      <div className="flex h-[calc(100vh-64px)]">
        <MissionSidebar
          threatLevel={
            alerts.some((a) => a.priority === "critical")
              ? "HIGH"
              : alerts.some((a) => a.priority === "high")
              ? "MEDIUM"
              : "LOW"
          }
          responseTime={formatTime(missionTime)}
          emergencyServices={emergencyServices}
          selectedRoute={selectedRoute}
          onRouteSelect={handleExecuteRoute}
        />

        <TacticalMap
          routes={routes}
          alerts={alerts}
          selectedRoute={selectedRoute}
          onRouteSelect={handleExecuteRoute}
          onVoiceGuidance={() => console.log("Voice guidance activated")}
          onRequestBackup={() => console.log("Backup requested")}
          onIncidentLog={() => console.log("Incident log opened")}
        />

        <AlertsPanel
          alerts={alerts}
          emergencyServices={emergencyServices}
          onVoiceControl={() => console.log("Voice control activated")}
        />
      </div>

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        onConfirm={() => {
          sendMessage({
            type: "emergency_alert",
            data: { officerId: officer?.id, location: "Current location" },
          });
          setShowEmergencyModal(false);
        }}
      />
    </div>
  );
}
