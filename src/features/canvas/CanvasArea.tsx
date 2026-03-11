import React from "react";
// Eventually import CanvasEditor here

export function CanvasArea() {
  return (
    <div className="w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-2xl font-semibold text-gray-400">Canvas Ready</div>
        <p className="text-gray-500 text-sm">
          Drag components from the left sidebar to start.
        </p>
      </div>
    </div>
  );
}
