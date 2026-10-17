import { useRef, useEffect, useLayoutEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { canvasStore } from "../store/canvasStore";
import useDrawingActions from "../hooks/useDrawingActions";

const CanvasWrapper = styled.div`
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-color: #f1f1f1;
  position: relative;
  touch-action: none; /* Prevents mobile browser gesture interception */
`;

const StyledCanvas = styled.canvas`
  background-color: #ffffff;
  position: absolute;
  top: 0;
  left: 0;
  display: block;
`;

function CanvasBoard() {
  const canvasReference = useRef(null);
  const pinchState = useRef({
    isPinching: false,
    initialDistance: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    initialMidpoint: { x: 0, y: 0 },
  });

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const setCanvasRef = canvasStore((state) => state.setCanvasRef);
  const setZoomLevel = canvasStore((state) => state.setZoomLevel);
  const setPanOffset = canvasStore((state) => state.setPanOffset);
  const forceUpdate = canvasStore((state) => state.forceUpdate);

  const {
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
    touchStartHandler,
    touchMoveHandler,
    touchEndHandler,
  } = useDrawingActions();

  // Resize handler to adjust canvas size dynamically to the viewport
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    forceUpdate();
  }, [forceUpdate]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useLayoutEffect(() => {
    setCanvasRef(canvasReference.current);
  }, [setCanvasRef]);

  // Touch and wheel event management
  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const { panOffset, zoomLevel } = canvasStore.getState();

      if (e.ctrlKey || e.metaKey) {
        // Zooming around cursor
        const zoomFactor = 1 - e.deltaY * 0.002;
        const nextZoom = Math.min(Math.max(zoomLevel * zoomFactor, 0.1), 10);
        if (nextZoom === zoomLevel) return;

        const worldX = (mouseX - panOffset.x) / zoomLevel;
        const worldY = (mouseY - panOffset.y) / zoomLevel;

        const newPanX = mouseX - worldX * nextZoom;
        const newPanY = mouseY - worldY * nextZoom;

        setZoomLevel(nextZoom);
        setPanOffset({ x: newPanX, y: newPanY });
        forceUpdate();
      } else {
        // Panning with wheel / trackpad
        setPanOffset({
          x: panOffset.x - e.deltaX,
          y: panOffset.y - e.deltaY,
        });
        forceUpdate();
      }
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        // Multi-touch pinch zoom & pan initiation
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const midpoint = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };
        const { panOffset, zoomLevel } = canvasStore.getState();

        pinchState.current = {
          isPinching: true,
          initialDistance: distance,
          initialZoom: zoomLevel,
          initialPan: { ...panOffset },
          initialMidpoint: midpoint,
        };
      } else if (e.touches.length === 1 && !pinchState.current.isPinching) {
        touchStartHandler(e);
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 2 && pinchState.current.isPinching) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const midpoint = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };

        const { initialDistance, initialZoom, initialPan, initialMidpoint } =
          pinchState.current;

        if (initialDistance <= 0) return;

        const scale = distance / initialDistance;
        const nextZoom = Math.min(Math.max(initialZoom * scale, 0.1), 10);

        // Center zoom on initial midpoint
        const worldX = (initialMidpoint.x - initialPan.x) / initialZoom;
        const worldY = (initialMidpoint.y - initialPan.y) / initialZoom;

        // Account for midpoint drag (pan while pinching)
        const panDeltaX = midpoint.x - initialMidpoint.x;
        const panDeltaY = midpoint.y - initialMidpoint.y;

        const nextPanX = midpoint.x - worldX * nextZoom + panDeltaX;
        const nextPanY = midpoint.y - worldY * nextZoom + panDeltaY;

        setZoomLevel(nextZoom);
        setPanOffset({ x: nextPanX, y: nextPanY });
        forceUpdate();
      } else if (e.touches.length === 1 && !pinchState.current.isPinching) {
        touchMoveHandler(e);
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      if (e.touches.length < 2 && pinchState.current.isPinching) {
        pinchState.current.isPinching = false;
      }
      if (e.touches.length === 0) {
        touchEndHandler(e);
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [setZoomLevel, setPanOffset, forceUpdate, touchStartHandler, touchMoveHandler, touchEndHandler]);

  return (
    <CanvasWrapper>
      <StyledCanvas
        ref={canvasReference}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={mouseDownHandler}
        onMouseMove={mouseMoveHandler}
        onMouseLeave={mouseUpHandler}
        onMouseUp={mouseUpHandler}
      />
    </CanvasWrapper>
  );
}

export default CanvasBoard;
