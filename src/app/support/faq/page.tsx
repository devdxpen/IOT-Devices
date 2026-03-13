"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  ChevronDown, 
  MessageSquare, 
  Search, 
  Tag as TagIcon,
  ChevronRight,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqData: FAQItem[] = [

  {
    id: "faq-1",
    question: "How do I add a new device?",
    answer: "You can add a new device by navigating to the Devices page and clicking the 'Add Device' button. Follow the wizard to complete the setup. Make sure your gateway is powered on and connected to the internet during the discovery phase.",
    category: "Devices",
    tags: ["Setup", "Configuration", "Connectivity"],
  },
  {
    id: "faq-2",
    question: "Can I manage multiple groups at once?",
    answer: "Yes, you can use the Group Management section to create hierarchies and assign devices to multiple groups simultaneously. You can also perform bulk actions on devices within a group, such as updating firmware or changing configuration templates.",
    category: "Organization",
    tags: ["Groups", "Bulk Action", "Management"],
  },
  {
    id: "faq-3",
    question: "What is the 'Mask Time' in notification settings?",
    answer: "Mask time is the duration for which notifications will be suppressed after an initial alarm is triggered. This helps prevent 'notification fatigue' where you might receive hundreds of alerts for a single persistent issue. Once the mask time expires, new alerts will trigger notifications again.",
    category: "Alerts",
    tags: ["Notifications", "Settings", "Alerting"],
  },
  {
    id: "faq-4",
    question: "How do I export analytics data?",
    answer: "Go to the Analytics section, choose your date range (Last 7 Days, 30 Days, etc.), select the parameters you want to export, and click the 'Export' button. You can download the data in CSV or PDF format. Enterprise users also have access to scheduled automated reports.",
    category: "Analytics",
    tags: ["Reporting", "Export", "Data"],
  },
  {
    id: "faq-5",
    question: "How do I invite a new user?",
    answer: "Navigate to Settings > User Management and click 'Invite User'. Enter their email address and select the appropriate role (Admin, Viewer, or Editor). They will receive an email invitation with a temporary login link.",
    category: "Account",
    tags: ["Users", "Access Control", "Roles"],
  },
  {
    id: "faq-6",
    question: "How do I update device firmware?",
    answer: "Go to the Device Detail page for the target device. If a firmware update is available, you will see an 'Update Firmware' button in the Actions panel. Please ensure the device remains powered on for the duration of the update, which typically takes 2-5 minutes.",
    category: "Devices",
    tags: ["Firmware", "Update", "Maintenance"],
  },
];

const categories = ["All", "Devices", "Organization", "Alerts", "Analytics", "Account"];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-8 pb-24 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-50 text-[#2596be] rounded-3xl border border-blue-100 shadow-sm mb-2">
          <HelpCircle className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-slate-500 text-lg">Quick answers to common questions about the platform.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by keyword, tag, or topic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white border-transparent focus-visible:ring-0 focus-visible:border-[#2596be] transition-all text-base" 
            />
          </div>
          <div className="h-6 w-px bg-slate-200 hidden md:block" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 text-slate-500 font-bold px-4 gap-2 outline-none">
                <Filter className="h-4 w-4" />
                {selectedCategory === "All" ? "Filter" : selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200 rounded-xl shadow-xl">
              {categories.map((cat) => (
                <DropdownMenuItem 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "text-xs font-bold py-2 px-4 cursor-pointer",
                    selectedCategory === cat ? "bg-blue-50 text-[#2596be]" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Removed redundant Categories div */}

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={cn(
                  "bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
                  isExpanded ? "border-[#2596be] shadow-lg shadow-blue-500/5 ring-1 ring-[#2596be]/10" : "border-slate-200 hover:border-slate-300 shadow-sm"
                )}
              >
                <button 
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <div className="space-y-1 pr-4">
                    <span className="text-xs font-bold text-[#2596be] uppercase tracking-widest">{faq.category}</span>
                    <h3 className={cn("text-lg font-bold transition-colors", isExpanded ? "text-[#2596be]" : "text-slate-800 group-hover:text-slate-900")}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    isExpanded ? "bg-[#2596be] text-white rotate-180" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                  )}>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>
                
                <div 
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-8 pb-8 pt-2 space-y-6">
                    <p className="text-slate-600 leading-relaxed text-base font-medium">
                      {faq.answer}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mr-2">
                        <TagIcon className="h-3.5 w-3.5" />
                        Tags:
                      </div>
                      {faq.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-none px-3 py-1 text-[10px] font-bold shadow-none transition-colors">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-20 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="h-6 w-6 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching questions found</h3>
              <p className="text-slate-500 mt-1 max-w-xs mx-auto">Try adjusting your search keywords or choosing a different category.</p>
              <Button 
                variant="outline" 
                onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                className="mt-6 font-bold text-[#2596be] border-blue-100 hover:bg-blue-50"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 bg-slate-900 rounded-[32px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-48 w-48 bg-blue-500/10 rounded-full blur-2xl" />
        
        <div className="space-y-4 relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold border border-white/10 uppercase tracking-widest text-[#2596be]">
            <MessageSquare className="h-4 w-4" />
            Support Community
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Still have questions?</h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">If you can't find the answer you're looking for, our friendly support team is just a message away.</p>
        </div>
        <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-14 px-10 rounded-2xl text-lg relative z-10 shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
