import classes from "./Header.module.css";
import { IconMenu } from "../../assets/IconMenu";
import { Navbar } from "./components/Navbar/Navbar";
import { useState } from "react";
import { IconX } from "../../assets/IconX";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  function handleNavbarState() {
    setIsOpen(!isOpen);
  }

  return (
    <header className={classes.header}>
      {isOpen ? (
        <IconX onClick={handleNavbarState} />
      ) : (
        <IconMenu onClick={handleNavbarState} />
      )}
      <Navbar isActive={isOpen} />
    </header>
  );
};
