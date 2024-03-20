import React from "react";

export function TableCopyableCell(props: { value: string }) {
  return (
    <span
      title={props.value}
      className="hover:text-blue-600 cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(props.value);
      }}>
      {props.value}
    </span>
  );
}
