import React, { useRef, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { canvasStore } from "../store/canvasStore";
import useDrawingActions from '../hooks/useDrawingActions';

const CanvasWrapper = styled.div`
    overflow: scroll;
    width: 100vw;
    height: 100vh;
    background-color: yellow;
    position : relative;

    // Hide scrollbar for Chrome, Safari and Opera
    // &::-webkit-scrollbar {
    //     width: 0;
    //     height: 0;
    // }

    // scrollbar-width: none;
`;

const StyledCanvas = styled.canvas`
    background-color: #f1f1f1;
    border: 1px solid black;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
`;

function CanvasBoard() {
    const canvasReference = useRef(null);

    const canvasWidth = 7680;//8k resolution 
    const canvasHeight = 4320;

    // Zustand bindings
    const setCanvasRef = canvasStore((state) => state.setCanvasRef);
    const setZoomLevel = canvasStore((state) => state.setZoomLevel);
    const zoomLevel = canvasStore((state) => state.zoomLevel);

    useLayoutEffect(() => {
        setCanvasRef(canvasReference.current);

        const wrapper = canvasReference.current?.parentNode;
        if (wrapper) {
            const wrapperWidth = wrapper.clientWidth;
            const wrapperHeight = wrapper.clientHeight;

            wrapper.scrollLeft = (canvasWidth - wrapperWidth) / 2;
            wrapper.scrollTop = (canvasHeight - wrapperHeight) / 2;
        }
        
    }, []);

    useEffect(() => {
        const canvas = canvasReference.current;

        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
        
                const wrapper = canvasReference.current?.parentNode;
                if (!wrapper) return;
        
                const wrapperRect = wrapper.getBoundingClientRect();
        
                const mouseX = e.clientX - wrapperRect.left + wrapper.scrollLeft;
                const mouseY = e.clientY - wrapperRect.top + wrapper.scrollTop;
        
                setZoomLevel((prevZoom) => {
                    const zoomFactor = 1 - e.deltaY * 0.0035;
                    const nextZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.2), 3);
        
                    // prevent divide-by-zero or no change
                    if (nextZoom === prevZoom) return prevZoom;
        
                    const scaleChange = nextZoom / prevZoom;
        
                    // Adjust scroll to simulate zoom at mouse point
                    wrapper.scrollLeft = (mouseX * scaleChange) - (e.clientX - wrapperRect.left);
                    wrapper.scrollTop = (mouseY * scaleChange) - (e.clientY - wrapperRect.top);
        
                    return nextZoom;
                });
            }
        };
        
        canvas?.addEventListener("wheel", handleWheel, { passive: false });

        
        return () => {
            canvas?.removeEventListener("wheel", handleWheel);
        };
    }, [setZoomLevel]);

    const { mouseDownHandler, mouseMoveHandler, mouseUpHandler } = useDrawingActions();

    return (
        <CanvasWrapper>
            <StyledCanvas
                ref={canvasReference}
                width={canvasWidth}
                height={canvasHeight}
                style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: `0 0`,
                }}
                onMouseDown={mouseDownHandler}
                onMouseMove={mouseMoveHandler}
                onMouseLeave={mouseUpHandler}
                onMouseUp={mouseUpHandler}
            />
        </CanvasWrapper>
    );
}

export default CanvasBoard;
