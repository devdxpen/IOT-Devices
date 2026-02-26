"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  BackgroundVariant,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Toolbar } from "./Toolbar";
import { PropertiesPanel } from "./PropertiesPanel";

// ─── Widget imports: Basic ────────────────────────────────────
import { CustomNode } from "./nodes/CustomNode";
import { NumberWidget } from "./widgets/NumberWidget";
import { ImageWidget } from "./widgets/ImageWidget";
import { LampWidget } from "./widgets/LampWidget";
import { TextCardWidget } from "./widgets/TextCardWidget";
import { FunctionSwitchWidget } from "./widgets/FunctionSwitchWidget";
import { CombinationWidget } from "./widgets/CombinationWidget";
import { BitSwitchWidget } from "./widgets/BitSwitchWidget";
import { WordSwitchWidget } from "./widgets/WordSwitchWidget";
import { BoxWidget } from "./widgets/BoxWidget";
import { HyperlinkWidget } from "./widgets/HyperlinkWidget";
import { TimeWidget } from "./widgets/TimeWidget";
import { ConsoleWidget } from "./widgets/ConsoleWidget";
import { StatusWidget } from "./widgets/StatusWidget";
import { MenuButtonWidget } from "./widgets/MenuButtonWidget";
import { IndirectScreenWidget } from "./widgets/IndirectScreenWidget";
import { IframeWidget } from "./widgets/IframeWidget";
import { CardWidget } from "./widgets/CardWidget";
import { DeviceInfoWidget } from "./widgets/DeviceInfoWidget";
import { VideoWidget } from "./widgets/VideoWidget";
import { DeviceMonitorWidget } from "./widgets/DeviceMonitorWidget";
import { NavigationWidget } from "./widgets/NavigationWidget";
import { QRCodeWidget } from "./widgets/QRCodeWidget";
import { BarrageWidget } from "./widgets/BarrageWidget";
import { FlowBarWidget } from "./widgets/FlowBarWidget";
import { PipeWidget } from "./widgets/PipeWidget";
import { OvalWidget } from "./widgets/OvalWidget";
import { LineWidget } from "./widgets/LineWidget";
import { RectangleWidget } from "./widgets/RectangleWidget";
import { CircleWidget } from "./widgets/CircleWidget";
import { TriangleWidget } from "./widgets/TriangleWidget";
import { TableWidget } from "./widgets/TableWidget";

// ─── Widget imports: IoT / Display ────────────────────────────
import { TemperatureWidget } from "./widgets/TemperatureWidget";
import { LocationWidget } from "./widgets/LocationWidget";
import { AlarmWidget } from "./widgets/AlarmWidget";
import { SwitchWidget } from "./widgets/SwitchWidget";
import { RadioWidget } from "./widgets/RadioWidget";
import { SliderWidget } from "./widgets/SliderWidget";
import { ButtonWidget } from "./widgets/ButtonWidget";
import { GaugeWidget } from "./widgets/GaugeWidget";
import { ProgressWidget } from "./widgets/ProgressWidget";
import { ClimateWidget } from "./widgets/ClimateWidget";
import { VoltageWidget } from "./widgets/VoltageWidget";
import { AlertsWidget } from "./widgets/AlertsWidget";
import { HealthWidget } from "./widgets/HealthWidget";
import { ChartWidget } from "./widgets/ChartWidget";

// ─── Widget imports: Chart (Apex) & Lists ─────────────────────
import { ApexChartWidget } from "./widgets/ApexChartWidget";
import { DashboardWidget } from "./widgets/DashboardWidget";
import { ListWidget } from "./widgets/ListWidget";
import { LeftSidebar } from "./LeftSidebar";

