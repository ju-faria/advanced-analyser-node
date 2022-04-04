import { useEffect, useState } from "react";

export const useKey = (keyCode: string) => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.code === keyCode) {
        setIsPressed(true);
      }
    };
    const keyupHandler = (event: KeyboardEvent) => {
      if (event.code === keyCode) {
        setIsPressed(false);
      }
    };
    
    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("keyup", keyupHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
      document.removeEventListener("keyup", keyupHandler);
    };
  }, [keyCode]);
  return isPressed;
};

