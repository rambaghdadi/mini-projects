import {useEffect, useRef, useState} from "react"
import {Star} from "./assets/Star"

export const App = () => {
  const prevMouseCoorRef = useRef({ x: 0, y: 0 });
  const prevStarCoorRef = useRef({ x: 0, y: 0 });
  const [stars, setStars] = useState<
    {
      left: number
      top: number
      id: string
      color: string
      class: string
    }[]
  >([])
  const [glows, setGlows] = useState<
    {
      left: number
      top: number
      id: string
    }[]
  >([])


  const containerRef = useRef<HTMLDivElement>(null)

  const colors = ["#057def", "#53dfff", "#7624ff"]
  const starClasses = ["star1", "star2", "star3"]

  function getRandomItem(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  function createStar(clientX: number, clientY: number) {
    setStars((prev) => {
      const newStar = {
        left: clientX,
        top: clientY,
        color: getRandomItem(colors),
        id: new Date().toISOString() + Math.random() * 30,
        class: getRandomItem(starClasses),
      }

      return [...prev, newStar]
    })
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async function createGlow(clientX: number, clientY: number) {
    const id =  new Date().toISOString() + Math.random() * 1000
    setGlows((prev) => {
      const newGlow = {
        left: clientX,
        top: clientY,
        id,
      }
      return [...prev, newGlow]
    })

    await sleep(100)
    setGlows(prev => prev.filter(glow => glow.id !== id));
  }

  function addTrail(e: MouseEvent) {
    createGlow(e.clientX, e.clientY)
    const newX = e.clientX
    const newY = e.clientY

    const prevX = prevMouseCoorRef.current.x
    const prevY = prevMouseCoorRef.current.y

    const dist = Math.sqrt(Math.pow(newX - prevX, 2) + Math.pow(newY - prevY, 2))

    const stepSize = 10; // Fixed distance between glows
    if (dist > stepSize) {
      const steps = Math.floor(dist / stepSize);
      for (let i = 0; i < steps; i++) {
        const interpolatedX = prevX + (newX - prevX) * (i / steps);
        const interpolatedY = prevY + (newY - prevY) * (i / steps);
        createGlow(interpolatedX, interpolatedY);
      }
      prevMouseCoorRef.current = { x: newX, y: newY };
    }

    const starDist = Math.sqrt(
      Math.pow(newX - prevStarCoorRef.current.x, 2) + Math.pow(newY - prevStarCoorRef.current.y, 2)
    )

    if (starDist > 30) {
      createStar(e.clientX, e.clientY)
      prevStarCoorRef.current = { x: newX, y: newY }
    }
  }

  function onAnimationEnd(e: any) {
    setStars((prev) => prev.filter((star) => star.id !== e))
  }

  useEffect(() => {
    window.addEventListener("mousemove", addTrail)
    return () => window.removeEventListener("mousemove", addTrail)
  }, [])



  return (
    <div
      ref={containerRef}
      className="container"
    >
      {glows.map((glow)=> (
          <div key={glow.id} className="glow" style={{ left: glow.left, top: glow.top}} />
      ))}
      {stars?.map((star) => (
        <Star
          className={star.class}
          onAnimationEnd={() => onAnimationEnd(star.id)}
          key={star.id}
          style={{
            color: star.color,
            left: star.left + "px",
            top: star.top + "px",
            position: "fixed",
          }}
        />
      ))}
    </div>
  )
}
