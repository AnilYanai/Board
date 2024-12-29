import React, { useRef, useState, useEffect} from "react";
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
    const ctxRef = useRef(null);
    const [strokes, setStrokes] = useState([]);
    const [currentStroke, setCurrentStroke] = useState(null);
    const [isDrawing, setIsDrawing]=useState(false);
    const [isErasing, setIsErasing]=useState(false);
    const [cursorStyle,setCursorStyle] = useState(null);
    const [context, setContext] = useState(null);
    const [color,setColor]=useState("Black");
    const [width,setWidth]=useState(1);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]); 

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctxRef.current = ctx;
    }, []);




    const startDrawing = (e) => {
        const {offsetX, offsetY} = e.nativeEvent;
        setIsDrawing(true);
        const newStroke = {
            author: 'user',
            type: 'line',
            color: color,
            width: width,
            points: [{x: offsetX, y: offsetY}],
        };
        setCurrentStroke(newStroke);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const {offsetX, offsetY} = e.nativeEvent;
        const newPoint = {x: offsetX, y: offsetY};
        setCurrentStroke((prevStroke) => {
          if (prevStroke) {
              return {
                  ...prevStroke,
                  points: [...prevStroke.points, newPoint],
              };
          }
          return prevStroke;
      });

      const ctx=ctxRef.current;
      ctx.strokeStyle=color;
      ctx.lineWidth=width;
      ctx.beginPath();
      const points = currentStroke.points;
      if (points.length > 0) {
          ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
          ctx.lineTo(offsetX, offsetY);
          ctx.stroke();
      }

    };

    const stopDrawing = () => {
      if (currentStroke) {
          setStrokes((prevStrokes) => [...prevStrokes, currentStroke]);
          setCurrentStroke(null);
      }
      setIsDrawing(false);
    };

    const clearCanvas = () => {
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setStrokes([]);
    };

    const redrawCanvas = () => {
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      strokes.forEach((stroke) => {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.lineWidth;
          ctx.beginPath();
          stroke.points.forEach((point, index) => {
              if (index === 0) {
                  ctx.moveTo(point.x, point.y);
              } else {
                  ctx.lineTo(point.x, point.y);
              }
          });
          ctx.stroke();
      });
    };

    const erase = (e) => {
      if (!isErasing) return;

      const { offsetX, offsetY } = e.nativeEvent;
      const eraserRadius = 25;

      const updatedStrokes = strokes.filter((stroke) => {
          const isNear = stroke.points.every((point) => {
              const distance = Math.hypot(point.x - offsetX, point.y - offsetY);
              return distance > eraserRadius; // Keep strokes farther than the eraser radius
          });
          return isNear;
      });

      setStrokes(updatedStrokes);
      redrawCanvas(updatedStrokes);
    };

    const handleSlideBarChange = (val) => {
        setWidth(val);
      };

    
      const undo = () => {
        if (strokes.length === 0) return;
        redoStack.push(strokes[strokes.length - 1]); // Add the last stroke to redo stack
        setStrokes((prevStroke) => { 
          return prevStroke.slice(0, -1); // Remove the last
        }); // Clear the strokes

      };
    
      const redo = () => {
        if (redoStack.length === 0) return;
        setStrokes((prevStroke) => [...prevStroke, redoStack[redoStack.length - 1]]); // Add the last stroke from redo stack
        setRedoStack((prevStack) => prevStack.slice(0, -1)); // Remove the last stroke from redo stack
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
      };

      const habdlePen = () => { 
        setIsErasing(false);
        setColor("black");
        setCursorStyle('url(/assets/pen.png) 0 16, auto');
      };


      useEffect(() => {
        redrawCanvas();
      }, [strokes]);
    

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
                onMouseDown={isErasing ? erase : startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}>

            </canvas>
        </div>
    );
};

export default Canvas;
