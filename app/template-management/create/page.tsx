"use client";

import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { ReactFlowProvider } from "@xyflow/react";

export default function CreateTemplatePage() {
  return (
    <div className="flex flex-1 overflow-hidden -m-6 h-[calc(100vh-64px)]">
      <ReactFlowProvider>
        <CanvasEditor />
      </ReactFlowProvider>
    </div>
  );
}
