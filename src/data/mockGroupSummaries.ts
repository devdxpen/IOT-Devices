import { GroupSummary } from "@/types/group";
import { mockDeviceSummaries } from "./mockDeviceSummaries";

export const mockGroupSummaries: GroupSummary[] = Array.from(
  { length: 15 },
  (_, i) => {
    // Grab a slice of 3 devices for each mock group
    const deviceSlice = mockDeviceSummaries
      .map((device) => ({
        ...device,
        id: `${device.id}-grp-${i}`, // ensure unique keys for nested tables
      }))
      .slice(0, 3);

    const users = [
      { name: "Priya Mehta", avatarUrl: "/avatars/avatar-2.png" },
      { name: "Alex Johnson", avatarUrl: "/avatars/avatar-1.png" },
      { name: "Sarah Connor", avatarUrl: "/avatars/avatar-3.png" },
      { name: "John Doe", avatarUrl: "/avatars/avatar-4.png" },
      { name: "Jane Doe", avatarUrl: "/avatars/avatar-5.png" },
    ];

    const ownership: GroupSummary["ownership"] =
      i % 3 === 0 ? "shared" : "own";

    return {
      id: `group-${i}`,
      name: i % 4 === 0 ? `Mumbai DC ${i + 1}` : `Ahmedabad Top ${10 + i}`,
      deviceCount: 3,
      tags: i % 2 === 0 ? "Temperature Sensor" : "Power Monitoring",
      lastDataTimestamp: `May 19 2025\n12:30 PM`,
      validatePeriodStart: "May 19 2025",
      validatePeriodEnd: "May 19 2026",
      alarms: (i % 3) + 1,
      users: users.slice(0, (i % 3) + 3), // 3 to 5 users
      devices: deviceSlice, // Nested table data
      ownership,
    };
  },
);
