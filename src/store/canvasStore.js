import { create } from "zustand";  

export const canvasStore = create((set,get) => ({ 
    canvasRef: null,
    triggerRender: false, // Dummy state for forcing re-render

    //its a dummy state to force re-render the component
    forceUpdate: () => set((state) => ({ triggerRender: !state.triggerRender })),

    //setters
    setCanvasRef: (ref) => set({ canvasRef: ref }),

    //getters
    getCanvasRef: () => get().canvasRef
}));