import { useState, useEffect } from "react";

export function useCountdown(targetTimestamp: number) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    return Math.max(0, targetTimestamp - Math.floor(Date.now() / 1000));
  });

  useEffect(() => {
    const update = () => {
      const remaining = targetTimestamp - Math.floor(Date.now() / 1000);
      setSecondsLeft(Math.max(0, remaining));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return secondsLeft;
}