// ═══════════════════════════════════════════════════════════════
// NODE_TYPES — maps every sidebar `type` string to its component
// ═══════════════════════════════════════════════════════════════
const NODE_TYPES: NodeTypes = {
  // ── Basic ──
  text: CustomNode,
  image: ImageWidget,
  number: NumberWidget,
  "bit-lamp": LampWidget,
  textcard: TextCardWidget,
  "word-lamp": LampWidget,
  "function-switch": FunctionSwitchWidget,
  combination: CombinationWidget,
  "bit-switch": BitSwitchWidget,
  "word-switch": WordSwitchWidget,
  box: BoxWidget,
  hyperlink: HyperlinkWidget,
  time: TimeWidget,
  console: ConsoleWidget,
  status: StatusWidget,
  "menu-button": MenuButtonWidget,
  "indirect-screen": IndirectScreenWidget,
  iframe: IframeWidget,
  card: CardWidget,
  "device-info": DeviceInfoWidget,
  "video-window": VideoWidget,
  "device-monitor": DeviceMonitorWidget,
  navigation: NavigationWidget,
  "qr-code": QRCodeWidget,
  barrage: BarrageWidget,
  "flow-bar": FlowBarWidget,
  pipe: PipeWidget,

  // ── Charts (ApexCharts) ──
  chart_bar: ApexChartWidget,
  histogram: ApexChartWidget,
  "ring-chart": ApexChartWidget,
  "pie-chart": ApexChartWidget,
  "radar-chart": ApexChartWidget,
  "trend-chart": ApexChartWidget,
  "line-chart": ApexChartWidget,
  horizontal: ApexChartWidget,

  // ── Dashboard ──
  dashboard: DashboardWidget,

  // ── Lists ──
  "scroll-list": ListWidget,
  "history-record": ListWidget,
  "alarm-record": ListWidget,
  "alarm-card-list": ListWidget,
  "devices-list": ListWidget,

  // ── Shapes ──
  line: LineWidget,
  rectangle: RectangleWidget,
  circle: CircleWidget,
  triangle: TriangleWidget,
  oval: OvalWidget,
  table: TableWidget,

  // ── IoT / Display / Controls (from ShapePalette) ──
  temperature: TemperatureWidget,
  location: LocationWidget,
  alarm: AlarmWidget,
  switch: SwitchWidget,
  radio: RadioWidget,
  slider: SliderWidget,
  button: ButtonWidget,
  gauge: GaugeWidget,
  progress: ProgressWidget,
  climate: ClimateWidget,
  voltage: VoltageWidget,
  alerts: AlertsWidget,
  health: HealthWidget,
  chart: ChartWidget,
};

