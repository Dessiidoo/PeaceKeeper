import { TriangleAlert, Info, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Alert, EmergencyService } from "@shared/schema";

interface AlertsPanelProps {
  alerts: Alert[];
  emergencyServices: EmergencyService[];
  onVoiceControl: () => void;
}

export default function AlertsPanel({ alerts, emergencyServices, onVoiceControl }: AlertsPanelProps) {
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000 / 60);
    return `${diff} min ago`;
  };

  const getAlertIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return <TriangleAlert className="text-danger-red h-4 w-4" />;
      default:
        return <Info className="text-warning-amber h-4 w-4" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'bg-danger-red bg-opacity-20 border-danger-red';
      case 'medium':
        return 'bg-warning-amber bg-opacity-20 border-warning-amber';
      default:
        return 'bg-tactical-blue bg-opacity-20 border-tactical-blue';
    }
  };

  const getAlertTextColor = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'text-danger-red';
      case 'medium':
        return 'text-warning-amber';
      default:
        return 'text-tactical-blue';
    }
  };

  return (
    <aside className="w-64 tactical-surface border-l flex flex-col">
      {/* Real-time Alerts */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold mb-3 text-tactical-blue" data-testid="text-alerts-title">
          REAL-TIME ALERTS
        </h3>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-gray-400 text-sm" data-testid="text-no-alerts">
              No active alerts
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border p-3 rounded-lg ${getAlertColor(alert.priority)}`}
                data-testid={`card-alert-${alert.id}`}
              >
                <div className="flex items-start">
                  {getAlertIcon(alert.priority)}
                  <div className="ml-2">
                    <div 
                      className={`font-medium ${getAlertTextColor(alert.priority)}`}
                      data-testid={`text-alert-type-${alert.id}`}
                    >
                      {alert.type}
                    </div>
                    <div className="text-sm" data-testid={`text-alert-message-${alert.id}`}>
                      {alert.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1" data-testid={`text-alert-time-${alert.id}`}>
                      {formatTimeAgo(alert.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold mb-3 text-tactical-blue" data-testid="text-ai-insights">
          AI INSIGHTS
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="font-medium mb-2" data-testid="text-prediction-title">
              Predicted Outcome
            </div>
            <div className="text-sm text-gray-300 mb-2" data-testid="text-prediction-description">
              Current trajectory analysis suggests 87% probability of safe resolution using Route Alpha.
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-safety-green h-2 rounded-full" 
                style={{ width: '87%' }}
                data-testid="progress-prediction-probability"
              />
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="font-medium mb-2" data-testid="text-traffic-analysis">
              Traffic Analysis
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-400">Density</div>
                <div className="font-semibold text-warning-amber" data-testid="text-traffic-density">
                  MODERATE
                </div>
              </div>
              <div>
                <div className="text-gray-400">Flow Rate</div>
                <div className="font-semibold text-safety-green" data-testid="text-traffic-flow">
                  GOOD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Control */}
      <div className="p-4 flex-1">
        <h3 className="font-semibold mb-3 text-tactical-blue" data-testid="text-voice-commands">
          VOICE COMMANDS
        </h3>
        <div className="space-y-2">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium" data-testid="text-voice-control-status">Voice Control</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-safety-green rounded-full mr-2 animate-pulse" />
                <span className="text-sm" data-testid="text-voice-status">ACTIVE</span>
              </div>
            </div>
            <Button 
              className="w-full tactical-button-primary p-3 rounded-lg transition-colors"
              onClick={onVoiceControl}
              data-testid="button-voice-control"
            >
              <Mic className="mr-2 h-4 w-4" />
              TAP TO SPEAK
            </Button>
          </div>
          
          <div className="text-sm text-gray-400">
            <div className="mb-1 font-medium" data-testid="text-quick-commands">Quick Commands:</div>
            <div data-testid="text-command-1">"Execute safe route"</div>
            <div data-testid="text-command-2">"Request backup"</div>
            <div data-testid="text-command-3">"Show alternatives"</div>
            <div data-testid="text-command-4">"Emergency alert"</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
