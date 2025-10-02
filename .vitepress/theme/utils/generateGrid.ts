export function generateGrid<T>(
  items: T[],
  maxItems?: number,
  groupFn?: (item: T) => string,
  columnCount = 3
) {
  let workingItems = items.slice();
  if (maxItems && maxItems > 0) {
    workingItems = workingItems.slice(0, maxItems);
  }

  // 🔹 分配函数（参考 grid 思路）
  const distribute = (arr: T[]) => {
    const columns: T[][] = Array.from({ length: columnCount }, () => []);
    arr.forEach((item, i) => {
      // 这里按列数动态取余，类似 grid 的 repeat()
      columns[i % columnCount].push(item);
    });
    return columns;
  };

  // 如果没有 groupFn，就默认只有一组
  if (!groupFn) {
    return [{ key: "all", columns: distribute(workingItems) }];
  }

  // 按 groupFn 分组
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
