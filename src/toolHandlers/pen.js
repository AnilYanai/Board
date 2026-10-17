import { canvasStore } from "../store/canvasStore";
import { toolStore } from "../store/toolStore";
import { historyStore } from "../store/historyStore";
import { generateId } from "../utils/idGenerator";
import { userStore } from "../store/userStore";
import { getEventCanvasPoint } from "../utils/coordinates";

export const pen = {
  onMouseDown: (e, getCurrentStroke, setCurrentStroke) => {
    const canvas = canvasStore.getState().getCanvasRef();
    if (!canvas) return;

    const screenPoint = getEventCanvasPoint(e, canvas);
    const worldPoint = canvasStore.getState().screenToWorld(screenPoint.x, screenPoint.y);

    const getTool = toolStore.getState().getTool;
    const getToolSize = toolStore.getState().getToolSize;
    const getToolColor = toolStore.getState().getToolColor;
    const getUser = userStore.getState().getUser;

    const newStroke = {
      id: generateId() + getUser(),
      status: "active",
      author: getUser(),
      type: getTool(),
      color: getToolColor(),
      width: getToolSize(),
      points: [worldPoint],
    };
    setCurrentStroke(newStroke);

    // Render dot immediately upon touch/click
    const { panOffset, zoomLevel } = canvasStore.getState();
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.fillStyle = newStroke.color;
    ctx.beginPath();
    ctx.arc(worldPoint.x, worldPoint.y, newStroke.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  onMouseMove: (e, getCurrentStroke) => {
    if (e.buttons !== undefined && e.buttons !== 1) return;
    const current = getCurrentStroke();
    if (!current) return;

    const canvas = canvasStore.getState().getCanvasRef();
    if (!canvas) return;

    const screenPoint = getEventCanvasPoint(e, canvas);
    const worldPoint = canvasStore.getState().screenToWorld(screenPoint.x, screenPoint.y);
    current.points.push(worldPoint);

    const { panOffset, zoomLevel } = canvasStore.getState();
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = current.color;
    ctx.lineWidth = current.width;

    ctx.beginPath();
    const len = current.points.length;
    if (len >= 2) {
      ctx.moveTo(current.points[len - 2].x, current.points[len - 2].y);
      ctx.lineTo(current.points[len - 1].x, current.points[len - 1].y);
      ctx.stroke();
    }
    ctx.restore();
  },

  onMouseUp: (e, getCurrentStroke, setCurrentStroke) => {
    const current = getCurrentStroke();
    if (current) {
      const getStrokes = historyStore.getState().getStrokes;
      const setStrokes = historyStore.getState().setStrokes;
      setStrokes([...getStrokes(), current]);
      setCurrentStroke(null);
    }
  },

  onTouchStart: (e, getCurrentStroke, setCurrentStroke) => {
    pen.onMouseDown(e, getCurrentStroke, setCurrentStroke);
  },

  onTouchMove: (e, getCurrentStroke, setCurrentStroke) => {
    pen.onMouseMove(e, getCurrentStroke, setCurrentStroke);
  },

  onTouchEnd: (e, getCurrentStroke, setCurrentStroke) => {
    pen.onMouseUp(e, getCurrentStroke, setCurrentStroke);
  },

  drawStroke: (ctx, stroke) => {
    if (!stroke.points || stroke.points.length === 0) return;
    ctx.save();

    if (stroke.points.length === 1) {
      // Single tap/click dot
      const p = stroke.points[0];
      ctx.fillStyle = stroke.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, stroke.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      stroke.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }

    ctx.restore();
  },
};