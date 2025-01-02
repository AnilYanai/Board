import React, { useRef, useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styled from "styled-components";

function useCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [cursorStyle, setCursorStyle] = useState(null);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState("Black");
  const [width, setWidth] = useState(1);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    // const canvas = canvasRef.current;
    // console.log("canvas", canvas);
    // console.log("canvasRef", canvasRef); 
    // console.log("ctxRef", ctxRef); 
    // const ctx = canvas.getContext('2d');
    // ctx.lineCap = 'round';
    // ctx.lineJoin = 'round';
    // ctxRef.current = ctx;
    // console.log("redered");
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      console.log("canvas", canvas);
      const ctx = canvas.getContext('2d');
      console.log("ctx", ctx);
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;
      } else {
        console.error('Failed to get 2D context from canvas.');
      }
    } else {
      console.error('Canvas ref is not attached to a DOM element.');
    }
  }, []);

  useEffect(() => {
    redrawCanvas();
  }, [strokes]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    console.log("offsetX", offsetX);
    console.log("offsetY", offsetY);
    setIsErasing(false);
    const newStroke = {
      author: 'user',
      type: 'line',
      color: color,
      width: width,
      points: [{ x: offsetX, y: offsetY }],
    };
    console.log("newStroke", newStroke);  
    setCurrentStroke(newStroke);
  };

  const draw = (e) => {
    console.log("isErasing(inside draw)", isErasing);
    if (isDrawing) return;
    console.log("isErasing(inside draw2)", isErasing);
    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
    setCurrentStroke((prevStroke) => {
      if (prevStroke) {
        return {
          ...prevStroke,
          points: [...prevStroke.points, newPoint],
        };
      }
      return prevStroke;
    });

    const ctx = ctxRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    const points = currentStroke.points;
    console.log("points", points);
    if (points.length > 0) {
      console.log("drawing");
      ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }

    // if (isErasing) return;

    // const { offsetX, offsetY } = e.nativeEvent;
    // const newPoint = { x: offsetX, y: offsetY };
    // // if (points.length > 0) {
    // //   ctx.beginPath();
    // //   ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
    // //   ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    // //   ctx.stroke();
    // // }
  
    // // Use a local variable to ensure you have the most up-to-date stroke
    // let newStroke;
    // setCurrentStroke((prevStroke) => {
    //   if (prevStroke) {
    //     newStroke = {
    //       ...prevStroke,
    //       points: [...prevStroke.points, newPoint],
    //     };
    //     return newStroke;
    //   }
    //   return prevStroke;
    // });
  
    // if (!newStroke) return;
  
    // const ctx = ctxRef.current;
    // ctx.strokeStyle = newStroke.color;
    // ctx.lineWidth = newStroke.width;
  
    // // Draw the line incrementally
    // const points = newStroke.points;
    // if (points.length > 0) {
    //   ctx.beginPath();
    //   ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
    //   ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    //   ctx.stroke();
    // }
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

  const handlePen = () => {
    setIsErasing(false);
    setColor("black");
    setCursorStyle('url(/assets/pen.svg) 0 16, auto');
  };

  const getDrawingAction= () =>{
    console.log("isErasing", isErasing);
    return isErasing ? erase : startDrawing;
  };

 

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    undo,
    redo,
    saveCanvas,
    handleEraser,
    handlePen,
    handleSlideBarChange,
    color,
    setColor,
    width,
    setWidth,
    cursorStyle,
    getDrawingAction
  };
};

export default useCanvas;
