import React, { useRef, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { canvasStore } from "../store/canvasStore";
import useDrawingActions from '../hooks/useDrawingActions';


const StyledCanvas = styled.canvas`
    background-color: #f1f1f1;
    border: 1px solid black;
`

function CanvasBoard() {
    console.log("CanvasBoard Component");

    const setCanvasRef = canvasStore.getState().setCanvasRef;
    
    const canvasReference = useRef(null);

    useLayoutEffect(() => {
        console.log("inside CanvasBoard component useEffect"); 
        console.log(canvasReference.current);
        setCanvasRef(canvasReference.current);
    },[]);

    
    const { mouseDownHandler,mouseMoveHandler,mouseUpHandler} = useDrawingActions();

    return (
        <div>
                <StyledCanvas
                    ref={canvasReference}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseDown={mouseDownHandler}
                    onMouseMove={mouseMoveHandler}
                    onMouseLeave={mouseUpHandler}
                    onMouseUp={mouseUpHandler}
                >
                </StyledCanvas>
        </div>
    );
};

export default CanvasBoard;
