"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Clock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockKBCategories } from "@/features/support/data/mock-kb";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const category = mockKBCategories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Category not found</h2>
        <Button onClick={() => router.push("/support/knowledge-base")}>
          Back to Knowledge Base
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        <Link 
            href="/support/knowledge-base" 
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2596be] transition-colors group w-fit"
        >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Overview
        </Link>
        
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">{category.title}</h1>
            <p className="text-slate-500 max-w-2xl">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {category.articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/support/knowledge-base/${slug}/${article.id}`}
            className="group"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex items-center justify-between">
              <div className="flex gap-5 items-start">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-[#2596be] transition-colors">
                      <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-[#2596be] transition-colors">{article.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{article.excerpt}</p>
                    <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                            <Clock className="h-3 w-3" />
                            {article.readTime} read
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                            <User className="h-3 w-3" />
                            By {article.author}
                        </div>
                    </div>
                  </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#2596be] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {category.articles.length === 0 && (
          <div className="bg-slate-50 rounded-2xl p-12 text-center space-y-3 border border-dashed border-slate-200">
              <BookOpen className="h-10 w-10 text-slate-200 mx-auto" />
              <p className="text-slate-500 font-medium">No articles found in this category yet.</p>
          </div>
      )}
    </div>
  );
}
