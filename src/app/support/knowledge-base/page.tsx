import { BookOpen, Search, ChevronRight, FileText, Zap, Shield, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  { title: "Getting Started", description: "Learn the basics of using IOT-Devices platform.", icon: Zap, articles: 12 },
  { title: "Device Configuration", description: "Guides on setting up and managing your hardware.", icon: Cpu, articles: 24 },
  { title: "Security & Permissions", description: "Best practices for keeping your devices safe.", icon: Shield, articles: 8 },
  { title: "API Documentation", description: "Developer resources and endpoint descriptions.", icon: FileText, articles: 15 },
];

export default function KnowledgeBasePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="bg-[#2596be] -mx-8 -mt-8 p-12 text-center text-white space-y-6">
        <h1 className="text-3xl font-bold">How can we help you?</h1>
        <div className="relative max-w-xl mx-auto text-slate-900">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input placeholder="Search knowledge base..." className="h-12 pl-12 rounded-xl border-none shadow-lg text-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#2596be] group-hover:bg-[#2596be] group-hover:text-white transition-colors">
                <cat.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{cat.title}</h3>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{cat.description}</p>
                <p className="text-xs font-semibold text-[#2596be] mt-2">{cat.articles} Articles</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
