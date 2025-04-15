import { canvasStore } from "../store/canvasStore";
import { toolStore } from "../store/toolStore";
import { historyStore } from "../store/historyStore";
import { generateId } from "../utils/idGenerator";
import { userStore } from "../store/userStore";


export const pen = {

  onMouseDown: (e, getCurrentStroke, setCurrentStroke) => {
    const getCanvasRef = canvasStore.getState().getCanvasRef;
    const getTool = toolStore.getState().getTool;
    const getToolSize = toolStore.getState().getToolSize;
    const getToolColor = toolStore.getState().getToolColor;
    const getUser = userStore.getState().getUser; //to access the zustand methods

    if (!getCanvasRef()) return;
    const ctx = getCanvasRef().getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const { offsetX, offsetY } = e.nativeEvent;

    const newStroke = {
      id: generateId() + getUser(),
      status: "active",
      author: getUser(),
      type: getTool(),
      color: getToolColor(),
      width: getToolSize(),
      points: [{ x: offsetX, y: offsetY }],
    };
    setCurrentStroke(newStroke);
    // console.log("newStroke inside onMouseDown", getCurrentStroke());
  },

  onMouseMove: (e, getCurrentStroke ,setCurrentStroke) => {
    const getCanvasRef = canvasStore.getState().getCanvasRef;
    const getToolSize = toolStore.getState().getToolSize; 
    const getToolColor = toolStore.getState().getToolColor; 

    if (e.buttons !== 1) return;  // Check if the left mouse button is pressed

    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
   
    if (getCurrentStroke()) {
      getCurrentStroke().points.push(newPoint);
    }

    const ctx = getCanvasRef().getContext("2d");
    ctx.strokeStyle = getToolColor();
    ctx.lineWidth = getToolSize();
    ctx.beginPath();
    const points = getCurrentStroke().points;
    
    const len = points.length;
    if (len >= 2) {
      ctx.moveTo(points[len - 2].x, points[len - 2].y);
      ctx.lineTo(points[len - 1].x, points[len - 1].y);
      ctx.stroke();
    }
    // console.log("curentStroke", getCurrentStroke());
  },

  onMouseUp: ( e,getCurrentStroke, setCurrentStroke) => {
    const setStrokes = historyStore.getState().setStrokes; 
    const getStrokes = historyStore.getState().getStrokes; 
    // console.log("getCurrentStroke", getCurrentStroke);
    if (getCurrentStroke()) {
      setStrokes([...getStrokes(), getCurrentStroke()]);
      setCurrentStroke(null);
    }
  },

  drawStroke: (ctx, stroke) => {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    const points = stroke.points;

    ctx.beginPath();
    if (points.length > 0) {
      stroke.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }
  }
};