import { canvasStore } from "../store/canvasStore";
import { historyStore } from "../store/historyStore";

export const eraser = {
    onMouseDown: (e) => {
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
            // if (isNear) {
            //     stroke.status = "deleted"; // Mark the stroke as deleted
            //     return stroke;
            // }
            return isNear && stroke.status==="active"; // Return the stroke if it's near the eraser
        });
        strokeToDelete.status = "inactive"; // Mark the stroke as deleted
        strokeToDelete = JSON.parse(JSON.stringify(strokeToDelete)); // Create a deep copy of the stroke to avoid mutating the original object
        // console.log("strokeToDelete", strokeToDelete);
        if (strokeToDelete) {
            strokeToDelete.status = "deleted";
            setStrokes([...getStrokes(), strokeToDelete]);
            // setStrokes(updatedStrokes); // Update the strokes in the store but the strokes that are deleted are not added to the strokes array
            forceUpdate(); // Trigger a re-render of the canvas
        }
        else{
            console.log("No strokes found to delete.");
        }
    }
}