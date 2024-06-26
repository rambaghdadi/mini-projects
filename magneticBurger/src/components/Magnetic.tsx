import { MouseEvent, ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const Magnetic = ({ children }: { children: ReactNode }) => {
  gsap.registerPlugin(useGSAP);
  const ref = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: ref });

  const animationOptions = { duration: 0.2, ease: "bounce" };
  const handleMouse = contextSafe((e: MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    gsap.to(ref.current, {
      x: middleX * 0.1,
      y: middleY * 0.1,
      ...animationOptions,
    });
  });

  const reset = contextSafe(() => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      ...animationOptions,
    });
  });

  return (
    <div
      style={{ position: "relative" }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
};
