import { canvasStore } from "../store/canvasStore";
import { toolStore } from "../store/toolStore";
import { historyStore } from "../store/historyStore";


export const pen = {
  
  onMouseDown: (e, currentStroke, setCurrentStroke) => {
    const getCanvasRef = canvasStore.getState().getCanvasRef; 
    const getTool = toolStore.getState().getTool; 
    const getToolSize = toolStore.getState().getToolSize; 
    const getToolColor = toolStore.getState().getToolColor; 
    
    if (!getCanvasRef()) return;
    const ctx = getCanvasRef().getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const { offsetX, offsetY } = e.nativeEvent;

    const newStroke = {
      author: "user",
      type: getTool(),
      color: getToolColor(),
      width: getToolSize(),
      points: [{ x: offsetX, y: offsetY }],
    };
    setCurrentStroke(newStroke);
  },

  onMouseMove: (e, currentStroke, setCurrentStroke) => {
    const getCanvasRef = canvasStore.getState().getCanvasRef; //to access the zustand methods 
    const getToolSize = toolStore.getState().getToolSize; //to access the zustand methods
    const getToolColor = toolStore.getState().getToolColor; //to access the zustand methods


    if (e.buttons !== 1) return;  // Check if the left mouse button is pressed


    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
    setCurrentStroke((prevStroke) => {
      if (prevStroke) {
        return {
          ...prevStroke,
          points: [...prevStroke.points, newPoint],
        };
      }
      return prevStroke;
    });

    const ctx = getCanvasRef().getContext("2d");
    ctx.strokeStyle = getToolColor();
    ctx.lineWidth = getToolSize();
    ctx.beginPath();
    const points = currentStroke.points;
    console.log("points", points);
    if (points.length > 0) {
      ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  },

  onMouseUp: (e, currentStroke, setCurrentStroke) => {
    const setStrokes = historyStore.getState().setStrokes; //to access the zustand methods
    const getStrokes = historyStore.getState().getStrokes; //to access the zustand methods
    if (currentStroke) {
      setStrokes([...getStrokes(), currentStroke]);
      setCurrentStroke(null);
    }
    console.log("strokes after stop drawing", getStrokes());
  }
};