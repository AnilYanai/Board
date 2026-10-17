import { create } from "zustand";

export const canvasStore = create((set, get) => ({
  canvasRef: null,
  triggerRender: false, // Dummy state for forcing re-render
  zoomLevel: 1, // Default zoom level
  panOffset: { x: 0, y: 0 }, // Pan camera offset

  // dummy state to force re-render the canvas
  forceUpdate: () => set((state) => ({ triggerRender: !state.triggerRender })),

  // setters
  setCanvasRef: (ref) => set({ canvasRef: ref }),
  setZoomLevel: (zoom) =>
    set((state) =>
      typeof zoom === "function" ? { zoomLevel: zoom(state.zoomLevel) } : { zoomLevel: zoom }
    ),
  setPanOffset: (pan) =>
    set((state) =>
      typeof pan === "function" ? { panOffset: pan(state.panOffset) } : { panOffset: pan }
    ),

  // getters
  getCanvasRef: () => get().canvasRef,
  getZoomLevel: () => get().zoomLevel,
  getPanOffset: () => get().panOffset,

  // Coordinate transforms
  screenToWorld: (screenX, screenY) => {
    const { panOffset, zoomLevel } = get();
    return {
      x: (screenX - panOffset.x) / zoomLevel,
      y: (screenY - panOffset.y) / zoomLevel,
    };
  },
  worldToScreen: (worldX, worldY) => {
    const { panOffset, zoomLevel } = get();
    return {
      x: worldX * zoomLevel + panOffset.x,
      y: worldY * zoomLevel + panOffset.y,
    };
  },
}));