import { BarChart3, TrendingUp, Users, MessageSquare, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { label: "Total Tickets", value: "1,248", change: "+12%", trending: "up" },
  { label: "Avg Resolution Time", value: "4.2h", change: "-8%", trending: "down" },
  { label: "Customer Satisfaction", value: "98%", change: "+3%", trending: "up" },
  { label: "Active Support Agents", value: "12", change: "0%", trending: "neutral" },
];

export default function SupportAnalyticsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Support Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Track performance and customer support metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <div className={cn(
                "flex items-center text-xs font-bold px-2 py-0.5 rounded-full",
                stat.trending === "up" ? "text-emerald-600 bg-emerald-50" :
                stat.trending === "down" ? "text-rose-600 bg-rose-50" :
                "text-slate-600 bg-slate-50"
              )}>
                {stat.trending === "up" && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
                {stat.trending === "down" && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-[400px] flex items-center justify-center">
        <div className="text-center">
           <BarChart3 className="h-12 w-12 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-400 font-medium">Analytics Chart Visualization Placeholder</p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
