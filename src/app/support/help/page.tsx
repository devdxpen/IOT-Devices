import { HelpCircle, MessageSquare, Mail, Phone, LifeBuoy, ShieldCheck, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

const supportChannels = [
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time for immediate assistance.",
    icon: MessageSquare,
    action: "Start Chat",
    color: "bg-blue-50 text-[#2596be]",
  },
  {
    title: "Email Support",
    description: "Send us your queries and we'll get back to you within 24 hours.",
    icon: Mail,
    action: "Send Email",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Phone Support",
    description: "Available Mon-Fri, 9am - 6pm for premium enterprise customers.",
    icon: Phone,
    action: "Request Call",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function HelpPage() {
  return (
    <div className="p-8 space-y-12">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 bg-blue-50 text-[#2596be] rounded-3xl flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
            <HelpCircle className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Get the Help You Need</h1>
          <p className="text-slate-500 max-w-lg mx-auto">We're here to support you every step of the way. Choose the channel that works best for you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {supportChannels.map((channel) => (
          <div key={channel.title} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center space-y-6 flex flex-col items-center">
            <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center", channel.color)}>
              <channel.icon className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">{channel.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{channel.description}</p>
            </div>
            <Button className="w-full mt-auto bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl">
              {channel.action}
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
        <div className="space-y-4 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium border border-white/10">
            <LifeBuoy className="h-4 w-4" />
            Premium Support
          </div>
          <h2 className="text-3xl font-bold">Need managed installation?</h2>
          <p className="text-slate-300 text-lg">Our experts can help you set up and configure your entire IOT infrastructure with on-site assistance.</p>
        </div>
        <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-14 px-8 rounded-2xl text-lg relative z-10 shrink-0">
          Book Installation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
        <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
            <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0 mt-1" />
            <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Service Level Agreement</h4>
                <p className="text-sm text-slate-500">Read about our uptime guarantees and support response times.</p>
            </div>
        </div>
        <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
            <FileQuestion className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
            <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Legal & Privacy</h4>
                <p className="text-sm text-slate-500">How we handle your support data and privacy policies.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
