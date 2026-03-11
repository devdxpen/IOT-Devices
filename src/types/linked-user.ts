export type LinkedUserRole = "Admin" | "Viewer" | "Ownership Transfer";
export type LinkedUserStatus = "Active" | "Inactive" | "Expired";

export interface LinkedUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: LinkedUserRole;
  status: LinkedUserStatus;
  notification: boolean;
  joiningDate: string;
  expiryDate: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
}
