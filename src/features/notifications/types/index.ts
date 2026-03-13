export type NotificationPriority = "High" | "Medium" | "Low";
export type NotificationMethod = "SMS" | "Email" | "Push Notification";

export interface Notification {
  id: string;
  name: string;
  device: {
    id: string;
    name: string;
    type: string;
    image?: string;
  };
  userSettings: Array<{
    userId: string;
    methods: NotificationMethod[];
  }>;
  alarms: string[];
  status: boolean;
  priority: NotificationPriority;
  createdAt: string;
}

export interface NotificationFormData {
  name: string;
  deviceId: string;
  userSettings: Array<{
    userId: string;
    methods: NotificationMethod[];
  }>;
  alarmIds: string[];
  priority: NotificationPriority;
  status: boolean;
}

