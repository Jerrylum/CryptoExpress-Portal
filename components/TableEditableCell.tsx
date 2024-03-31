"use client";

import React from "react";

export function TableEditableCell(props: { getter: () => string; setter: (value: string) => void }) {
  const [value, setValue] = React.useState(props.getter());

  React.useEffect(() => {
    setValue(props.getter());
  }, [props.getter()]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (event: React.SyntheticEvent<HTMLInputElement>) => {
    if (value.trim() === "") {
      props.setter(props.getter());
    } else {
      props.setter(value);
    }
    event.preventDefault();
    (event.target as HTMLInputElement).blur();
  };

  return (
    <input
      type="text"
      style={{
        width: "100%",
        border: "none",
        fontSize: "1rem",
        padding: 0,
        margin: 0,
        boxShadow: "none"
      }}
      value={value}
      onChange={event => {
        const proposed = event.target.value;
        setValue(proposed);
      }}
      onKeyDown={event => {
        if (event.key === "Enter") {
          submit(event);
        }
      }}
      onBlur={event => {
        submit(event);
      }}
    />
  );
}
