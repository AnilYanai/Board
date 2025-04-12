import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { canvasStore } from "../store/canvasStore";
import { historyStore } from "../store/historyStore";
import { toolStore } from "../store/toolStore";
import { TOOLS } from "../constants/tools";

function useDrawingActions() {
  console.log("useDrawingActions Hook");
  const triggerRender = canvasStore(state => state.triggerRender); //this will cause re-render because it subscibes to the state changes in useffect
  const canvasRef = canvasStore(state => state.canvasRef); //to access zustand state it will cause re-render of the component

  const [currentStroke, setCurrentStroke] = useState(null); //it will act like a common memory for mouse events

  const getStrokes = historyStore.getState().getStrokes;
  const getToolHandlers = toolStore.getState().getToolHandlers;

  const toolModule = import.meta.glob('../toolHandlers/*.js');
  const alreadyLoadedTool = useRef(new Map()); // Track loaded tool handlers


  useLayoutEffect(() => {
    console.log("inside useDrawingActions useEffect");
    console.log("canvasRef", canvasRef);
    if (!canvasRef) return;
    redrawCanvas();
  }, [triggerRender]);

  const redrawCanvas = async () => {
    const ctx = canvasRef.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    let strokes = getStrokes();
    const alreadyVisitedID = new Set();

    for (let i = strokes.length - 1; i >= 0; i--) {
      const stroke = strokes[i];
      
      if (alreadyVisitedID.has(stroke.id)) continue; // Skip already visited strokes
      alreadyVisitedID.add(stroke.id); 
      
      if (stroke.points.length === 0) continue; // Skip empty strokes
      if (stroke.status === "deleted") continue; // Skip inactive strokes

      if (stroke.status === "inactive" ) stroke.status="active"; //if all the above conditions are false then the stroke must be drawn in canvas anyway, so set it to active
      
      const toolHandler = await loadToolHandler(stroke.type); // Load the tool handler dynamically

      if (toolHandler?.drawStroke) {
        toolHandler.drawStroke(ctx, stroke);
      } else {
        console.warn(`drawStroke not found for tool: ${stroke.type}`);
      }

    };
  };

  const loadToolHandler = async (toolType) => {
    if (alreadyLoadedTool.current.has(toolType)) {
      return alreadyLoadedTool.current.get(toolType); // Return cached tool handler if already loaded
    }

    console.log("Loaded tool", alreadyLoadedTool);
    const toolPath = `../toolHandlers/${toolType}.js`;
    try {
      const toolModuleResult = await toolModule[toolPath]();
      alreadyLoadedTool.current.set(toolType, toolModuleResult[toolType]); // Cache the loaded tool handler
      return toolModuleResult[toolType]; // e.g. toolModule.pen
    } catch (err) {
      console.error(`Error loading tool module for type: ${toolType}`, err);
    }
  }

  const mouseDownHandler = (e) => {
    const toolHandlers = getToolHandlers(); // Get the current tool handlers from the store
    if (toolHandlers.onMouseDown) {
      toolHandlers.onMouseDown(e, currentStroke, setCurrentStroke); // Call the onMouseDown handler of the current tool
    }
  }

  const mouseMoveHandler = (e) => {
    const toolHandlers = getToolHandlers(); // Get the current tool handlers from the store
    if (toolHandlers.onMouseMove) {
      toolHandlers.onMouseMove(e, currentStroke, setCurrentStroke); // Call the onMouseMove handler of the current tool
    }
  }

  const mouseUpHandler = (e) => {
    const toolHandlers = getToolHandlers(); // Get the current tool handlers from the store
    if (toolHandlers.onMouseUp) {
      toolHandlers.onMouseUp(e, currentStroke, setCurrentStroke); // Call the onMouseUp handler of the current tool
    }
  }


  return {
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler
  };
};

export default useDrawingActions;
