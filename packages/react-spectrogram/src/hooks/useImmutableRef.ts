import { useCallback, useState } from "react";

export const useImmutableRef = <T>(initialValue: T): [ref: (node:T) => void, current: T] => {
  const [current, setCurrent] = useState<T>(initialValue);
  const ref = useCallback<(node: T )=> void>(node => {
    if (node !== null) {
      setCurrent(node);
    }
  }, []);
  return [ref, current];
};
