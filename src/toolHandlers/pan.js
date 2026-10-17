import { canvasStore } from "../store/canvasStore";
import { getEventCanvasPoint } from "../utils/coordinates";

export const pan = {
  onMouseDown: (e, getCurrentStroke, setCurrentStroke) => {
    const canvas = canvasStore.getState().getCanvasRef();
    if (!canvas) return;

    const screenPoint = getEventCanvasPoint(e, canvas);
    const panOffset = canvasStore.getState().getPanOffset();

    setCurrentStroke({
      startX: screenPoint.x,
      startY: screenPoint.y,
      initialPanX: panOffset.x,
      initialPanY: panOffset.y,
    });
  },

  onMouseMove: (e, getCurrentStroke) => {
    if (e.buttons !== undefined && e.buttons !== 1) return;
    const current = getCurrentStroke();
    if (!current) return;

    const canvas = canvasStore.getState().getCanvasRef();
    if (!canvas) return;

    const screenPoint = getEventCanvasPoint(e, canvas);
    const deltaX = screenPoint.x - current.startX;
    const deltaY = screenPoint.y - current.startY;

    const setPanOffset = canvasStore.getState().setPanOffset;
    const forceUpdate = canvasStore.getState().forceUpdate;

    setPanOffset({
      x: current.initialPanX + deltaX,
      y: current.initialPanY + deltaY,
    });
    forceUpdate();
  },

  onMouseUp: (e, getCurrentStroke, setCurrentStroke) => {
    setCurrentStroke(null);
  },

  onTouchStart: (e, getCurrentStroke, setCurrentStroke) => {
    pan.onMouseDown(e, getCurrentStroke, setCurrentStroke);
  },

  onTouchMove: (e, getCurrentStroke, setCurrentStroke) => {
    pan.onMouseMove(e, getCurrentStroke, setCurrentStroke);
  },

  onTouchEnd: (e, getCurrentStroke, setCurrentStroke) => {
    pan.onMouseUp(e, getCurrentStroke, setCurrentStroke);
  },
};
