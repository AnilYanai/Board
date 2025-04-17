import { historyStore } from "../store/historyStore";
import { canvasStore } from "../store/canvasStore";

export const selection = {
    onMouseDown: (e, getCurrentStroke, setCurrentStroke) => {
        if (e.button !== 0) return; // Only execute if the left mouse button is pressed
        const {offsetX, offsetY, shiftKey } = e.nativeEvent;
        const getStrokes = historyStore.getState().getStrokes;

        const selectionRadius = 25;

        let selectedStroke = getStrokes().find((stroke) => {
            const isNear = stroke.points.some((point) => {
                const distance = Math.hypot(point.x - offsetX, point.y - offsetY);
                return distance <= selectionRadius; // Keep strokes farther than the eraser radius
            });
            return isNear && stroke.status === "active"; // Return the stroke if it's near the eraser
        });

        let newSelection;
        if (selectedStroke) {
            if (shiftKey) {
                // console.log("Shift key pressed");
                if (!getCurrentStroke()) {
                    newSelection = [selectedStroke];
                } else {
                    // console.log("Current strokes:", getCurrentStroke().selectedStrokes);
                    const alreadySelected = getCurrentStroke().selectedStrokes.find(
                        (s) => s.id === selectedStroke.id
                    );
                    newSelection = alreadySelected ? getCurrentStroke().selectedStrokes : [...getCurrentStroke().selectedStrokes, selectedStroke];
                }
            } else {
                newSelection = [selectedStroke];
            }
        }

        // setCurrentStroke(newSelection); 
        setCurrentStroke({
            selectedStrokes: newSelection,
            lastX: offsetX,
            lastY: offsetY,
          });
        console.log("Current strokes:(in mouseDown)", getCurrentStroke());
    },

    onMouseMove: (e, getCurrentStroke, setCurrentStroke) => {
        if(e.buttons !== 1) return; // Only execute if the left mouse button is pressed
        const { offsetX, offsetY } = e.nativeEvent;
        const deltaX = offsetX - getCurrentStroke().lastX;
        const deltaY = offsetY - getCurrentStroke().lastY;

        const forceUpdate = canvasStore.getState().forceUpdate;
        getCurrentStroke().selectedStrokes?.forEach((stroke) => {
            stroke.points.forEach((point) => {
                point.x += deltaX;
                point.y += deltaY;
            });
        });
        setCurrentStroke({
            ...getCurrentStroke(),
            lastX: offsetX,
            lastY: offsetY,
        });
        console.log("Current strokes(in mouseMovement):", getCurrentStroke());
        forceUpdate(); // Trigger a re-render of the canvas
    },

    onMouseUp: (e, getCurrentStroke, setCurrentStroke) => {
        
    },

    drawStroke: null
}