import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  IoSearchOutline, 
  IoCreateOutline, 
  IoTrashOutline, 
  IoSwapHorizontalOutline 
} from "react-icons/io5";

const dummyLinkedUsers = [
  {
    id: "U1001",
    name: "Raj Patel",
    email: "raj@gmail.com",
    role: "Admin",
    status: "Active",
    notification: "Enabled",
    joiningDate: "01 Jan 2025",
    expiry: "No Expiry",
  },
  {
    id: "U1002",
    name: "Amit Shah",
    email: "amit@gmail.com",
    role: "User",
    status: "Active",
    notification: "Enabled",
    joiningDate: "15 Feb 2025",
    expiry: "15 Feb 2026",
  },
  {
    id: "U1003",
    name: "Kunal Mehta",
    email: "kunal@gmail.com",
    role: "User",
    status: "Inactive",
    notification: "Disabled",
    joiningDate: "20 Mar 2025",
    expiry: "20 Mar 2026",
  },
];

export function LinkedUsersTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search users..." className="pl-9" />
        </div>
        <div className="text-sm border py-2 px-3 rounded-lg text-slate-600 bg-white">
          Total Users: <span className="font-semibold text-slate-800">{dummyLinkedUsers.length}</span>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">User ID</TableHead>
              <TableHead className="font-semibold text-slate-700">User Name</TableHead>
              <TableHead className="font-semibold text-slate-700">Email</TableHead>
              <TableHead className="font-semibold text-slate-700">User Role</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Notification</TableHead>
              <TableHead className="font-semibold text-slate-700">Joining Date</TableHead>
              <TableHead className="font-semibold text-slate-700">Expiry Date</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyLinkedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-slate-700">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "Admin" ? "default" : "secondary"} className={user.role === "Admin" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : ""}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "outline" : "destructive"} className={user.status === "Active" ? "border-green-200 bg-green-50 text-green-700" : ""}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.notification === "Enabled" ? (
                    <span className="text-slate-600">Enabled</span>
                  ) : (
                    <span className="text-slate-400">Disabled</span>
                  )}
                </TableCell>
                <TableCell className="text-slate-500">{user.joiningDate}</TableCell>
                <TableCell className="text-slate-500">{user.expiry}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Edit Role" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                      <IoCreateOutline className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Transfer Ownership" className="text-amber-600 hover:bg-amber-50 hover:text-amber-700">
                      <IoSwapHorizontalOutline className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Remove User" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                      <IoTrashOutline className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Basic Pagination Stub */}
      <div className="flex items-center justify-between text-sm text-slate-500 pt-2">
        <div>Showing 1 to {dummyLinkedUsers.length} of {dummyLinkedUsers.length} entries</div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90 hover:text-white">1</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
