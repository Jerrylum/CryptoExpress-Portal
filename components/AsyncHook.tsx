import React from "react";

export function useAsyncHook<T>(factory: () => Promise<T>, deps?: React.DependencyList | undefined): T | null {
  const [data, setData] = React.useState<T | null>(null);

  React.useEffect(() => {
    factory().then(setData);
  }, deps);

  return data;
}
