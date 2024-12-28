import React, { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import Slider from 'rc-slider';
import penImg from '/assets/pen.svg'
import 'rc-slider/assets/index.css';
import styled from "styled-components";

const StyledDiv=styled.div`
  border : 1px solid blue;

  & button.active{ 
    border : 1px solid red;
  }
`

const Img=styled.img`
  width : 15px;
  hieght : 15px;
`




function Canvas() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing]=useState(false);
    const [isErasing, setIsErasing]=useState(false);
    const [cursorStyle,setCursorStyle] = useState(null);
    const [context, setContext] = useState(null);
    const [color,setColor]=useState("Black");
    const [width,setWidth]=useState(1);
    const [undoStack, setUndoStack] = useState([]); // Stack for undo
  const [redoStack, setRedoStack] = useState([]); // Stack for redo


    const saveCanvasState = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL(); // Get canvas state as base64
        setUndoStack((prevStack) => [...prevStack, dataURL]); // Save the state in the undo stack
        setRedoStack([]); // Clear redo stack when new action is performed
      };
    
      const loadCanvasState = (state) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = state;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
          ctx.drawImage(img, 0, 0); // Draw the image (previous state) on the canvas
        };
      };

    const startDrawing = (e) => {
        const ctx = canvasRef.current.getContext('2d');
        setContext(ctx);
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
        
    };

    const draw = (e) => {
        if (!isDrawing) return;

        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();

    };

    const stopDrawing = () => {
        if (isDrawing) {
            context.closePath();
            setIsDrawing(false);
            saveCanvasState();
        }
    }

    const handleSlideBarChange = (val) => {
        setWidth(val);
      };

    
      const undo = () => {
        if (undoStack.length === 0) return;
        const lastState = undoStack[undoStack.length - 1];
        const newUndoStack = undoStack.slice(0, undoStack.length - 1);
        setUndoStack(newUndoStack);
        setRedoStack([lastState, ...redoStack]); // Move to redo stack
        if (newUndoStack.length > 0) {
          loadCanvasState(newUndoStack[newUndoStack.length - 1]); // Load the previous state
        } else {
          // If no more undo states, clear the canvas
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
    
      const redo = () => {
        if (redoStack.length === 0) return;
        const lastRedoState = redoStack[0];
        const newRedoStack = redoStack.slice(1);
        setRedoStack(newRedoStack);
        setUndoStack([...undoStack, lastRedoState]); // Move back to undo stack
        loadCanvasState(lastRedoState); // Load the redo state
      };
    
      const saveCanvas = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL(); // Convert the canvas to a base64 image
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "drawing.png"; // Set the file name
        link.click(); // Trigger the download
      };

      const handleEraser = () => {
        setIsErasing(true);
        setColor("white");
      };

      const habdlePen = () => { 
        setIsErasing(false);
        setColor("black");
        setCursorStyle('url(/assets/pen.png) 0 16, auto');
      };


    

    return (
        <div>
            <StyledDiv>
                <button className="active" onClick={habdlePen}>
                  <Img src={penImg} alt="pen to draw"/>
                </button>
                <button onClick={undo}>Undo</button>
                <button onClick={redo}>Redo</button>
                <button onClick={handleEraser}>Eraser</button>
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
                style = {{border: '1px solid black',
                  cursor: {cursorStyle},
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}>

            </canvas>
        </div>
    );
};

export default Canvas;
