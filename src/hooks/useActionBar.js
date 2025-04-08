import { historyStore } from '../store/historyStore';
import { canvasStore } from '../store/canvasStore';

export const useActionBar = () => {

    console.log("useActionBar Hook");

    const setStrokes = historyStore.getState().setStrokes; 
    const setRedoStack = historyStore.getState().setRedoStack;
    const getCanvasRef = canvasStore.getState().getCanvasRef;
    const forceUpdate = canvasStore.getState().forceUpdate; 
    const getStrokes = historyStore.getState().getStrokes; 
    const getRedoStack = historyStore.getState().getRedoStack; 
    //if i access zustand store values using .getState() will not re-render the component when the value changes.

    const undo = () => {
        console.log("undo function called");
        console.log(getStrokes().length);
        
        if (getStrokes().length === 0) return;
        console.log("undo function called");
        const lastStroke = getStrokes()[getStrokes().length - 1];

        setRedoStack([...getRedoStack(), lastStroke]); // Add to redoStack
        setStrokes(getStrokes().slice(0, -1)); // Remove last stroke
        forceUpdate(); // Force update the canvas
    };

    const redo = () => {
        console.log("redo function called");
        if (getRedoStack().length === 0) return;
        // Get the last redo stroke
        const lastRedo = getRedoStack()[getRedoStack().length - 1];

        // Update Zustand store correctly
        setStrokes([...getStrokes(), lastRedo]); // Add to strokes
        setRedoStack(getRedoStack().slice(0, -1)); // Remove from redoStack
        forceUpdate(); // Force update the canvas
    };

    const saveCanvas = () => {
        console.log("saveCanvas function called");
        const canvas = getCanvasRef(); // Get the canvas reference from Zustand store
        const dataURL = canvas.toDataURL(); // Convert the canvas to a base64 image
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "drawing.png"; // Set the file name
        link.click(); // Trigger the download
    };

    const clearCanvas = () => {
        // const ctx = ctxRef.current;
        // const ctx = getCanvasRef().current.getContext("2d");
        // ctx.clearRect(0, 0, getCanvasRef().current.width, getCanvasRef().current.height);
        setStrokes([]);
    };
    return { undo, redo, saveCanvas, clearCanvas };
}