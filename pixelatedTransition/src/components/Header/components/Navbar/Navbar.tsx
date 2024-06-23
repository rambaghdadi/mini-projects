import {
  IPixelBackgroundProps,
  PixelBackground,
} from "./components/PixelBackground";
import classes from "./Navbar.module.css";
import { motion } from "framer-motion";

const animation = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      delay: 0.1,
    },
  },
};

interface INavbarProps extends IPixelBackgroundProps {}
export const Navbar = ({ isActive }: INavbarProps) => {
  const clsActive = !isActive ? classes.inActive : undefined;

  return (
    <nav className={`${classes.nav} ${clsActive}`}>
      <PixelBackground {...{ isActive }} />
      <motion.ul
        variants={animation}
        initial="initial"
        animate={isActive ? "open" : "exit"}
      >
        <li>Home</li>
        <li>Work</li>
        <li>Blog</li>
      </motion.ul>
    </nav>
  );
};
