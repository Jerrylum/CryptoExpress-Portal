import React from "react";

export function randomUUID() {
  let rtn = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 16; i++) {
    rtn += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return rtn; 
}

export type WithId<T> = T & { id: string };

export function withId<T>(item: T, idKey: keyof T) {
  return {
    ...item,
    id: item[idKey] as string,
  };
}

export function useMobxStorage<T extends { destructor: () => void } | {}>(
  factory: () => T,
  deps: React.DependencyList = []
): T {
  const storage = React.useMemo(() => factory(), deps); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    return () => {
      if ("destructor" in storage && typeof storage.destructor === "function") storage.destructor?.();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return storage;
}
