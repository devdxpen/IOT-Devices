"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoSearchOutline } from "react-icons/io5";

export function SendAccessRequestForm() {
  const [deviceId, setDeviceId] = useState("");
  const [deviceFound, setDeviceFound] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Mock checking if device exists
  const handleSearchDevice = () => {
    if (deviceId.trim().length > 3) {
      setDeviceFound(true);
      setRequestSent(false); // Reset sent state if searching again
    }
  };

  const handleSendRequest = () => {
    // In a real app, this would dispatch an API call
    setRequestSent(true);
  };

  const handleReset = () => {
    setDeviceId("");
    setDeviceFound(false);
    setRequestSent(false);
  };

  return (
    <div className="max-w-xl w-full bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-800">Request Device Access</h3>
        <p className="text-sm text-slate-500">
          Enter a specific Device ID to send an access request to its owner.
        </p>
      </div>

      <div className="space-y-6">
        {/* Device Search */}
        <div className="space-y-2">
          <Label htmlFor="deviceId" className="text-slate-700 font-medium">Device ID *</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                id="deviceId" 
                placeholder="Ex: DEV-827364" 
                className="pl-10 uppercase" 
                value={deviceId}
                onChange={(e) => {
                  setDeviceId(e.target.value);
                  setDeviceFound(false);
                  setRequestSent(false);
                }}
                disabled={requestSent}
              />
            </div>
            <Button 
              className="bg-primary text-white hover:bg-primary/90" 
              onClick={handleSearchDevice}
              disabled={!deviceId.trim() || requestSent}
            >
              Search
            </Button>
          </div>
          
          {deviceFound && !requestSent && (
            <p className="text-sm text-green-600 font-medium mt-2">
              ✓ Device found. You can now send an access request.
            </p>
          )}

          {requestSent && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium text-center">
                Access request successfully sent to the device owner!
              </p>
              <p className="text-xs text-green-600 text-center mt-1">
                You will be notified once they configure your role and accept your request.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button variant="outline" onClick={handleReset}>
            {requestSent ? "Send Another Request" : "Reset"}
          </Button>
          <Button 
            className="bg-primary text-white hover:bg-primary/90"
            disabled={!deviceFound || requestSent}
            onClick={handleSendRequest}
          >
            Send Request
          </Button>
        </div>
      </div>
    </div>
  );
}
