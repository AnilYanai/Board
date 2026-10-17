import { useRef, useLayoutEffect, useCallback } from "react";
import { canvasStore } from "../store/canvasStore";
import { historyStore } from "../store/historyStore";
import { toolStore } from "../store/toolStore";
import { pen } from "../toolHandlers/pen";
import { eraser } from "../toolHandlers/eraser";
import { pan } from "../toolHandlers/pan";
import { selection } from "../toolHandlers/selection";

const toolRegistry = {
  pen,
  eraser,
  pan,
  select: selection,
  selection,
};

function useDrawingActions() {
  const triggerRender = canvasStore((state) => state.triggerRender);
  const canvasRef = canvasStore((state) => state.canvasRef);

  const currentStroke = useRef(null);
  const setCurrentStroke = (newStroke) => {
    currentStroke.current = newStroke;
  };
  const getCurrentStroke = () => currentStroke.current;

  const redrawCanvas = useCallback(() => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext("2d");
    const { panOffset, zoomLevel } = canvasStore.getState();

    // Clear viewport
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

    ctx.save();
    // Apply camera transform to context
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);

    const strokes = historyStore.getState().getStrokes();
    const alreadyVisitedID = new Set();

    // Viewport boundaries in world coordinates for virtual culling
    const viewLeft = -panOffset.x / zoomLevel;
    const viewTop = -panOffset.y / zoomLevel;
    const viewRight = (-panOffset.x + canvasRef.width) / zoomLevel;
    const viewBottom = (-panOffset.y + canvasRef.height) / zoomLevel;

    const visibleStrokes = [];

    // Traverse backwards to get the latest status for each stroke id
    for (let i = strokes.length - 1; i >= 0; i--) {
      const stroke = strokes[i];
      if (alreadyVisitedID.has(stroke.id)) continue;
      alreadyVisitedID.add(stroke.id);

      if (stroke.status === "deleted") continue;
      if (!stroke.points || stroke.points.length === 0) continue;

      // Virtual viewport culling: check if stroke bounding box intersects the screen
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      for (let p = 0; p < stroke.points.length; p++) {
        const pt = stroke.points[p];
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
      }

      const padding = (stroke.width || 5) * 2;
      const isVisible = !(
        maxX + padding < viewLeft ||
        minX - padding > viewRight ||
        maxY + padding < viewTop ||
        minY - padding > viewBottom
      );

      if (isVisible) {
        // Place in unshift so older strokes are drawn first (correct z-order)
        visibleStrokes.unshift(stroke);
      }
    }

    // Render visible strokes
    for (const stroke of visibleStrokes) {
      const toolHandler = toolRegistry[stroke.type];
      if (toolHandler?.drawStroke) {
        toolHandler.drawStroke(ctx, stroke);
      }
    }

    ctx.restore();
  }, [canvasRef]);

  useLayoutEffect(() => {
    if (!canvasRef) return;
    redrawCanvas();
  }, [triggerRender, canvasRef, redrawCanvas]);

  const mouseDownHandler = (e) => {
    const toolHandlers = toolStore.getState().getToolHandlers();
    if (toolHandlers?.onMouseDown) {
      toolHandlers.onMouseDown(e, getCurrentStroke, setCurrentStroke);
    }
  };

  const mouseMoveHandler = (e) => {
    const toolHandlers = toolStore.getState().getToolHandlers();
    if (toolHandlers?.onMouseMove) {
      toolHandlers.onMouseMove(e, getCurrentStroke, setCurrentStroke);
    }
  };

  const mouseUpHandler = (e) => {
    const toolHandlers = toolStore.getState().getToolHandlers();
    if (toolHandlers?.onMouseUp) {
      toolHandlers.onMouseUp(e, getCurrentStroke, setCurrentStroke);
    }
  };

  const touchStartHandler = (e) => {
    const toolHandlers = toolStore.getState().getToolHandlers();
    if (toolHandlers?.onTouchStart) {
      toolHandlers.onTouchStart(e, getCurrentStroke, setCurrentStroke);
    }
  };

  const touchMoveHandler = (e) => {
    const toolHandlers = toolStore.getState().getToolHandlers();
    if (toolHandlers?.onTouchMove) {
      toolHandlers.onTouchMove(e, getCurrentStroke, setCurrentStroke);
    }
  };

  const touchEndHandler = (e) => {
    const toolHandlers = toolStore.getState().getToolHandlers();
    if (toolHandlers?.onTouchEnd) {
      toolHandlers.onTouchEnd(e, getCurrentStroke, setCurrentStroke);
    }
  };

  return {
    redrawCanvas,
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
    touchStartHandler,
    touchMoveHandler,
    touchEndHandler,
  };
}

export default useDrawingActions;
