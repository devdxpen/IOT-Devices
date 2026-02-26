import { create } from 'zustand'

export type WidgetType = 'text' | 'rectangle' | 'circle' | 'sensor'

export interface Widget {
  id: string
  type: WidgetType
  x: number
  y: number
  w: number
  h: number
  // 'any' ne badle aa type use karo
  data?: Record<string, unknown>
}

interface CanvasState {
  widgets: Widget[]
  addWidget: (widget: Widget) => void
  updateWidget: (id: string, updates: Partial<Widget>) => void
  selectedId: string | null
  selectWidget: (id: string | null) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  widgets: [],
  selectedId: null,
  addWidget: (widget) => set((state) => ({ widgets: [...state.widgets, widget] })),
  updateWidget: (id, updates) =>
    set((state) => ({
      widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    })),
  selectWidget: (id) => set({ selectedId: id }),
}))