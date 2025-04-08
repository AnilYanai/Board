import {create} from "zustand";

export const historyStore = create((set,get) => ({
    strokes: [],    //also used as undo stack
    redoStack: [], 

    //setters
    setStrokes: (strokes) => set({strokes: strokes}),
    setRedoStack: (redoStack) => set({redoStack: redoStack}),

    //getters
    getStrokes: () => get().strokes,
    getRedoStack: () => get().redoStack,
}));