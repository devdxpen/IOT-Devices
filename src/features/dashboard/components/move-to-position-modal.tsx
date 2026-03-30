import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { Device } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MoveToPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  totalItems: number;
  onMove: (
    deviceId: string,
    targetPosition: number,
    colorFlag: "red" | "yellow" | "green" | "none",
  ) => Promise<void>;
}

export function MoveToPositionModal({
  isOpen,
  onClose,
  device,
  totalItems,
  onMove,
}: MoveToPositionModalProps) {
  const [positionInput, setPositionInput] = useState<string>("");
  const [flagInput, setFlagInput] = useState<
    "red" | "yellow" | "green" | "none"
  >("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Device["colorFlag"] | null>(null);

  // Initialize input when modal opens with the device's current values
  useEffect(() => {
    if (isOpen && device) {
      setPositionInput(String(device.position || 1));
      setFlagInput(device.colorFlag || 'none');
      setError(null);
    }
  }, [isOpen, device]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!device) return;

    const newPos = parseInt(positionInput, 10);

    if (isNaN(newPos) || newPos < 1 || newPos > totalItems) {
      setError(`Please enter a valid position between 1 and ${totalItems}`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onMove(device.id, newPos, flagInput);
      onClose();
      // reset is handled softly by component unmount or next open
      setPositionInput("");
    } catch (err) {
      setError("Failed to move device.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPositionInput("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Move to Position</ModalTitle>
          <ModalDescription>
            Change the explicit list order for {device?.name}
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label
              htmlFor="position"
              className="text-sm font-medium text-neutral-700"
            >
              Target Position (1 - {totalItems})
            </Label>
            <Input
              id="position"
              type="number"
              min={1}
              max={totalItems}
              value={positionInput}
              onChange={(e) => {
                setPositionInput(e.target.value);
                setError(null);
              }}
              placeholder={`Enter position up to ${totalItems}`}
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-sm font-medium text-neutral-700">
              Priority Flag
            </Label>
            <div className="flex items-center gap-3">
              {[
                {
                  value: "red",
                  label: "High",
                  colorClass: "bg-red-500",
                  borderClass: "border-red-600",
                },
                {
                  value: "yellow",
                  label: "Medium",
                  colorClass: "bg-yellow-500",
                  borderClass: "border-yellow-600",
                },
                {
                  value: "green",
                  label: "Normal",
                  colorClass: "bg-green-500",
                  borderClass: "border-green-600",
                },
                {
                  value: "none",
                  label: "None",
                  colorClass: "bg-neutral-200",
                  borderClass: "border-neutral-300",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFlagInput(opt.value as any)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-md border transition-all ${
                    flagInput === opt.value
                      ? "bg-blue-50 border-blue-500 shadow-sm"
                      : "border-transparent hover:bg-neutral-50"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border ${opt.colorClass} ${opt.borderClass}`}
                  />
                  <span className="text-xs font-medium text-neutral-600">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Moving..." : "Move Device"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
