import { forwardRef, LegacyRef } from "react";
import classes from "./Header.module.css";
import { IconMenu } from "../../assets/IconMenu";
import { Magnetic } from "../Magnetic";

export const Header = forwardRef(function index(
  _,
  ref: LegacyRef<HTMLDivElement>,
) {
  return (
    <header className={classes.header}>
      <Magnetic>
        <div className={classes.iconContainer}>
          <div ref={ref} />
          <IconMenu />
        </div>
      </Magnetic>
    </header>
  );
});
