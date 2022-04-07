import React from "react";

export const useAsyncMemo = <T,>(asyncFn: () => Promise<T>, deps: unknown[]): T | null => {
  const [result, setResult] = React.useState<T|null>(null);
  React.useEffect(() => {
    asyncFn().then(setResult);
  }, deps);
  return result;
};