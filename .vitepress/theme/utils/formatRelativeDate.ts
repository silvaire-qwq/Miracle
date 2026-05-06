import { globalConfig } from "#config";
let l = globalConfig.lang;
export function formatRelativeDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  if (diffDays === 0) return l.today;
  if (diffDays === 1) return l.yesterday;
  if (diffDays <= 7) {
    const weekDays = [
      l.sunday,
      l.monday,
      l.tuesday,
      l.wednesday,
      l.thursday,
      l.friday,
      l.saturday,
    ];
    return `${weekDays[new Date(dateString).getDay()]}`;
  }
  if (diffDays <= 28) return `${Math.floor(diffDays / 7)} ${l.weeksAgo}`;
  const today = new Date();
  if (date.getFullYear() === today.getFullYear()) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
