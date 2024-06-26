import { useEffect, useState } from "react";

export function useCursorLocation() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  function updateMouseCoords(e: MouseEvent) {
    const { clientX, clientY } = e;
    setCoords({
      x: clientX,
      y: clientY,
    });
  }

  useEffect(() => {
    window.addEventListener("mousemove", updateMouseCoords);

    return () => {
      window.removeEventListener("mousemove", updateMouseCoords);
    };
  }, []);

  return coords;
}
