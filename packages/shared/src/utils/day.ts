import { PSEUDO_DAY_SECONDS, TIME_GAP_SECONDS } from "../constants/timing.js";

export function getCurrentDay(deploymentTime: number, now: number = Math.floor(Date.now() / 1000)): number {
  return Math.floor((now - deploymentTime) / PSEUDO_DAY_SECONDS);
}

export function getNextDayTimestamp(deploymentTime: number, currentDay: number): number {
  return deploymentTime + (currentDay + 1) * PSEUDO_DAY_SECONDS;
}

export function getTimeIntoDay(deploymentTime: number, now: number = Math.floor(Date.now() / 1000)): number {
  return (now - deploymentTime) % PSEUDO_DAY_SECONDS;
}

export function canExecuteLottery(deploymentTime: number, now: number = Math.floor(Date.now() / 1000)): boolean {
  return getTimeIntoDay(deploymentTime, now) >= TIME_GAP_SECONDS;
}

export function getLotteryExecutableTimestamp(deploymentTime: number, currentDay: number): number {
  return deploymentTime + currentDay * PSEUDO_DAY_SECONDS + TIME_GAP_SECONDS;
}
