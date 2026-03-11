"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { getDeviceConfig, saveDeviceConfig } from "../api/deviceConfigApi";

// Basic Types
export type Alarm = {
  id: number;
  name: string;
  tag: string;
  valueLow: string;
  conditionLow: string;
  valueHigh: string;
  conditionHigh: string;
  type: string;
  isActive: boolean;
  maskTime?: string;
  notification?: string[];
};

export type DeviceTag = {
  id: number;
  tagNo: string;
  deviceId: string;
  functionCode: string;
  tagAddress: string;
  dataType: string;
  decimalPoint: string;
  noOfDigits: string;
  endian: string;
};

export type Parameter = {
  id: string;
  tagNo: string;
  tagName: string;
  reportName: string;
  offset: string;
  minData: string;
  maxData: string;
  unit: string;
  storage: boolean;
  showingData: boolean;
  reportingDetails: string;
};

export type ApiEndpoint = {
  id: string;
  endpointName: string;
  targetUrl: string;
  httpMethod: string;
  syncInterval: string;
  tags: string[];
  lastSyncTime: string;
  status: "active" | "paused";
};

// Main State Interface
export interface DeviceConfigState {
  id: string;
  general: {
    brand: string;
    model: string;
    serial: string;
    deviceName: string;
    mac: string;
    industry: string;
    category: string;
    cluster: string;
    group: string;
    description: string;
    isActive: boolean;
    templateId: string | null;
  };
  connection: {
    protocol: string;
    format: string;
    brokerUrl: string;
    port: string;
    authType: string;
  };
  tags: DeviceTag[];
  alarms: Alarm[];
  parameters: Parameter[];
  api: {
    triggerType: string;
    intervalSeconds: string;
    primaryProtocol: string;
    formats: string[];
    endpoints: ApiEndpoint[];
  };
}

interface DeviceConfigContextType {
  config: DeviceConfigState | null;
  isLoading: boolean;
  updateGeneral: (updates: Partial<DeviceConfigState["general"]>) => void;
  updateConnection: (updates: Partial<DeviceConfigState["connection"]>) => void;
  setTags: (tags: DeviceTag[]) => void;
  setAlarms: (alarms: Alarm[]) => void;
  setParameters: (params: Parameter[]) => void;
  updateApi: (updates: Partial<DeviceConfigState["api"]>) => void;
  setApiEndpoints: (endpoints: ApiEndpoint[]) => void;
  saveAll: () => Promise<void>;
  isSaving: boolean;
}

const DeviceConfigContext = createContext<DeviceConfigContextType | undefined>(
  undefined,
);

export function DeviceConfigProvider({
  children,
  deviceId,
}: {
  children: ReactNode;
  deviceId: string;
}) {
  const [config, setConfig] = useState<DeviceConfigState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getDeviceConfig(deviceId)
      .then((data) => {
        if (mounted) {
          setConfig(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load device config", err);
        toast.error("Failed to load device config");
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [deviceId]);

  const updateGeneral = (updates: Partial<DeviceConfigState["general"]>) => {
    setConfig((prev) =>
      prev ? { ...prev, general: { ...prev.general, ...updates } } : prev,
    );
  };

  const updateConnection = (
    updates: Partial<DeviceConfigState["connection"]>,
  ) => {
    setConfig((prev) =>
      prev ? { ...prev, connection: { ...prev.connection, ...updates } } : prev,
    );
  };

  const setTags = (tags: DeviceTag[]) => {
    setConfig((prev) => (prev ? { ...prev, tags } : prev));
  };

  const setAlarms = (alarms: Alarm[]) => {
    setConfig((prev) => (prev ? { ...prev, alarms } : prev));
  };

  const setParameters = (parameters: Parameter[]) => {
    setConfig((prev) => (prev ? { ...prev, parameters } : prev));
  };

  const updateApi = (updates: Partial<DeviceConfigState["api"]>) => {
    setConfig((prev) =>
      prev ? { ...prev, api: { ...prev.api, ...updates } } : prev,
    );
  };

  const setApiEndpoints = (endpoints: ApiEndpoint[]) => {
    setConfig((prev) =>
      prev ? { ...prev, api: { ...prev.api, endpoints } } : prev,
    );
  };

  const saveAll = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      await saveDeviceConfig(deviceId, config);
      toast.success("Device configuration saved to server!");
    } catch (error) {
      toast.error("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DeviceConfigContext.Provider
      value={{
        config,
        isLoading,
        updateGeneral,
        updateConnection,
        setTags,
        setAlarms,
        setParameters,
        updateApi,
        setApiEndpoints,
        saveAll,
        isSaving,
      }}
    >
      {children}
    </DeviceConfigContext.Provider>
  );
}

export function useDeviceConfig() {
  const context = useContext(DeviceConfigContext);
  if (context === undefined) {
    throw new Error(
      "useDeviceConfig must be used within a DeviceConfigProvider",
    );
  }
  return context;
}
