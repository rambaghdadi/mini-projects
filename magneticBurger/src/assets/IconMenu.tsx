import { CSSProperties } from "react";

export const IconMenu = () => {
  const styleProps: CSSProperties = {
    mixBlendMode: "difference",
    stroke: "white",
  };
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path style={styleProps} d="M4 6l16 0" />
      <path style={styleProps} d="M4 12l16 0" />
      <path style={styleProps} d="M4 18l16 0" />
    </svg>
  );
};
