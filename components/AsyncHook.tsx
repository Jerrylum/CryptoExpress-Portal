import React from "react";

export function useAsyncHook<T>(factory: () => Promise<T>, deps?: React.DependencyList | undefined): T | null {
  const [data, setData] = React.useState<T | null>(null);

  React.useEffect(() => {
    factory().then(setData);
  }, deps);

  return data;
}

export function useAsyncTransition<T>(factory: () => Promise<T>, deps?: React.DependencyList | undefined): [T | null, boolean] {
  const [data, setData] = React.useState<T | null>(null);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    startTransition(() => {
      factory().then(setData);
    });
  }, deps);

  return [data, isPending];
}
