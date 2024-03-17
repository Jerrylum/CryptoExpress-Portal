import React from "react";

export type Semaphore = [number, () => void];

export function useSemaphore(): Semaphore {
  const [value, setValue] = React.useState(0);

  return [
    value,
    () => {
      setValue((prev) => prev + 1);
    },
  ];
}
