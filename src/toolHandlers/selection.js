import { historyStore } from "../store/historyStore";
import { canvasStore } from "../store/canvasStore";
import { getEventCanvasPoint } from "../utils/coordinates";

export const selection = {
  onMouseDown: (e, getCurrentStroke, setCurrentStroke) => {
    if (e.button !== undefined && e.button !== 0) return;
    const canvas = canvasStore.getState().getCanvasRef();
    if (!canvas) return;

    const screenPoint = getEventCanvasPoint(e, canvas);
    const { screenToWorld, getZoomLevel } = canvasStore.getState();
    const worldPoint = screenToWorld(screenPoint.x, screenPoint.y);

    const selectionRadius = 25 / getZoomLevel();
    const strokes = historyStore.getState().getStrokes();

    const selectedStroke = strokes.find((stroke) => {
      if (stroke.status !== "active") return false;
      return stroke.points.some((point) => {
        const distance = Math.hypot(point.x - worldPoint.x, point.y - worldPoint.y);
        return distance <= selectionRadius;
      });
    });

    const isShift = e.shiftKey || e.nativeEvent?.shiftKey;
    let newSelection = [];
    const current = getCurrentStroke();

    if (selectedStroke) {
      if (isShift && current?.selectedStrokes) {
        const alreadySelected = current.selectedStrokes.some((s) => s.id === selectedStroke.id);
        newSelection = alreadySelected
          ? current.selectedStrokes
          : [...current.selectedStrokes, selectedStroke];
      } else {
        newSelection = [selectedStroke];
      }
    }

    setCurrentStroke({
      selectedStrokes: newSelection,
      lastWorldX: worldPoint.x,
      lastWorldY: worldPoint.y,
    });
  },

  onMouseMove: (e, getCurrentStroke, setCurrentStroke) => {
    if (e.buttons !== undefined && e.buttons !== 1) return;
    const current = getCurrentStroke();
    if (!current || !current.selectedStrokes || current.selectedStrokes.length === 0) return;

    const canvas = canvasStore.getState().getCanvasRef();
    if (!canvas) return;

    const screenPoint = getEventCanvasPoint(e, canvas);
    const { screenToWorld, forceUpdate } = canvasStore.getState();
    const worldPoint = screenToWorld(screenPoint.x, screenPoint.y);

    const deltaX = worldPoint.x - current.lastWorldX;
    const deltaY = worldPoint.y - current.lastWorldY;

    current.selectedStrokes.forEach((stroke) => {
      stroke.points.forEach((point) => {
        point.x += deltaX;
        point.y += deltaY;
      });
    });

    setCurrentStroke({
      ...current,
      lastWorldX: worldPoint.x,
      lastWorldY: worldPoint.y,
    });

    forceUpdate();
  },

  onMouseUp: () => {},

  onTouchStart: (e, getCurrentStroke, setCurrentStroke) => {
    selection.onMouseDown(e, getCurrentStroke, setCurrentStroke);
  },

  onTouchMove: (e, getCurrentStroke, setCurrentStroke) => {
    selection.onMouseMove(e, getCurrentStroke, setCurrentStroke);
  },

  onTouchEnd: (e, getCurrentStroke, setCurrentStroke) => {
    selection.onMouseUp(e, getCurrentStroke, setCurrentStroke);
  },

  drawStroke: null,
};