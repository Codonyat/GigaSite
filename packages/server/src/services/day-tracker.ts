import { getCurrentDay, PSEUDO_DAY_SECONDS } from "@gigasite/shared";

type DayChangedCallback = (newDay: number) => void;

export function createDayTracker(deploymentTime: number, onDayChanged: DayChangedCallback) {
  let lastKnownDay = getCurrentDay(deploymentTime);
  let timer: ReturnType<typeof setTimeout> | null = null;

  function scheduleNextCheck() {
    const now = Math.floor(Date.now() / 1000);
    const currentDay = getCurrentDay(deploymentTime, now);
    const nextDayStart = deploymentTime + (currentDay + 1) * PSEUDO_DAY_SECONDS;
    const msUntilNextDay = (nextDayStart - now) * 1000 + 1000; // +1s buffer

    timer = setTimeout(() => {
      const newDay = getCurrentDay(deploymentTime);
      if (newDay > lastKnownDay) {
        lastKnownDay = newDay;
        onDayChanged(newDay);
      }
      scheduleNextCheck();
    }, msUntilNextDay);
  }

  scheduleNextCheck();

  return {
    cleanup() {
      if (timer) clearTimeout(timer);
    },
  };
}