// ═══════════════════════════════════════════════════════════════
// Default dummy data for each widget type on first drop
// ═══════════════════════════════════════════════════════════════
const DEFAULT_DATA: Record<string, Record<string, unknown>> = {
  text: { label: "Text Node" },
  image: { label: "Image", imageUrl: "" },
  number: { label: "Sensor Value", value: 42, unit: "°C" },
  "bit-lamp": { label: "Bit Lamp", value: true },
  textcard: { label: "Text Card", content: "Sample card content" },
  "word-lamp": { label: "Word Lamp", value: true },
  "function-switch": { label: "Function Switch" },
  combination: { label: "Combination" },
  "bit-switch": { label: "Bit Switch" },
  "word-switch": { label: "Word Switch" },
  box: { label: "Box" },
  hyperlink: { label: "Hyperlink", url: "https://example.com" },
  time: { label: "Clock" },
  console: { label: "Console" },
  status: { label: "Status", value: "Online" },
  "menu-button": { label: "Menu" },
  "indirect-screen": { label: "Screen" },
  iframe: { label: "Iframe", url: "https://example.com" },
  card: { label: "Card" },
  "device-info": { label: "Device Info" },
  "video-window": { label: "Video" },
  "device-monitor": { label: "Device Monitor" },
  navigation: { label: "Navigation" },
  "qr-code": { label: "QR Code", value: "https://example.com" },
  barrage: { label: "Barrage" },
  "flow-bar": { label: "Flow Bar", value: 65 },
  pipe: { label: "Pipe" },

  // Charts
  chart_bar: { label: "Bar Chart" },
  histogram: { label: "Histogram" },
  "ring-chart": { label: "Ring Chart" },
  "pie-chart": { label: "Pie Chart" },
  "radar-chart": { label: "Radar Chart" },
  "trend-chart": { label: "Trend Chart" },
  "line-chart": { label: "Line Chart" },
  horizontal: { label: "Horizontal Bar" },

  dashboard: { label: "Dashboard" },

  // Lists
  "scroll-list": { label: "Scroll List" },
  "history-record": { label: "History Record" },
  "alarm-record": { label: "Alarm Record" },
  "alarm-card-list": { label: "Alarm Card List" },
  "devices-list": { label: "Devices List" },

  // Shapes
  line: {
    label: "Line",
    strokeColor: "#374151",
    strokeWidth: 2,
    dashStyle: "solid",
    width: 200,
    height: 4,
    opacity: 100,
  },
  rectangle: {
    label: "Rectangle",
    fillColor: "#ffffff",
    borderColor: "#9ca3af",
    borderWidth: 2,
    opacity: 100,
    borderRadius: 4,
    width: 160,
    height: 100,
  },
  circle: {
    label: "Circle",
    fillColor: "#ffffff",
    borderColor: "#9ca3af",
    borderWidth: 2,
    opacity: 100,
    width: 120,
  },
  triangle: {
    label: "Triangle",
    fillColor: "#ffffff",
    borderColor: "#9ca3af",
    borderWidth: 2,
    opacity: 100,
    width: 140,
    height: 120,
  },
  oval: {
    label: "Oval",
    fillColor: "#ffffff",
    borderColor: "#9ca3af",
    borderWidth: 2,
    opacity: 100,
    width: 160,
    height: 100,
  },
  table: {
    label: "Table",
    rows: 4,
    columns: 3,
    headerBgColor: "#3b82f6",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    fontColor: "#1f2937",
    fontSize: 13,
    opacity: 100,
    cellData: [
      ["Header 1", "Header 2", "Header 3"],
      ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
      ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
      ["Row 3 Col 1", "Row 3 Col 2", "Row 3 Col 3"],
    ],
  },

  // IoT
  temperature: { label: "Temperature", value: 25 },
  location: { label: "Location", location: "Zone A" },
  alarm: { label: "Alarm", status: "normal" },
  switch: { label: "Switch" },
  radio: { label: "Radio" },
  slider: { label: "Slider", value: 50 },
  button: { label: "Button" },
  gauge: { label: "Gauge", value: 65 },
  progress: { label: "Progress", value: 72 },
  climate: { label: "Climate" },
  voltage: { label: "Voltage" },
  alerts: { label: "Alerts" },
  health: { label: "Health" },
  chart: { label: "Line Chart" },
};

// ═══════════════════════════════════════════════════════════════
// Multi-Canvas Types
// ═══════════════════════════════════════════════════════════════
interface CanvasPage {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  backgroundColor: string;
  backgroundImage: string;
  canvasSize: { width: number; height: number };
}

const createNewPage = (index: number): CanvasPage => ({
  id: `page_${Date.now()}_${index}`,
  name: `Canvas ${index}`,
  nodes: [],
  edges: [],
  backgroundColor: "#ffffff",
  backgroundImage: "",
  canvasSize: { width: 1920, height: 1080 },
});

// ═══════════════════════════════════════════════════════════════
// CanvasEditor component
// ═══════════════════════════════════════════════════════════════
let nodeId = 0;
const getId = () => `node_${++nodeId}_${Date.now()}`;

