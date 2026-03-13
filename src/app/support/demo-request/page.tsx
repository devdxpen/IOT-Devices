import { CalendarDays, Play, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DemoRequestPage() {
  return (
    <div className="p-8 h-full">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full pb-20">
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge className="bg-blue-50 text-[#2596be] hover:bg-blue-50 border-blue-100 shadow-none px-3 py-1">Personalized Demo</Badge>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                See IOT-Devices <br /> <span className="text-[#2596be]">In Action</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
                Discover how our platform can transform your device management and workflow efficiency.
            </p>
          </div>

          <div className="space-y-4">
            {[ 
                "Full access to platform features",
                "Custom solution architecture",
                "Expert onboarding guidance",
                "Global hardware compatibility"
            ].map(item => (
                <div key={item} className="flex items-center gap-3 text-slate-600 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    {item}
                </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-slate-100">
                <Play className="h-6 w-6 text-[#2596be] fill-[#2596be]" />
            </div>
            <div>
                <p className="font-bold text-slate-900">Watch Quick Teaser</p>
                <p className="text-xs text-slate-500">2 min overview of key features</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Schedule your demo</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                    <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                    <Input placeholder="Doe" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <Input placeholder="john@company.com" type="email" />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specific Requirements</label>
                <Textarea placeholder="Tell us what you're looking for..." className="min-h-[100px]" />
            </div>
            <Button className="w-full h-12 bg-[#2596be] hover:bg-[#1d7fa1] text-lg font-bold">
                Book My Demo
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-center text-xs text-slate-400">No commitment required. We respect your privacy.</p>
        </div>
      </div>
    </div>
  );
}

// Minimal helper for Badge since I didn't import it effectively from components/ui
function Badge({ className, children }: any) {
    return <span className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>{children}</span>
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
