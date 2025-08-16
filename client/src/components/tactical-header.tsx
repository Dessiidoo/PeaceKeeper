import { Shield, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Officer } from "@shared/schema";

interface TacticalHeaderProps {
  officer?: Officer;
  isConnected: boolean;
  onEmergencyAlert: () => void;
}

export default function TacticalHeader({ officer, isConnected, onEmergencyAlert }: TacticalHeaderProps) {
  return (
    <header className="bg-tactical-navy border-b border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="text-tactical-blue h-8 w-8" data-testid="icon-logo" />
            <h1 className="text-2xl font-bold" data-testid="text-title">ARMOR</h1>
            <span className="text-sm text-gray-300" data-testid="text-subtitle">AI Tactical Response</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div 
              className={`w-3 h-3 rounded-full animate-pulse ${
                isConnected ? 'bg-safety-green' : 'bg-danger-red'
              }`}
              data-testid="indicator-connection"
            />
            <span className="text-sm" data-testid="text-connection-status">
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-300" data-testid="text-officer-label">Officer</div>
            <div className="font-semibold" data-testid="text-officer-badge">
              {officer ? `Badge #${officer.badge}` : 'Loading...'}
            </div>
          </div>
          
          <Button 
            className="tactical-button-danger px-4 py-2 rounded-lg font-semibold"
            onClick={onEmergencyAlert}
            data-testid="button-emergency"
          >
            <TriangleAlert className="mr-2 h-4 w-4" />
            EMERGENCY
          </Button>
        </div>
      </div>
    </header>
  );
}
