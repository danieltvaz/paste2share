import "./styles.css";

import { ComponentProps, useState } from "react";

export default function TextArea(props: ComponentProps<"textarea">) {
  const [characterLength, setCharacterLength] = useState(0);

  return (
    <>
      <textarea
        {...props}
        onChange={(e) => {
          props.onChange?.(e);
          setCharacterLength(e.target.value.length);
        }}
      />
      <span>{characterLength} characters</span>
    </>
  );
}
