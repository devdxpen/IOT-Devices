import { PhoneCall, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockCalls = [
  {
    id: "CAL-001",
    user: "Robert Bosch",
    phone: "+1 234 567 890",
    time: "10:30 AM",
    date: "Today",
    status: "Pending",
  },
  {
    id: "CAL-002",
    user: "Maria Garcia",
    phone: "+49 123 456 789",
    time: "02:15 PM",
    date: "Today",
    status: "Completed",
  },
  {
    id: "CAL-003",
    user: "Lee Sung",
    phone: "+82 10 1234 5678",
    time: "09:00 AM",
    date: "Yesterday",
    status: "Cancelled",
  },
];

export default function CallRequestsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Call Requests</h1>
        <p className="text-sm text-slate-500 mt-1">Manage scheduled callback requests from users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCalls.map((call) => (
          <div key={call.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                <PhoneCall className="h-5 w-5 text-[#2596be]" />
              </div>
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
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900">{call.user}</h3>
              <p className="text-sm text-slate-500">{call.phone}</p>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {call.time}
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {call.date}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button className="flex-1 h-9 bg-[#2596be] hover:bg-[#1d7fa1] text-xs">
                Call Now
              </Button>
              <Button variant="outline" className="h-9 text-xs">
                Reschedule
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
