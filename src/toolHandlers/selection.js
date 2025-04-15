import { historyStore } from "../store/historyStore";
import { canvasStore } from "../store/canvasStore";

export const selection = {
    onMouseDown: (e, getCurrentStroke, setCurrentStroke) => {
        if (e.button !== 0) return; // Only execute if the left mouse button is pressed
        const {clientX,clientY, offsetX, offsetY, shiftKey } = e.nativeEvent;
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
                if (!getCurrentStroke()) {
                    newSelection = [selectedStroke];
                } else {
                    const alreadySelected = getCurrentStroke().find(
                        (s) => s.id === selectedStroke.id
                    );
                    newSelection = alreadySelected ? getCurrentStroke() : [...getCurrentStroke(), selectedStroke];
                }
            } else {
                newSelection = [selectedStroke];
            }
        }

        // setCurrentStroke(newSelection); 
        setCurrentStroke({
            selectedStrokes: newSelection,
            lastX: clientX,
            lastY: clientY,
          });
        console.log("Current strokes:(in mouseDown)", getCurrentStroke());
    },

    onMouseMove: (e, getCurrentStroke, setCurrentStroke) => {
        if(e.buttons !== 1) return; // Only execute if the left mouse button is pressed
        const { clientX, clientY } = e.nativeEvent;
        const deltaX = clientX - getCurrentStroke().lastX;
        const deltaY = clientY - getCurrentStroke().lastY;

        const forceUpdate = canvasStore.getState().forceUpdate;
        getCurrentStroke().selectedStrokes?.forEach((stroke) => {
            stroke.points.forEach((point) => {
                point.x += deltaX;
                point.y += deltaY;
            });
        });
        setCurrentStroke({
            ...getCurrentStroke(),
            lastX: clientX,
            lastY: clientY,
        });
        console.log("Current strokes(in mouseMovement):", getCurrentStroke());
        forceUpdate(); // Trigger a re-render of the canvas
    },

    onMouseUp: (e, getCurrentStroke, setCurrentStroke) => {
        
    },

    drawStroke: null
}