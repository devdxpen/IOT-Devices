import { Plus, Search, Filter, Ticket as TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockTickets = [
  {
    id: "TIC-001",
    subject: "Device connection failing",
    customer: "John Doe",
    priority: "High",
    status: "Open",
    createdAt: "2024-03-20",
  },
  {
    id: "TIC-002",
    subject: "Dashboard loading slow",
    customer: "Jane Smith",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2024-03-19",
  },
  {
    id: "TIC-003",
    subject: "New user registration issue",
    customer: "Robert Brown",
    priority: "Low",
    status: "Closed",
    createdAt: "2024-03-18",
  },
];

export default function SupportTicketsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and respond to customer support requests.</p>
        </div>
        <Button className="bg-[#2596be] hover:bg-[#1d7fa1]">
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search tickets..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Ticket ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTickets.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-slate-50/30">
                <TableCell className="font-medium text-blue-600">{ticket.id}</TableCell>
                <TableCell className="font-medium text-slate-700">{ticket.subject}</TableCell>
                <TableCell className="text-slate-600">{ticket.customer}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                        "text-[10px] px-2",
                        ticket.priority === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" :
                        ticket.priority === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-slate-50 text-slate-600 border-slate-100"
                    )}
                  >
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={cn(
                        "text-[10px] px-2 shadow-none",
                        ticket.status === 'Open' ? "bg-emerald-500 text-white" :
                        ticket.status === 'In Progress' ? "bg-[#2596be] text-white" :
                        "bg-slate-500 text-white"
                    )}
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">{ticket.createdAt}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600">
                        View
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Minimal helper since I didn't import cn in the last block
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
