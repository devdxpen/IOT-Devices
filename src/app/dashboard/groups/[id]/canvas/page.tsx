"use client";

import { useParams } from "next/navigation";
import { CanvasEditor } from "@/features/canvas/CanvasEditor";

export default function GroupCanvasPage() {
  const params = useParams();
  const groupId = params?.id as string | undefined;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900">
      <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/80 text-slate-100">
        <div>
          <h1 className="text-sm font-semibold">
            Group Canvas{groupId ? ` — ${groupId}` : ""}
          </h1>
          <p className="text-xs text-slate-400">
            Drag and arrange devices for large-screen monitoring. This view is
            optimised for separate tab/window dashboards.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline">
            Tip: Press F11 in browser for full-screen wall display.
          </span>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <CanvasEditor />
      </main>
    </div>
  );
}

