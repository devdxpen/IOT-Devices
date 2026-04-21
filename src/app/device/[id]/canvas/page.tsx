"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CanvasEditor } from "@/features/canvas/CanvasEditor";

export default function DeviceCanvasPage() {
  const params = useParams();
  const router = useRouter();
  const deviceId = params?.id as string | undefined;

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/device")}
            className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to devices
          </Button>
          <div>
            <h1 className="text-sm font-semibold">
              Device Monitoring Canvas{deviceId ? ` - ${deviceId}` : ""}
            </h1>
            <p className="text-xs text-slate-400">
              Open visual monitoring for this device and adjust the layout in a
              dedicated canvas workspace.
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => router.push(`/device/${deviceId}/edit`)}
          className="bg-sky-500 text-white hover:bg-sky-600"
        >
          Edit device
        </Button>
      </header>

      <main className="min-h-0 flex-1">
        <ReactFlowProvider>
          <CanvasEditor />
        </ReactFlowProvider>
      </main>
    </div>
  );
}
