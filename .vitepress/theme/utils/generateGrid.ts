export function generateGrid<T>(
  items: T[],
  maxItems?: number,
  groupFn?: (item: T) => string,
  columnCount = 3,
) {
  let workingItems = items.slice();
  if (maxItems && maxItems > 0) {
    workingItems = workingItems.slice(0, maxItems);
  }

  const distribute = (arr: T[]) => {
    const columns: T[][] = Array.from({ length: columnCount }, () => []);
    const heights = Array(columnCount).fill(0);

    arr.forEach((item) => {
      const h = estimateHeight(item);
      // 🔹 总是放到当前最矮列，无论列数
      const target = heights.indexOf(Math.min(...heights));
      columns[target].push(item);
      heights[target] += h;
    });

    return columns;
  };

  function estimateHeight(item: T) {
    const str =
      (item as any).desc || (item as any).content || (item as any).title || "";
    const base = 80;
    const factor = 5;
    return base + Math.min(String(str).length, 50) * factor;
  }

  if (!groupFn) {
    return [{ key: "all", columns: distribute(workingItems) }];
  }

  const map: Record<string, T[]> = {};
  workingItems.forEach((item) => {
    const key = groupFn(item);
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });

  return Object.keys(map).map((key) => ({
    key,
    columns: distribute(map[key]),
  }));
}
