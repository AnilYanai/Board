import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import useCanvas from '../hooks/useCanvas';
import ToolBar from "./ToolBar";
import ActionBar from "./ActionBar";


const StyledDiv = styled.div`
  & button.active{ 
    border : 1px solid red;
  }
`
const MainPanel = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
`
const StyledCanvas = styled.canvas`
    background-color: white;
    border: 1px solid black;
    // height: 100%;
    // width: 100%;
`
const Img = styled.img`
    width : 15px;
    hieght : 15px;
`


function Canvas() {
    console.log("Canvas1");
    const { canvasRef,
        isErasing,
        cursorStyle,
        color,
        startDrawing,
        draw,
        stopDrawing,
        erase,
        handleSlideBarChange,
        undo,
        redo,
        saveCanvas,
        handleEraser,
        handlePen,
        setColor,
        getDrawingAction } = useCanvas();
    console.log("Canvas2");

    return (
        <div>
            <MainPanel>
                <StyledCanvas
                    ref={canvasRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    // onTouchStart={getDrawingAction}      //this only pass the reference of the getDrawingAction so in runtime it will not work
                    // onMouseDown={getDrawingAction}        
                    onTouchStart={(e) => getDrawingAction()(e)}  // Call getDrawingAction and then execute the function it returns
                    
                    // onTouchStart={isErasing ? erase : startDrawing}  //eraser not working 
                    // onMouseDown={isErasing ? erase : startDrawing}   //eraser not working
                    // onTouchMove={draw}
                    // onMouseDown={startDrawing}
                    onMouseDown={(e) => getDrawingAction()(e)}
                    onMouseMove={draw}
                    onMouseLeave={stopDrawing}
                    // onTouchEnd={stopDrawing}
                    onMouseUp={stopDrawing}
                >
                </StyledCanvas>
                <ActionBar
                    undo={undo}
                    redo={redo}
                    saveCanvas={saveCanvas}
                />
                <ToolBar
                    handleEraser={handleEraser}
                    handlePen={handlePen}
                    setColor={setColor}
                    color={color}
                    handleSlideBarChange={handleSlideBarChange}
                />
            </MainPanel>
        </div>
    );
};

export default Canvas;
