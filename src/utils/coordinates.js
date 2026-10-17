export const getEventCanvasPoint = (e, canvas) => {
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const touch =
    e.touches && e.touches.length > 0
      ? e.touches[0]
      : e.changedTouches && e.changedTouches.length > 0
      ? e.changedTouches[0]
      : null;

  const clientX =
    touch ? touch.clientX : e.clientX !== undefined ? e.clientX : (e.nativeEvent?.clientX ?? 0);
  const clientY =
    touch ? touch.clientY : e.clientY !== undefined ? e.clientY : (e.nativeEvent?.clientY ?? 0);

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};

