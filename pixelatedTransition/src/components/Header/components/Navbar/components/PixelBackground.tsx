import { ReactNode } from "react";
import classes from "./PixelBackground.module.css";
import { motion } from "framer-motion";

const animation = {
  initial: {
    opacity: 0,
  },
  animate: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.03,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    transition: {
      delay: i * 0.03,
    },
  }),
};

export interface IPixelBackgroundProps {
  isActive: boolean;
}
export const PixelBackground = ({ isActive }: IPixelBackgroundProps) => {
  function shuffle(array: any[]) {
    let j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  }

  function renderPixels(): ReactNode {
    const { innerWidth, innerHeight } = window;
    const blockSize = innerWidth * 0.05;
    const numberOfBlocks = Math.ceil(innerHeight / blockSize);
    const squares = shuffle(
      Array.from({ length: numberOfBlocks }, (_, i) => i),
    );
    return squares.map((square) => (
      <motion.div
        variants={animation}
        initial="initial"
        custom={square}
        animate={isActive ? "animate" : "exit"}
        key={square}
        className={classes.square}
      />
    ));
  }

  return (
    <div className={classes.container}>
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className={classes.column}>
          {renderPixels()}
        </div>
      ))}
    </div>
  );
};
