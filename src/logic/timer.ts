export function remainingTime(deadline: number, now: number): number {
  return Math.max(0, deadline - now);
}
export function formatTime(milliseconds: number): string {
  const seconds = Math.ceil(Math.max(0, milliseconds) / 1000);
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}
