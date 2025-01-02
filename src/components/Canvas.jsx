import React, { useRef, useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Slider from 'rc-slider';
import penImg from '/assets/pen.svg';
import Undo from '/assets/undo.svg';
import Redo from '/assets/redo.svg';
import 'rc-slider/assets/index.css';
import styled from "styled-components";
import useCanvas from '../hooks/useCanvas';
import ToolBar from "./ToolBar";

const StyledDiv = styled.div`
  border : 1px solid blue;

  & button.active{ 
    border : 1px solid red;
  }
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
        handlePen ,
        setColor,
        getDrawingAction} = useCanvas();
        console.log("Canvas2");
        // const [isCanvasReady, setIsCanvasReady] = useState(false);

    return (
        <div>
            <StyledDiv>
                {/* <button className="active" onClick={handlePen}>
                    <Img src={penImg} alt="pen to draw" />
                </button> */}
                <button onClick={undo}><Img src={Undo} alt="Undo" /></button>
                <button onClick={redo}><Img src={Redo} alt="Redo" /></button>
                {/* <button onClick={handleEraser}>Eraser</button> */}
                <button onClick={saveCanvas}>Save</button>
                
            </StyledDiv>
            <HexColorPicker color={color} onChange={setColor} />
            <br />

            <Slider
                min={1}
                max={100}
                onChange={handleSlideBarChange}
            >
            </Slider>

            <br />
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{
                    border: '1px solid black',
                    cursor: cursorStyle,
                }}
                
                // onTouchStart={getDrawingAction}      //this only pass the reference of the getDrawingAction so in runtime it will not work
                // onMouseDown={getDrawingAction}        
                onTouchStart={(e) => getDrawingAction()(e)}  // Call getDrawingAction and then execute the function it returns
                onMouseDown={(e) => getDrawingAction()(e)} 
                // onTouchStart={isErasing ? erase : startDrawing}  //eraser not working 
                // onMouseDown={isErasing ? erase : startDrawing}   //eraser not working
                // onTouchMove={draw}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                // onTouchEnd={stopDrawing}
                onMouseUp={stopDrawing}
                >
            </canvas>
            <ToolBar
                handleEraser={handleEraser}
                handlePen={handlePen}
            />
        </div>
    );
};

export default Canvas;
