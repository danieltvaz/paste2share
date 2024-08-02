import "./button.css";

import { ComponentProps } from "react";

export default function Button({ variant, ...props }: ComponentProps<"button"> & { variant: "blue" | "red" }) {
  return (
    <button {...props} className={variant === "blue" ? "button-blue" : "button-red"}>
      {props.children}
    </button>
  );
}
