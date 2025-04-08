import React, { useRef, useState, useEffect } from "react";
import { canvasStore } from "../store/canvasStore";
import { historyStore } from "../store/historyStore";
import { toolStore } from "../store/toolStore";

function useDrawingActions() {
  console.log("useDrawingActions Hook");
  const triggerRender = canvasStore(state => state.triggerRender); //this will cause re-render because it subscibes to the state changes in useffect
  const canvasRef = canvasStore(state => state.canvasRef); //to access zustand state it will cause re-render of the component

  useEffect(() => {
    console.log("inside useDrawingActions useEffect");
    console.log("canvasRef", canvasRef);
    if (!canvasRef) return;
    redrawCanvas();
}, [triggerRender]); 

  const [currentStroke, setCurrentStroke] = useState(null); //it will act like a common memory for mouse events

  const getStrokes  = historyStore.getState().getStrokes; 
  const getToolHandlers = toolStore.getState().getToolHandlers;
  

    const redrawCanvas = () => {
      const ctx = canvasRef.getContext("2d"); 
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

      getStrokes().forEach((stroke) => {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.width;
          console.log("linewidth ====>", stroke.width);
          ctx.beginPath();
          stroke.points.forEach((point, index) => {
              if (index === 0) {
                  ctx.moveTo(point.x, point.y);
              } else {
                  ctx.lineTo(point.x, point.y);
              }
          });
          ctx.stroke();
      });
  };

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
