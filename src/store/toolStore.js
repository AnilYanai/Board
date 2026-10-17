import { create } from "zustand";

export const toolStore = create((set, get) => ({
    selectedTool: "pen",
    toolSize: 5,
    toolColor: "black",
    toolHandlers: {
        onMouseDown: null,
        onMouseMove: null,
        onMouseUp: null,
        onTouchStart: null,
        onTouchMove: null,
        onTouchEnd: null,
    },

    //setter methods
    setTool: (tool) => set({ selectedTool: tool }),
    setToolSize: (size) => set({ toolSize: size }),
    setToolColor: (color) => set({ toolColor: color }),
    // Dynamically set active tool and all its mouse handlers
    setToolHandlers: (handlers) =>
        set({
            toolHandlers: {
                onMouseDown: handlers.onMouseDown,
                onMouseMove: handlers.onMouseMove,
                onMouseUp: handlers.onMouseUp,
                onTouchStart: handlers.onTouchStart,
                onTouchMove: handlers.onTouchMove,
                onTouchEnd: handlers.onTouchEnd,
            },
        }),


    //getter methods
    getTool: () => get().selectedTool,
    getToolSize: () => get().toolSize,
    getToolColor: () => get().toolColor,
    getToolHandlers: () => get().toolHandlers,
}));