import { PhoneCall, Search, Filter, MoreVertical, Phone } from "lucide-react";
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

const mockCalls = [
  {
    id: "CAL-8801",
    deviceName: "Smart Gateway V3",
    contactNo: "+1 234 567 890",
    subject: "Firmware update failed",
    callingAgent: "Sarah Connor",
    createdAt: "2024-03-20",
    status: "Pending",
  },
  {
    id: "CAL-8802",
    deviceName: "Temp Sensor Pro",
    contactNo: "+49 123 456 789",
    subject: "Sensor calibration help",
    callingAgent: "Alex River",
    createdAt: "2024-03-19",
    status: "Completed",
  },
  {
    id: "CAL-8803",
    deviceName: "Industrial Router X",
    contactNo: "+82 10 1234 5678",
    subject: "VPN tunnel configuration",
    callingAgent: "John Wick",
    createdAt: "2024-03-18",
    status: "Cancelled",
  },
];

export default function CallRequestsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Call Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Manage scheduled callback requests from users.</p>
        </div>
        <Button className="bg-[#2596be] hover:bg-[#1d7fa1]">
          <PhoneCall className="h-4 w-4 mr-2" />
          Schedule Call
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search calls..." className="pl-10" />
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
              <TableHead className="font-semibold text-slate-700">Call ID</TableHead>
              <TableHead className="font-semibold text-slate-700">IoT Device Name</TableHead>
              <TableHead className="font-semibold text-slate-700">Contact No</TableHead>
              <TableHead className="font-semibold text-slate-700">Subject</TableHead>
              <TableHead className="font-semibold text-slate-700">Calling Agent</TableHead>
              <TableHead className="font-semibold text-slate-700">Created Date</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCalls.map((call) => (
              <TableRow key={call.id} className="hover:bg-slate-50/30">
                <TableCell className="font-medium text-[#2596be]">{call.id}</TableCell>
                <TableCell className="font-medium text-slate-700">{call.deviceName}</TableCell>
                <TableCell className="text-slate-600 font-medium">{call.contactNo}</TableCell>
                <TableCell className="text-slate-500 text-sm">{call.subject}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                        {call.callingAgent.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-slate-600">{call.callingAgent}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">{call.createdAt}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-[10px] uppercase font-bold tracking-wider",
                      call.status === "Pending" ? "text-amber-600 bg-amber-50 border-amber-200" :
                      call.status === "Completed" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                      "text-rose-600 bg-rose-50 border-rose-200"
                    )}
                  >
                    {call.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#2596be] hover:bg-blue-50">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
