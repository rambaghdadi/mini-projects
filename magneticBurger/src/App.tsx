import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header/Header";
import {
  motion,
  useMotionValue,
  useSpring,
  transform,
  animate,
} from "framer-motion";

function App() {
  const pointerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);

  const [isBurgerHovered, setIsBurgerHovered] = useState(false);
  const POINTER_SIZE = isBurgerHovered ? 60 : 14;
  const pointerCoords = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };
  const pointerScale = {
    x: useMotionValue(1),
    y: useMotionValue(1),
  };

  const options = { damping: 20, stiffness: 300, mass: 0.5 };
  const animatedPointer = {
    x: useSpring(pointerCoords.x, options),
    y: useSpring(pointerCoords.y, options),
  };

  function rotatePointer(distance: { y: number; x: number }) {
    const angle = Math.atan2(distance.y, distance.x);
    if (!pointerRef.current) return;
    animate(pointerRef.current, { rotate: `${angle}rad` }, { duration: 0 });
  }

  function scalePointer(
    distance: { y: number; x: number },
    burgerCoords: { height: number; width: number },
  ) {
    const absDistance = Math.max(Math.abs(distance.x), Math.abs(distance.y));
    const newScaleX = transform(
      absDistance,
      [0, burgerCoords.height / 2 + 80],
      [1, 1.2],
    );
    const newScaleY = transform(
      absDistance,
      [0, burgerCoords.width / 2 + 80],
      [1, 0.8],
    );
    pointerScale.x.set(newScaleX);
    pointerScale.y.set(newScaleY);
  }

  function movePointer(
    distance: { y: number; x: number },
    burgerCoords: { x: number; y: number },
  ) {
    pointerCoords.x.set(burgerCoords.x - POINTER_SIZE / 2 + distance.x * 0.1);
    pointerCoords.y.set(burgerCoords.y - POINTER_SIZE / 2 + distance.y * 0.1);
  }

  function getBurgerCoords() {
    const burgerElement = burgerRef.current as HTMLDivElement;
    const { left, top, height, width } = burgerElement.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2,
      height,
      width,
    };
  }

  function updateMouseCoords(e: MouseEvent) {
    const { clientX, clientY } = e;
    pointerCoords.x.set(clientX - POINTER_SIZE / 2);
    pointerCoords.y.set(clientY - POINTER_SIZE / 2);

    const burgerCoords = getBurgerCoords();

    if (isBurgerHovered) {
      const distanceDiff = {
        x: clientX - burgerCoords.x,
        y: clientY - burgerCoords.y,
      };

      rotatePointer(distanceDiff);
      scalePointer(distanceDiff, burgerCoords);
      movePointer(distanceDiff, burgerCoords);
    } else {
      pointerCoords.x.set(clientX - POINTER_SIZE / 2);
      pointerCoords.y.set(clientY - POINTER_SIZE / 2);
      if (!pointerRef.current) return;
      animate(
        pointerRef.current,
        { scaleX: 1, scaleY: 1 },
        { duration: 0, type: "spring" },
      );
    }
  }

  useEffect(() => {
    const burgerElement = burgerRef.current as HTMLDivElement;

    burgerElement.addEventListener("mouseenter", onMouseEnterBurger);
    burgerElement.addEventListener("mouseleave", onMouseLeaveBurger);
    window.addEventListener("mousemove", updateMouseCoords);

    return () => {
      window.removeEventListener("mousemove", updateMouseCoords);
      burgerElement.removeEventListener("mouseenter", onMouseEnterBurger);
      burgerElement.removeEventListener("mouseleave", onMouseLeaveBurger);
    };
  }, [isBurgerHovered]);

  function onMouseEnterBurger() {
    setIsBurgerHovered(true);
  }

  function onMouseLeaveBurger() {
    setIsBurgerHovered(false);
  }

  const template = ({
    rotate,
    scaleX,
    scaleY,
  }: {
    rotate: string;
    scaleX: string;
    scaleY: string;
  }) => {
    return `rotate(${rotate}) scaleX(${scaleX}) scaleY(${scaleY})`;
  };

  return (
    <>
      <motion.div
        ref={pointerRef}
        className="cursor"
        transformTemplate={template}
        style={{
          left: animatedPointer.x,
          top: animatedPointer.y,
          scaleX: pointerScale.x,
          scaleY: pointerScale.y,
        }}
        animate={{
          width: POINTER_SIZE,
          height: POINTER_SIZE,
        }}
      />
      <Header ref={burgerRef} />
      <main className="main">
        <p className="info">Hover the burger icon.</p>
      </main>
    </>
  );
}

export default App;