export function CanvasEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitBounds, zoomIn, zoomOut } = useReactFlow();

  // ── Multi-canvas pages ──
  const [initialPage] = useState<CanvasPage>(() => createNewPage(1));
  const [pages, setPages] = useState<CanvasPage[]>([initialPage]);
  const [activePageId, setActivePageId] = useState<string>(initialPage.id);

  const activePage = useMemo(
    () => pages.find((p) => p.id === activePageId) ?? pages[0],
    [pages, activePageId],
  );

  // ── ReactFlow nodes/edges — synced with active page ──
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    activePage?.nodes ?? [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    activePage?.edges ?? [],
  );

  // ── Save active page nodes/edges when switching pages ──
  const saveCurrentPage = useCallback(
    (targetPageId: string) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageId
            ? { ...p, nodes: [...nodes], edges: [...edges] }
            : p,
        ),
      );
      setActivePageId(targetPageId);
    },
    [activePageId, nodes, edges],
  );

  // ── When active page changes, load its data ──
  const prevActivePageIdRef = useRef(activePageId);
  useEffect(() => {
    if (prevActivePageIdRef.current !== activePageId) {
      const page = pages.find((p) => p.id === activePageId);
      if (page) {
        setNodes(page.nodes);
        setEdges(page.edges);
      }
      prevActivePageIdRef.current = activePageId;
    }
  }, [activePageId, pages, setNodes, setEdges]);

  // ── Per-canvas settings (derived from active page) ──
  const canvasSize = activePage?.canvasSize ?? { width: 1920, height: 1080 };
  const backgroundColor = activePage?.backgroundColor ?? "#ffffff";
  const backgroundImage = activePage?.backgroundImage ?? "";
  const templateName = activePage?.name ?? "Canvas 1";

  const setCanvasSize = useCallback(
    (val: { width: number; height: number }) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageId ? { ...p, canvasSize: val } : p,
        ),
      );
    },
    [activePageId],
  );

  const setBackgroundColor = useCallback(
    (val: string) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageId ? { ...p, backgroundColor: val } : p,
        ),
      );
    },
    [activePageId],
  );

  const setBackgroundImage = useCallback(
    (val: string) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageId ? { ...p, backgroundImage: val } : p,
        ),
      );
    },
    [activePageId],
  );

  const setTemplateName = useCallback(
    (val: string) => {
      setPages((prev) =>
        prev.map((p) => (p.id === activePageId ? { ...p, name: val } : p)),
      );
    },
    [activePageId],
  );

  // ── State ──
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // ── Undo / Redo stacks (per session, not per page for simplicity) ──
  const [undoStack, setUndoStack] = useState<
    { nodes: Node[]; edges: Edge[] }[]
  >([]);
  const [redoStack, setRedoStack] = useState<
    { nodes: Node[]; edges: Edge[] }[]
  >([]);

  const pushUndo = useCallback(() => {
    setUndoStack((prev) => [
      ...prev.slice(-29),
      { nodes: [...nodes], edges: [...edges] },
    ]);
    setRedoStack([]);
  }, [nodes, edges]);

  // ── Selection handling ──
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      const ids = selectedNodes.map((n) => n.id);
      setSelectedNodeIds(ids);
      if (ids.length === 1) {
        setSelectedNode(selectedNodes[0]);
      } else {
        setSelectedNode(null);
      }
    },
    [],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedNodeIds([node.id]);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedNodeIds([]);
  }, []);

  // ── Drag-and-drop from sidebar ──
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      pushUndo();

      let position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Clamp position to be within canvas bounds
      position = {
        x: Math.max(0, Math.min(position.x, canvasSize.width - 100)),
        y: Math.max(0, Math.min(position.y, canvasSize.height - 50)),
      };

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { ...(DEFAULT_DATA[type] || { label: type }) },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, pushUndo, canvasSize],
  );

  // ── Node actions ──
  const deleteSelectedNodes = useCallback(() => {
    if (selectedNodeIds.length === 0) return;
    pushUndo();
    setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          !selectedNodeIds.includes(e.source) &&
          !selectedNodeIds.includes(e.target),
      ),
    );
    setSelectedNode(null);
    setSelectedNodeIds([]);
  }, [selectedNodeIds, setNodes, setEdges, pushUndo]);

  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data } : n)));
      setSelectedNode((prev) =>
        prev && prev.id === nodeId ? { ...prev, data } : prev,
      );
    },
    [setNodes],
  );

  // ── Table cell edit listener ──
  useEffect(() => {
    const handler = (e: Event) => {
      const { nodeId: nid, row, col, value } = (e as CustomEvent).detail;
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nid) return n;
          const d = n.data as Record<string, unknown>;
          const cellData = (d.cellData as string[][]) || [];
          const updated = cellData.map((r, ri) =>
            ri === row ? r.map((c, ci) => (ci === col ? value : c)) : [...r],
          );
          return { ...n, data: { ...d, cellData: updated } };
        }),
      );
    };
    document.addEventListener("table-cell-edit", handler);
    return () => document.removeEventListener("table-cell-edit", handler);
  }, [setNodes]);

  // ── Undo / Redo ──
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, { nodes: [...nodes], edges: [...edges] }]);
    setUndoStack((u) => u.slice(0, -1));
    setNodes(prev.nodes);
    setEdges(prev.edges);
  }, [undoStack, nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((u) => [...u, { nodes: [...nodes], edges: [...edges] }]);
    setRedoStack((r) => r.slice(0, -1));
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [redoStack, nodes, edges, setNodes, setEdges]);

  // ── Clear all ──
  const clearCanvas = useCallback(() => {
    pushUndo();
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedNodeIds([]);
  }, [setNodes, setEdges, pushUndo]);

  // ── Save & Load (JSON) ──
  const saveCanvas = useCallback(() => {
    const allPages = pages.map((p) =>
      p.id === activePageId
        ? { ...p, nodes: [...nodes], edges: [...edges] }
        : p,
    );
    const data = JSON.stringify({ pages: allPages }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, "_").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, templateName, pages, activePageId]);

  const loadCanvas = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          pushUndo();
          // Support both old format (nodes/edges) and new multi-page format
          if (data.pages && Array.isArray(data.pages)) {
            setPages(data.pages);
            setActivePageId(data.pages[0]?.id ?? "");
            setNodes(data.pages[0]?.nodes ?? []);
            setEdges(data.pages[0]?.edges ?? []);
          } else {
            setNodes(data.nodes || []);
            setEdges(data.edges || []);
            if (data.templateName) setTemplateName(data.templateName);
          }
        } catch {
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges, pushUndo, setTemplateName]);

  // ── Alignment helpers ──
  const getSelectedNodes = useCallback(
    () => nodes.filter((n) => selectedNodeIds.includes(n.id)),
    [nodes, selectedNodeIds],
  );

  const alignNodes = useCallback(
    (type: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
      const sel = getSelectedNodes();
      if (sel.length < 2) return;
      pushUndo();

      const positions = sel.map((n) => n.position);
      let target: number;

      switch (type) {
        case "left":
          target = Math.min(...positions.map((p) => p.x));
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, x: target } }
                : n,
            ),
          );
          break;
        case "center": {
          const minX = Math.min(...positions.map((p) => p.x));
          const maxX = Math.max(...positions.map((p) => p.x));
          target = (minX + maxX) / 2;
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, x: target } }
                : n,
            ),
          );
          break;
        }
        case "right":
          target = Math.max(...positions.map((p) => p.x));
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, x: target } }
                : n,
            ),
          );
          break;
        case "top":
          target = Math.min(...positions.map((p) => p.y));
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, y: target } }
                : n,
            ),
          );
          break;
        case "middle": {
          const minY = Math.min(...positions.map((p) => p.y));
          const maxY = Math.max(...positions.map((p) => p.y));
          target = (minY + maxY) / 2;
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, y: target } }
                : n,
            ),
          );
          break;
        }
        case "bottom":
          target = Math.max(...positions.map((p) => p.y));
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, y: target } }
                : n,
            ),
          );
          break;
      }
    },
    [getSelectedNodes, selectedNodeIds, setNodes, pushUndo],
  );

  const distributeNodes = useCallback(
    (type: "horizontal" | "vertical") => {
      const sel = getSelectedNodes();
      if (sel.length < 3) return;
      pushUndo();

      const sorted = [...sel].sort((a, b) =>
        type === "horizontal"
          ? a.position.x - b.position.x
          : a.position.y - b.position.y,
      );
      const first = sorted[0].position;
      const last = sorted[sorted.length - 1].position;
      const gap =
        type === "horizontal"
          ? (last.x - first.x) / (sorted.length - 1)
          : (last.y - first.y) / (sorted.length - 1);

      const posMap = new Map<string, { x: number; y: number }>();
      sorted.forEach((n, i) => {
        posMap.set(n.id, {
          x: type === "horizontal" ? first.x + gap * i : n.position.x,
          y: type === "vertical" ? first.y + gap * i : n.position.y,
        });
      });

      setNodes((nds) =>
        nds.map((n) => {
          const pos = posMap.get(n.id);
          return pos ? { ...n, position: pos } : n;
        }),
      );
    },
    [getSelectedNodes, setNodes, pushUndo],
  );

  // ── Keyboard shortcuts ──
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelectedNodes();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    },
    [deleteSelectedNodes, undo, redo],
  );

  // Keep selected node reference up-to-date
  const currentSelectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNode?.id) || null,
    [nodes, selectedNode?.id],
  );

  // ── Canvas tab actions ──
  const addPage = useCallback(() => {
    // Save current page first
    setPages((prev) => {
      const updated = prev.map((p) =>
        p.id === activePageId
          ? { ...p, nodes: [...nodes], edges: [...edges] }
          : p,
      );
      const newPage = createNewPage(updated.length + 1);
      setActivePageId(newPage.id);
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      setSelectedNodeIds([]);
      setUndoStack([]);
      setRedoStack([]);
      return [...updated, newPage];
    });
  }, [activePageId, nodes, edges, setNodes, setEdges]);

  const deletePage = useCallback(
    (pageId: string) => {
      if (pages.length === 1) return; // must keep at least one
      setPages((prev) => {
        const idx = prev.findIndex((p) => p.id === pageId);
        const remaining = prev.filter((p) => p.id !== pageId);
        const nextPage = remaining[Math.max(0, idx - 1)];
        setActivePageId(nextPage.id);
        setNodes(nextPage.nodes);
        setEdges(nextPage.edges);
        setSelectedNode(null);
        setSelectedNodeIds([]);
        return remaining;
      });
    },
    [pages.length, setNodes, setEdges],
  );

  const startRename = useCallback((page: CanvasPage) => {
    setRenamingPageId(page.id);
    setRenameValue(page.name);
  }, []);

  const commitRename = useCallback(() => {
    if (!renamingPageId) return;
    setPages((prev) =>
      prev.map((p) =>
        p.id === renamingPageId
          ? { ...p, name: renameValue.trim() || p.name }
          : p,
      ),
    );
    setRenamingPageId(null);
    setRenameValue("");
  }, [renamingPageId, renameValue]);

  // ── Switch page handler ──
  const switchPage = useCallback(
    (pageId: string) => {
      if (pageId === activePageId) return;
      saveCurrentPage(pageId);
      setSelectedNode(null);
      setSelectedNodeIds([]);
      setUndoStack([]);
      setRedoStack([]);
    },
    [activePageId, saveCurrentPage],
  );

  return (
    <div className="flex flex-1 h-full overflow-hidden flex-col">
      {/* Center + Right column: Toolbar above, Canvas + Inspector below */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Toolbar */}
        <Toolbar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          onDeleteNode={deleteSelectedNodes}
          onUndo={undo}
          onRedo={redo}
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFitView={() =>
            fitBounds(
              {
                x: 0,
                y: 0,
                width: canvasSize.width,
                height: canvasSize.height,
              },
              { padding: 0.1 },
            )
          }
          onSave={saveCanvas}
          onLoad={loadCanvas}
          onClear={clearCanvas}
          templateName={templateName}
          setTemplateName={setTemplateName}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onAlignLeft={() => alignNodes("left")}
          onAlignCenter={() => alignNodes("center")}
          onAlignRight={() => alignNodes("right")}
          onAlignTop={() => alignNodes("top")}
          onAlignMiddle={() => alignNodes("middle")}
          onAlignBottom={() => alignNodes("bottom")}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          snapToGrid={snapToGrid}
          setSnapToGrid={setSnapToGrid}
          hasSelection={selectedNodeIds.length > 0}
          hasMultipleSelection={selectedNodeIds.length > 1}
          canvasSize={canvasSize}
          setCanvasSize={setCanvasSize}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          backgroundImage={backgroundImage}
          setBackgroundImage={setBackgroundImage}
        />

        {/* ── Canvas Tab Bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1e293b",
            borderBottom: "1px solid #334155",
            minHeight: 36,
            paddingLeft: 8,
            paddingRight: 8,
            gap: 2,
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          {pages.map((page) => {
            const isActive = page.id === activePageId;
            const isRenaming = renamingPageId === page.id;
            return (
              <div
                key={page.id}
                onClick={() => !isRenaming && switchPage(page.id)}
                onDoubleClick={() => startRename(page)}
                title="Double-click to rename"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 14px 4px 10px",
                  borderRadius: "6px 6px 0 0",
                  cursor: "pointer",
                  background: isActive ? "#ffffff" : "transparent",
                  border: isActive
                    ? "1px solid #e2e8f0"
                    : "1px solid transparent",
                  borderBottom: isActive ? "1px solid #ffffff" : "none",
                  color: isActive ? "#1e293b" : "#94a3b8",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  position: "relative",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                  userSelect: "none",
                }}
              >
                {/* Color dot */}
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: page.backgroundColor,
                    border: "1.5px solid #94a3b8",
                    flexShrink: 0,
                  }}
                />

                {isRenaming ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename();
                      if (e.key === "Escape") {
                        setRenamingPageId(null);
                        setRenameValue("");
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      border: "none",
                      outline: "1px solid #6366f1",
                      borderRadius: 3,
                      padding: "1px 4px",
                      fontSize: 13,
                      fontWeight: 600,
                      width: 80,
                      color: "#1e293b",
                      background: "#f8fafc",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      maxWidth: 120,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {page.name}
                  </span>
                )}

                {/* Delete tab button — only show when more than 1 page */}
                {pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(page.id);
                    }}
                    title="Delete this canvas"
                    style={{
                      marginLeft: 2,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: isActive ? "#64748b" : "#475569",
                      display: "flex",
                      alignItems: "center",
                      padding: "1px 2px",
                      borderRadius: 3,
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}

          {/* Add new canvas button */}
          <button
            onClick={addPage}
            title="Add new canvas"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "1px dashed #475569",
              borderRadius: 6,
              color: "#94a3b8",
              cursor: "pointer",
              width: 28,
              height: 26,
              fontSize: 18,
              marginLeft: 4,
              flexShrink: 0,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#6366f1";
              (e.currentTarget as HTMLButtonElement).style.color = "#818cf8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#475569";
              (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
            }}
          >
            +
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Canvas color quick-change */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginRight: 4,
            }}
          >
            <span
              style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap" }}
            >
              BG Color:
            </span>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              title="Change canvas background color"
              style={{
                width: 26,
                height: 22,
                border: "1px solid #475569",
                borderRadius: 4,
                cursor: "pointer",
                padding: 1,
                background: "none",
              }}
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <div
            ref={reactFlowWrapper}
            className="flex-1 h-full"
            onKeyDown={onKeyDown}
            tabIndex={0}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onSelectionChange={onSelectionChange}
              nodeTypes={NODE_TYPES}
              snapToGrid={snapToGrid}
              snapGrid={[16, 16]}
              minZoom={0.1}
              maxZoom={4}
              nodeExtent={[
                [0, 0],
                [canvasSize.width, canvasSize.height],
              ]}
              onInit={(instance) => {
                instance.fitBounds(
                  {
                    x: 0,
                    y: 0,
                    width: canvasSize.width,
                    height: canvasSize.height,
                  },
                  { padding: 0.1 },
                );
              }}
              deleteKeyCode={null}
              className="bg-gray-100"
            >
              <div
                style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  backgroundColor: backgroundColor,
                  backgroundImage: backgroundImage
                    ? `url(${backgroundImage})`
                    : undefined,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />
              {showGrid && (
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={16}
                  size={1}
                  color="#d1d5db"
                />
              )}
              <Controls
                position="bottom-left"
                showInteractive={false}
                className="shadow-lg! rounded-lg! border! border-gray-200!"
              />
              <MiniMap
                position="bottom-right"
                className="shadow-lg! rounded-lg! border! border-gray-200!"
                nodeColor="#6366f1"
                maskColor="rgba(0,0,0,0.08)"
                pannable
                zoomable
              />
            </ReactFlow>
          </div>
          <PropertiesPanel
            selectedNode={currentSelectedNode}
            selectedNodes={selectedNodeIds}
            nodes={nodes}
            onUpdateNode={updateNodeData}
            onClose={() => {
              setSelectedNode(null);
              setSelectedNodeIds([]);
            }}
            onSelectNode={(id) => {
              const node = nodes.find((n) => n.id === id);
              if (node) {
                setSelectedNode(node);
                setSelectedNodeIds([id]);
              }
            }}
            onAlign={alignNodes}
            onDistribute={distributeNodes}
          />
        </div>
      </div>
    </div>
  );
}
