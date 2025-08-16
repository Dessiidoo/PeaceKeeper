import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EmergencyModal({ isOpen, onClose, onConfirm }: EmergencyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="tactical-surface border-danger-red max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TriangleAlert className="text-danger-red h-12 w-12" data-testid="icon-emergency-warning" />
          </div>
          <DialogTitle className="text-xl font-bold" data-testid="text-emergency-title">
            EMERGENCY ALERT
          </DialogTitle>
          <DialogDescription className="text-gray-300" data-testid="text-emergency-description">
            This will broadcast an emergency signal to all units and dispatch. Continue?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex space-x-4 mt-6">
          <Button
            variant="secondary"
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition-colors"
            onClick={onClose}
            data-testid="button-cancel-emergency"
          >
            CANCEL
          </Button>
          <Button
            className="flex-1 tactical-button-danger py-3 rounded-lg font-semibold"
            onClick={onConfirm}
            data-testid="button-confirm-emergency"
          >
            CONFIRM
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
