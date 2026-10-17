'use client';

import { historyStore } from "../store/historyStore";
import { canvasStore } from "../store/canvasStore";

export const useActionBar = () => {
  const setStrokes = historyStore.getState().setStrokes;
  const setRedoStack = historyStore.getState().setRedoStack;
  const getCanvasRef = canvasStore.getState().getCanvasRef;
  const forceUpdate = canvasStore.getState().forceUpdate;
  const getStrokes = historyStore.getState().getStrokes;
  const getRedoStack = historyStore.getState().getRedoStack;

  const undo = () => {
    const strokes = getStrokes();
    if (strokes.length === 0) return;

    const lastStroke = strokes[strokes.length - 1];
    setRedoStack([...getRedoStack(), lastStroke]);
    setStrokes(strokes.slice(0, -1));
    forceUpdate();
  };

  const redo = () => {
    const redoStack = getRedoStack();
    if (redoStack.length === 0) return;

    const lastRedo = redoStack[redoStack.length - 1];
    setStrokes([...getStrokes(), lastRedo]);
    setRedoStack(redoStack.slice(0, -1));
    forceUpdate();
  };

  const saveCanvas = () => {
    const canvas = getCanvasRef();
    if (!canvas) return;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    link.click();
  };

  const clearCanvas = () => {
    setStrokes([]);
    setRedoStack([]);
    forceUpdate();
  };

  return { undo, redo, saveCanvas, clearCanvas };
};