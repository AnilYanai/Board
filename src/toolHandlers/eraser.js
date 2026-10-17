import { canvasStore } from "../store/canvasStore";
import { historyStore } from "../store/historyStore";
import { getEventCanvasPoint } from "../utils/coordinates";

export const eraser = {
  onMouseDown: (e) => {
    const canvas = canvasStore.getState().getCanvasRef();
    if (!canvas) return;

    const screenPoint = getEventCanvasPoint(e, canvas);
    const { screenToWorld, getZoomLevel, forceUpdate } = canvasStore.getState();
    const worldPoint = screenToWorld(screenPoint.x, screenPoint.y);

    const eraserRadius = 25 / getZoomLevel(); // World radius scaled with zoom

    const strokes = historyStore.getState().getStrokes();
    const setStrokes = historyStore.getState().setStrokes;

    let strokeToDelete = strokes.find((stroke) => {
      if (stroke.status !== "active") return false;
      return stroke.points.some((point) => {
        const distance = Math.hypot(point.x - worldPoint.x, point.y - worldPoint.y);
        return distance <= eraserRadius;
      });
    });

    if (strokeToDelete) {
      strokeToDelete.status = "inactive";
      const cloned = JSON.parse(JSON.stringify(strokeToDelete));
      cloned.status = "deleted";
      setStrokes([...strokes, cloned]);
      forceUpdate();
    }
  },

  onMouseMove: (e) => {
    if (e.buttons === 1) {
      eraser.onMouseDown(e);
    }
  },

  onMouseUp: () => {},

  onTouchStart: (e) => {
    eraser.onMouseDown(e);
  },

  onTouchMove: (e) => {
    eraser.onMouseDown(e);
  },

  onTouchEnd: () => {},
};