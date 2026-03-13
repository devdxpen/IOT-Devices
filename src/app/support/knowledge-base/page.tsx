"use client";

import { Search, ChevronRight, Zap, Cpu, Shield, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { mockKBCategories } from "@/features/support/data/mock-kb";

const iconMap: Record<string, any> = {
  Zap,
  Cpu,
  Shield,
  FileText,
};

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="bg-[#2596be] -mx-8 -mt-8 p-16 text-center text-white space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-48 w-48 bg-black/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">How can we help you?</h1>
            <p className="text-blue-50/80 max-w-lg mx-auto">Search our knowledge base for articles, guides, and tutorials or browse by category.</p>
            <div className="relative max-w-xl mx-auto text-slate-900 mt-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                    placeholder="Search for articles (e.g. setup, security, alerts)..." 
                    className="h-14 pl-12 rounded-2xl border-none shadow-2xl text-lg focus-visible:ring-2 focus-visible:ring-white/20" 
                />
            </div>
        </div>
      </div>

      <div className="px-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-[-40px] relative z-20">
        {mockKBCategories.map((cat) => {
          const Icon = iconMap[cat.icon] || FileText;
          return (
            <Link key={cat.id} href={`/support/knowledge-base/${cat.slug}`}>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex items-start gap-6 h-full">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2596be] group-hover:bg-[#2596be] group-hover:text-white transition-all duration-300">
                        <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2596be] transition-colors">{cat.title}</h3>
                            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#2596be] transition-all" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{cat.description}</p>
                        <div className="pt-4 flex items-center gap-2">
                            <span className="text-xs font-bold text-[#2596be] bg-blue-50 px-3 py-1 rounded-full">{cat.articleCount} Articles</span>
                            {cat.articles.slice(0, 1).map(article => (
                                <span key={article.id} className="text-[10px] text-slate-400 font-medium italic underline decoration-slate-200 truncate max-w-[150px]">
                                    Featured: {article.title}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
          );
        })}
      </div>

      <div className="px-8 max-w-6xl mx-auto pt-12 space-y-6">
          <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Recently Updated</h2>
              <Button variant="ghost" className="text-[#2596be] font-bold">View All Articles</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockKBCategories.flatMap(c => c.articles).slice(0, 3).map(article => (
                  <div key={article.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">Updated</span>
                          <span className="text-[10px] text-slate-400 font-medium">{article.updatedAt}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 group-hover:text-[#2596be] transition-colors line-clamp-2">{article.title}</h4>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">{article.readTime} read</span>
                          <Link href="#" className="text-[10px] font-bold text-[#2596be] flex items-center gap-1 group/link">
                              Read More <ChevronRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}

// Minimal Button shim if needed, though I should check if it's imported
import { mockNotifications } from "@/features/notifications/data/mock-notifications";
import { Button } from "@/components/ui/button";
