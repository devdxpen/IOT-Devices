"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NODE_TYPES, CanvasBoundaries } from "./CanvasEditor";

interface CanvasPreviewProps {
  jsonStr: string;
}

function CanvasPreviewInner({ jsonStr }: CanvasPreviewProps) {
  const data = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonStr);
      let pageData: any = {};

      if (
        parsed.pages &&
        Array.isArray(parsed.pages) &&
        parsed.pages.length > 0
      ) {
        pageData = parsed.pages[0]; // Preview the first page
      } else {
        pageData = parsed; // Fallback for old format
      }

      return {
        nodes: pageData.nodes || [],
        edges: pageData.edges || [],
        canvasSize: pageData.canvasSize || { width: 1920, height: 1080 },
        backgroundColor: pageData.backgroundColor || "#ffffff",
        backgroundImage: pageData.backgroundImage,
      };
    } catch (err) {
      console.error("Failed to parse canvas JSON for preview:", err);
      return {
        nodes: [],
        edges: [],
        canvasSize: { width: 1920, height: 1080 },
        backgroundColor: "#ffffff",
      };
    }
  }, [jsonStr]);

  return (
    <div className="w-full h-full bg-slate-50 relative pointer-events-none rounded-xl overflow-hidden">
      <ReactFlow
        nodes={data.nodes}
        edges={data.edges}
        nodeTypes={NODE_TYPES}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        onInit={(instance) => {
          setTimeout(() => {
            instance.fitBounds(
              {
                x: 0,
                y: 0,
                width: data.canvasSize.width,
                height: data.canvasSize.height,
              },
              { padding: 0.1, duration: 0 },
            );
          }, 50); // slight delay to ensure container is ready
        }}
      >
        <CanvasBoundaries
          width={data.canvasSize.width}
          height={data.canvasSize.height}
          color={data.backgroundColor}
          image={data.backgroundImage}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#d1d5db"
        />
      </ReactFlow>
    </div>
  );
}

export function CanvasPreview({ jsonStr }: CanvasPreviewProps) {
  return (
    <ReactFlowProvider>
      <CanvasPreviewInner jsonStr={jsonStr} />
    </ReactFlowProvider>
  );
}
