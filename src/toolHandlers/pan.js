import { canvasStore } from "../store/canvasStore";

export const pan = {
    onMouseDown: (e, getCurrentStroke,setCurrentStroke) => {
        const { clientX, clientY } = e.nativeEvent;
        // Get the canvas wrapper directly from the Zustand store
        const wrapper = canvasStore.getState().getCanvasRef().parentElement;

        if (wrapper) {
            // Store the initial scroll position when the mouse is pressed
            setCurrentStroke({
                lastX: clientX,
                lastY: clientY,
                scrollLeft: wrapper.scrollLeft,
                scrollTop: wrapper.scrollTop,
            });

            // console.log("Initial pan - offset x,y:", offsetX, offsetY);
        } else {
            console.error("Wrapper element not found");
        }
    },

    onMouseMove: (e, getCurrentStroke, setCurrentStroke) => {
        if (e.buttons !== 1) return; // Check if the left mouse button is pressed
        if (!getCurrentStroke().lastX || !getCurrentStroke().lastY) return; // Ensure we have a starting point

        const { clientX, clientY } = e.nativeEvent;

        // Get the canvas wrapper directly from the Zustand store
        const wrapper = canvasStore.getState().getCanvasRef().parentElement;

        if (wrapper) {
            // Calculate the delta between the previous mouse position and the current one
            const deltaX = clientX - getCurrentStroke().lastX;
            const deltaY = clientY - getCurrentStroke().lastY;

            // Update the scroll position directly based on the delta
            wrapper.scrollLeft = getCurrentStroke().scrollLeft - deltaX;
            wrapper.scrollTop = getCurrentStroke().scrollTop - deltaY;

            // Update the last mouse position
            setCurrentStroke({
                lastX: clientX,
                lastY: clientY,
                scrollLeft: wrapper.scrollLeft,
                scrollTop: wrapper.scrollTop,
            });

            // console.log("Moving pan - offset x,y:", offsetX, offsetY);
        } else {
            console.error("Wrapper element not found");
        }
    },

    onMouseUp: (e,getCurrentStroke,setCurrentStroke) => {
        setCurrentStroke(null); // Clear the stored mouse position
        // console.log("Pan ended");
    }
};
