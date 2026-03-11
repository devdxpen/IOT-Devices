import { LinkedUser, RegisteredUser } from "@/types/linked-user";

const DUMMY_LINKED_USERS: LinkedUser[] = [
  {
    id: "U1001",
    name: "Raj Patel",
    email: "raj@gmail.com",
    mobile: "+91 98765 43210",
    role: "Admin",
    status: "Active",
    notification: true,
    joiningDate: "01 Jan 2025",
    expiryDate: "No Expiry",
  },
  {
    id: "U1002",
    name: "Amit Shah",
    email: "amit@gmail.com",
    mobile: "+91 98765 43211",
    role: "Viewer",
    status: "Active",
    notification: true,
    joiningDate: "15 Feb 2025",
    expiryDate: "15 Feb 2026",
  },
  {
    id: "U1003",
    name: "Kunal Mehta",
    email: "kunal@gmail.com",
    mobile: "+91 98765 43212",
    role: "Viewer",
    status: "Inactive",
    notification: false,
    joiningDate: "20 Mar 2025",
    expiryDate: "20 Mar 2026",
  },
  {
    id: "U1004",
    name: "Sneha Desai",
    email: "sneha@gmail.com",
    mobile: "+91 98765 43213",
    role: "Admin",
    status: "Active",
    notification: true,
    joiningDate: "10 Apr 2025",
    expiryDate: "10 Apr 2026",
  },
  {
    id: "U1005",
    name: "Priya Sharma",
    email: "priya@example.com",
    mobile: "+91 98765 43214",
    role: "Viewer",
    status: "Expired",
    notification: false,
    joiningDate: "01 Jun 2024",
    expiryDate: "01 Dec 2024",
  },
];

// Simulated registered users directory for search
const REGISTERED_USERS: RegisteredUser[] = [
  {
    id: "U2001",
    name: "Ananya Gupta",
    email: "ananya@example.com",
    mobile: "+91 99887 76655",
  },
  {
    id: "U2002",
    name: "Vikram Singh",
    email: "vikram@example.com",
    mobile: "+91 99887 76656",
  },
  {
    id: "U2003",
    name: "Meera Joshi",
    email: "meera@example.com",
    mobile: "+91 99887 76657",
  },
  {
    id: "U2004",
    name: "Rahul Verma",
    email: "rahul@example.com",
    mobile: "+91 99887 76658",
  },
  {
    id: "U2005",
    name: "Divya Patel",
    email: "divya@example.com",
    mobile: "+91 99887 76659",
  },
];

export async function fetchLinkedUsers(): Promise<LinkedUser[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return [...DUMMY_LINKED_USERS];
}

export async function searchRegisteredUser(
  query: string,
): Promise<RegisteredUser | null> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return null;

  const found = REGISTERED_USERS.find(
    (u) =>
      u.email.toLowerCase() === normalizedQuery ||
      u.mobile.replace(/\s/g, "") === normalizedQuery.replace(/\s/g, ""),
  );

  return found || null;
}
