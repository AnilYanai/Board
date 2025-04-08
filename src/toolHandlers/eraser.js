import { canvasStore } from "../store/canvasStore";
import { historyStore } from "../store/historyStore";

export const eraser = {
    onMouseDown: (e) => {  
        const getStrokes = historyStore.getState().getStrokes;
        const setStrokes = historyStore.getState().setStrokes;
        const forceUpdate = canvasStore.getState().forceUpdate; //to access the zustand methods

        const { offsetX, offsetY } = e.nativeEvent;
        const eraserRadius = 25;

        const updatedStrokes = getStrokes().filter((stroke) => {
            const isNear = stroke.points.every((point) => {
                const distance = Math.hypot(point.x - offsetX, point.y - offsetY);
                return distance > eraserRadius; // Keep strokes farther than the eraser radius
            });
            return isNear;
        });

        // setStrokes([...getStrokes(), updatedStrokes]);
        setStrokes(updatedStrokes); // Update the strokes in the store but the strokes that are deleted are not added to the strokes array
        forceUpdate(); // Trigger a re-render of the canvas
    }
}