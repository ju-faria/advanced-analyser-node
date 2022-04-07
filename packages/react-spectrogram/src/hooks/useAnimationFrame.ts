import { useRef, useEffect } from "react";

export const useAnimationFrame = (callback: (deltaTime: number ) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>(performance.now());

  const animate = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - previousTimeRef.current;
    previousTimeRef.current = currentTime;
    requestRef.current = requestAnimationFrame(animate);
    callback(
      deltaTime / 1000
    );
  };

  const cancel = () => {
    cancelAnimationFrame(requestRef.current);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return cancel;
  }, [callback]);
};

