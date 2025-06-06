import "./button.css";

import { ComponentProps } from "react";

export default function Button({
  variant,
  ...props
}: ComponentProps<"button"> & { variant: "blue" | "red"; width?: string }) {
  return (
    <button {...props} className={variant === "blue" ? "button-blue" : "button-red"} style={{ width: props.width }}>
      {props.children}
    </button>
  );
}
