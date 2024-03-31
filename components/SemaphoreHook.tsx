"use client";

import React from "react";

export type Semaphore = [number, () => void];

export const SemaphoreContext = React.createContext<Semaphore>([0, () => {}]);

export function useSemaphore(): Semaphore {
  const [value, setValue] = React.useState(0);

  return [
    value,
    () => {
      setValue((prev) => prev + 1);
    },
  ];
}
