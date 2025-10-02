export function getRunningTime(startDate: string): string {
  const start = new Date(`${startDate}`);
  const now = new Date();

  // Calculate total difference in milliseconds
  const diff = now.getTime() - start.getTime();

  // Calculate total days
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return `${days}`;
}
