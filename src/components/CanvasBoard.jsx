import React, { useRef, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { canvasStore } from "../store/canvasStore";
import useDrawingActions from '../hooks/useDrawingActions';

const CanvasWrapper = styled.div`
    overflow: auto;
    width: 100vw;
    height: 100vh;
    border: 2px solid #000;

    // display: flex;
    // justify-content: center;
    // align-items: center;

    /* Hide scrollbar but keep scroll functionality */
    &::-webkit-scrollbar {
        width: 0;   /* For horizontal scrollbar */
        height: 0;  /* For vertical scrollbar */
    }

    /* For Firefox */
    scrollbar-width: none; /* Hide scrollbar in Firefox */
`

const StyledCanvas = styled.canvas`
    background-color: #f1f1f1;
    border: 1px solid black;
    display: block;

     /* Make sure the canvas is larger than the container */
    // max-width: none;  /* To prevent automatic scaling */
    // max-height: none;
`

function CanvasBoard() {
    // console.log("CanvasBoard Component");

    const setCanvasRef = canvasStore.getState().setCanvasRef;
    
    const canvasReference = useRef(null);

    const canvasWidth = 6000; // Set the desired width of the canvas
    const canvasHeight = 4000; // Set the desired height of the canvas

    useLayoutEffect(() => {
        // console.log("inside CanvasBoard component useEffect"); 
        // console.log(canvasReference.current);
        setCanvasRef(canvasReference.current);
         // Get the CanvasWrapper and set the initial scroll position
         const wrapper = canvasReference.current?.parentNode;
         if (wrapper) {
             const wrapperWidth = wrapper.clientWidth;
             const wrapperHeight = wrapper.clientHeight;
 
             // Set the scroll position to 50% of the canvas size
             wrapper.scrollLeft = (canvasWidth - wrapperWidth) / 2; // Center horizontally
             wrapper.scrollTop = (canvasHeight - wrapperHeight) / 2; // Center vertically
         }
    },[]);

    
    const { mouseDownHandler,mouseMoveHandler,mouseUpHandler} = useDrawingActions();

    return (
        <CanvasWrapper>
                <StyledCanvas
                    ref={canvasReference}
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseDown={mouseDownHandler}
                    onMouseMove={mouseMoveHandler}
                    onMouseLeave={mouseUpHandler}
                    onMouseUp={mouseUpHandler}
                >
                </StyledCanvas>
        </CanvasWrapper>
    );
};

export default CanvasBoard;
