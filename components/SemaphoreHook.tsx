import React from "react";

export function useSemaphore(): [number, () => void] {
  const [value, setValue] = React.useState(0);

  return [
    value,
    () => {
      setValue((prev) => prev + 1);
    },
  ];
}
