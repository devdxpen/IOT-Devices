"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Printer,
  ChevronRight,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockKBCategories } from "@/features/support/data/mock-kb";
import { cn } from "@/lib/utils";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const articleId = params.articleId as string;

  const category = mockKBCategories.find((c) => c.slug === slug);
  const article = category?.articles.find((a) => a.id === articleId);

  if (!article || !category) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Article not found</h2>
        <Button onClick={() => router.push("/support/knowledge-base")}>
          Back to Knowledge Base
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto">
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/support/knowledge-base" className="hover:text-[#2596be] transition-colors">Knowledge Base</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/support/knowledge-base/${slug}`} className="hover:text-[#2596be] transition-colors">{category.title}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 truncate">{article.title}</span>
        </div>

        <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900">{article.author}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Support Specialist</p>
                    </div>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Updated {article.updatedAt}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {article.readTime} read
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-8">
            <div className="prose prose-slate max-w-none">
                <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-100 border-l-4 border-l-[#2596be]">
                    <p className="text-slate-600 font-medium italic text-lg leading-relaxed">
                        "{article.excerpt}"
                    </p>
                </div>
                
                <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                    <p>
                        Welcome to the detailed guide on <strong>{article.title}</strong>. This article is designed to provide you 
                        with comprehensive information and actionable steps to optimize your experience with the IOT-Devices platform.
                    </p>
                    
                    <h2 className="text-2xl font-bold text-slate-900 pt-4">Introduction</h2>
                    <p>
                        The IOT-Devices ecosystem is built on a foundation of reliability and scalability. Understanding how to navigate 
                        and configure <em>{article.title}</em> is crucial for maintaining a high-performance monitor system. 
                        In this section, we'll cover the core concepts and prerequisites.
                    </p>
                    
                    <div className="bg-blue-50/50 rounded-2xl p-6 space-y-3 border border-blue-100">
                        <h4 className="font-bold text-blue-900 flex items-center gap-2">
                            <span className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">!</span>
                            Important Note
                        </h4>
                        <p className="text-blue-800 text-sm">
                            Always ensure your gateway software is updated to the latest version before modifying advanced configuration settings. 
                            Failure to do so may result in temporary device disconnects.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 pt-4">Step-by-Step Implementation</h2>
                    <p>
                        To begin the process, navigate to your admin console and follow these standardized procedures:
                    </p>
                    <ol className="list-decimal pl-6 space-y-4 font-medium">
                        <li>Access the main navigation sidebar and select the corresponding module.</li>
                        <li>Identify the target device or group from the filtered list view.</li>
                        <li>Click on the edit icon to reveal the configuration properties panel.</li>
                        <li>Apply the necessary changes as described in your technical specification document.</li>
                        <li>Review and save to commit the changes to the cloud registry.</li>
                    </ol>

                    <h2 className="text-2xl font-bold text-slate-900 pt-4">Conclusion</h2>
                    <p>
                        By following these guidelines, you ensure that your {article.title} settings are aligned with best practices. 
                        If you encounter any issues not covered in this guide, please reach out via our live channels.
                    </p>
                </div>
            </div>


        </div>

        <div className="space-y-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Share this Guide</h4>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white border-slate-200 hover:text-[#2596be] hover:border-blue-100"><Share2 className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white border-slate-200 hover:text-[#2596be] hover:border-blue-100"><Printer className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white border-slate-200 hover:text-[#2596be] hover:border-blue-100"><MessageCircle className="h-4 w-4" /></Button>
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">In this article</h4>
                <div className="space-y-3 border-l-2 border-slate-100 pl-4">
                    <p className="text-sm font-bold text-[#2596be] cursor-pointer">Introduction</p>
                    <p className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Step-by-step Implementation</p>
                    <p className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Best Practices</p>
                    <p className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Conclusion</p>
                </div>
            </div>


        </div>
      </div>
    </div>
  );
}
