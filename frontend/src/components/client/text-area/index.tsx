import "./styles.css";

import { ComponentProps, useState } from "react";

export default function TextArea(props: ComponentProps<"textarea">) {
  return (
    <>
      <textarea
        {...props}
        onChange={(e) => {
          props.onChange?.(e);
        }}
      />
      <span>{props.value?.toString().length ?? "0"} characters</span>
    </>
  );
}
