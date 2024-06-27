import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header/Header";
import { useCursorLocation } from "./hooks/useCursorLocation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { transform } from "./utils/utils";
import { ScrollTrigger } from "gsap/all";

function App() {
  const { x, y } = useCursorLocation();
  gsap.registerPlugin(useGSAP);

  const pointerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const mainSectionRef = useRef<HTMLDivElement>(null);

  const [isBurgerHovered, setIsBurgerHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);

  const POINTER_SIZE = isBurgerHovered ? 60 : 14;
  const MASK_SIZE = isTextHovered ? 400 : 0;

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

  useEffect(() => {
    const burgerElement = burgerRef.current as HTMLDivElement;
    burgerElement.addEventListener("mouseenter", onMouseEnterBurger);
    burgerElement.addEventListener("mouseleave", onMouseLeaveBurger);

    return () => {
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

  function animatePointer(
    xP: number,
    yP: number,
    scaleX: number,
    scaleY: number,
    angle: number,
  ) {
    gsap.to(pointerRef.current, {
      x: xP,
      y: yP,
      scaleX,
      scaleY,
      rotation: `${angle}rad`,
      width: POINTER_SIZE,
      height: POINTER_SIZE,
      duration: 0.5,
      ease: "expo",
    });
  }

  useGSAP(
    () => {
      let xP = x - POINTER_SIZE / 2;
      let yP = y - POINTER_SIZE / 2;
      let scaleX = 1;
      let scaleY = 1;
      let angle = 0;

      if (isBurgerHovered) {
        const { x: burgerX, y: burgerY, width, height } = getBurgerCoords();
        const distanceDiff = { x: x - burgerX, y: y - burgerY };
        angle = Math.atan2(distanceDiff.y, distanceDiff.x);
        const absDistance = Math.max(
          Math.abs(distanceDiff.x),
          Math.abs(distanceDiff.y),
        );
        scaleX = transform(absDistance, [0, height / 2], [1, 1.2]);
        scaleY = transform(absDistance, [0, width / 2], [1, 0.8]);
        xP = burgerX - POINTER_SIZE / 2 + distanceDiff.x * 0.1;
        yP = burgerY - POINTER_SIZE / 2 + distanceDiff.y * 0.1;
      }
      animatePointer(xP, yP, scaleX, scaleY, angle);
    },
    { scope: pointerRef, dependencies: [x, y] },
  );

  useGSAP(
    () => {
      const mainElement = mainSectionRef?.current;
      const maskElement = maskRef.current;
      const topOffset = mainElement?.getBoundingClientRect().top ?? 0;
      gsap.to(maskElement, {
        maskPosition: `${x - MASK_SIZE / 2}px ${y - topOffset - MASK_SIZE / 2}px`,
        ease: "expo",
        duration: 0.3,
      });
      gsap.to(maskElement, {
        webkitMaskSize: `${MASK_SIZE}px`,
        duration: 0.3,
      });
    },
    { dependencies: [x, y], scope: maskRef },
  );

  const opacityTextContainer = useRef<HTMLDivElement>(null);
  let wordRefs = useRef<HTMLParagraphElement[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(wordRefs.current, {
        scrollTrigger: {
          trigger: opacityTextContainer.current,
          scrub: true,
          start: "-=200%",
          end: "+=40%",
        },
        opacity: 1,
        duration: 1,
        stagger: 0.4,
      });
    },
    { scope: wordRefs, dependencies: [] },
  );

  const phrase =
    "This is a long text that I want to anmiate on scroll. Keep scrolling and you should see the opacity of the text increase if you scrolling down, while decrease if you scroll up.";

  function splitToWords(phrase: string) {
    if (!wordRefs.current) return;
    const words = phrase.split(" ");
    return words.map((word, i) => (
      // @ts-ignore
      <p ref={(r) => wordRefs.current.push(r)} key={word + i}>
        {word}
      </p>
    ));
  }

  return (
    <>
      <div ref={pointerRef} className="cursor" />
      <Header ref={burgerRef} />
      <main className="main" ref={mainSectionRef}>
        <div className="text-container">
          <div ref={maskRef} className="mask">
            <p
              className="info"
              onMouseEnter={() => setIsTextHovered(true)}
              onMouseLeave={() => setIsTextHovered(false)}
            >
              This is another piece of text, which we will try to show
              afterwards, then add some more.
            </p>
          </div>
          <div>
            <p className="info">
              Hover the burger icon, then come back here, plus some addition
              text to make this work.
            </p>
          </div>
        </div>
      </main>
      <section>
        <div ref={opacityTextContainer}>{splitToWords(phrase)}</div>
      </section>
      <section></section>
    </>
  );
}

export default App;
