type MonthlyCount = { count: number; month: number; year: number };

export function history(posts: { date: Date; active: boolean }[]): MonthlyCount[] {
  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts
const map = new Map<string, number>();

      posts
    .filter((p) => p.active == true) // only active posts
    .forEach((p) => {
      const d = new Date(p.date);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-12
      const key = `${year}-${month}`;
      map.set(key, (map.get(key) || 0) + 1);
    });

  return Array.from(map.entries())
    .map(([key, count]) => {
      const [yearStr, monthStr] = key.split("-");
      return { count, month: Number(monthStr), year: Number(yearStr) };
    })
    .sort((a, b) => (b.year - a.year) || (b.month - a.month)); // newest first
}

