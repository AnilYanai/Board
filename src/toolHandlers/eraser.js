import { canvasStore } from "../store/canvasStore";
import { historyStore } from "../store/historyStore";

export const eraser = {
    onMouseDown: (e ,getCurrentStroke,setCurrentStroke) => {
        const getStrokes = historyStore.getState().getStrokes;
        const setStrokes = historyStore.getState().setStrokes;
        const forceUpdate = canvasStore.getState().forceUpdate; //to access the zustand methods

        const { offsetX, offsetY } = e.nativeEvent;
        const eraserRadius = 25;

        let strokeToDelete = getStrokes().find((stroke) => {
            const isNear = stroke.points.some((point) => {
                const distance = Math.hypot(point.x - offsetX, point.y - offsetY);
                return distance <= eraserRadius; // Keep strokes farther than the eraser radius
            });
            return isNear && stroke.status==="active"; // Return the stroke if it's near the eraser
        });
        strokeToDelete.status = "inactive"; // Mark the old stroke as inactive
        strokeToDelete = JSON.parse(JSON.stringify(strokeToDelete)); // Create a deep copy of the stroke to avoid mutating the original object
        
        if (strokeToDelete) {
            strokeToDelete.status = "deleted";
            setStrokes([...getStrokes(), strokeToDelete]);
            forceUpdate(); 
        }
        else{
            console.log("No strokes found to delete.");
        }
    }
}