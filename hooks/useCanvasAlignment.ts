import { useCallback } from "react";
import { Node } from "@xyflow/react";

export function useCanvasAlignment(
  nodes: Node[],
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  saveToHistory: () => void
) {
  const alignNodes = useCallback(
    (selectedNodes: string[], direction: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
      if (selectedNodes.length < 2) return;

      const selectedNodeObjects = nodes.filter((n) => selectedNodes.includes(n.id));
      let targetValue = 0;

      switch (direction) {
        case "left": targetValue = Math.min(...selectedNodeObjects.map((n) => n.position.x)); break;
        case "right": targetValue = Math.max(...selectedNodeObjects.map((n) => n.position.x)); break;
        case "top": targetValue = Math.min(...selectedNodeObjects.map((n) => n.position.y)); break;
        case "bottom": targetValue = Math.max(...selectedNodeObjects.map((n) => n.position.y)); break;
        case "center": {
           const min = Math.min(...selectedNodeObjects.map((n) => n.position.x));
           const max = Math.max(...selectedNodeObjects.map((n) => n.position.x + (n.measured?.width || 0)));
           targetValue = min + (max - min) / 2;
           break;
        }
        case "middle": {
           const min = Math.min(...selectedNodeObjects.map((n) => n.position.y));
           const max = Math.max(...selectedNodeObjects.map((n) => n.position.y + (n.measured?.height || 0)));
           targetValue = min + (max - min) / 2;
           break;
        }
      }

      setNodes((nds) =>
        nds.map((node) => {
          if (!selectedNodes.includes(node.id)) return node;
          const w = node.measured?.width || 0;
          const h = node.measured?.height || 0;
          const newPos = { ...node.position };

          if (direction === "left") newPos.x = targetValue;
          if (direction === "right") newPos.x = targetValue; 
          if (direction === "center") newPos.x = targetValue - w / 2;
          if (direction === "top") newPos.y = targetValue;
          if (direction === "bottom") newPos.y = targetValue;
          if (direction === "middle") newPos.y = targetValue - h / 2;

          return { ...node, position: newPos };
        })
      );
      saveToHistory();
    },
    [nodes, setNodes, saveToHistory]
  );

  const distributeNodes = useCallback(
    (selectedNodes: string[], direction: "horizontal" | "vertical") => {
      if (selectedNodes.length < 3) return;
      const selectedNodeObjects = nodes.filter((n) => selectedNodes.includes(n.id));
      
      selectedNodeObjects.sort((a, b) => 
        direction === "horizontal" ? a.position.x - b.position.x : a.position.y - b.position.y
      );

      const first = selectedNodeObjects[0];
      const last = selectedNodeObjects[selectedNodeObjects.length - 1];
      const count = selectedNodeObjects.length;

      const totalDistance = direction === "horizontal" 
        ? last.position.x - first.position.x 
        : last.position.y - first.position.y;
      
      const interval = totalDistance / (count - 1);

      setNodes((nds) => nds.map(node => {
        const index = selectedNodeObjects.findIndex(n => n.id === node.id);
        if (index <= 0 || index === count - 1) return node;
        
        const newPos = { ...node.position };
        if (direction === "horizontal") newPos.x = first.position.x + (interval * index);
        else newPos.y = first.position.y + (interval * index);
        
        return { ...node, position: newPos };
      }));
      saveToHistory();
    },
    [nodes, setNodes, saveToHistory]
  );

  return { alignNodes, distributeNodes };
}