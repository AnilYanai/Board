import { create } from "zustand";

export const canvasStore = create((set, get) => ({
  canvasRef: null,
  triggerRender: false, // Dummy state for forcing re-render
  zoomLevel: 1, // Default zoom level

  //its a dummy state to force re-render the component
  forceUpdate: () => set((state) => ({ triggerRender: !state.triggerRender })),

  //setters
  setCanvasRef: (ref) => set({ canvasRef: ref }),
  setZoomLevel: (zoom) =>
    set((state) =>
      typeof zoom === "function" ? { zoomLevel: zoom(state.zoomLevel) } : { zoomLevel: zoom }
    ),

  //getters
  getCanvasRef: () => get().canvasRef,
  getZoomLevel: () => get().zoomLevel,

}));