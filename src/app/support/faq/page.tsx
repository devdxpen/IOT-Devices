import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "How do I add a new device?",
    a: "You can add a new device by navigating to the Devices page and clicking the 'Add Device' button. Follow the wizard to complete the setup.",
  },
  {
    q: "Can I manage multiple groups at once?",
    a: "Yes, you can use the Group Management section to create hierarchies and assign devices to multiple groups simultaneously.",
  },
  {
    q: "What is the 'Mask Time' in notification settings?",
    a: "Mask time is the duration for which notifications will be suppressed after an initial alarm is triggered, preventing notification fatigue.",
  },
  {
    q: "How do I export analytics data?",
    a: "Go to the Analytics section, choose your date range, and click the 'Export' button to download a CSV or PDF report.",
  },
];

export default function FAQPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h1>
        <p className="text-slate-500">Find quick answers to your questions about IOT-Devices.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group">
              <span className="font-semibold text-slate-700">{faq.q}</span>
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
            <div className="px-6 pb-5">
              <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-8 rounded-2xl text-center space-y-4 border border-blue-100">
        <div className="h-12 w-12 bg-[#2596be] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <MessageSquare className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900">Still have questions?</h3>
          <p className="text-sm text-slate-500">If you can't find the answer you're looking for, please contact our support team.</p>
        </div>
        <Button className="bg-[#2596be] hover:bg-[#1d7fa1]">Contact Support</Button>
      </div>
    </div>
  );
}
