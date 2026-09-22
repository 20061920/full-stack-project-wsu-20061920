// import { posts, type Post } from "../components/data";

export async function tags(posts: { tags: string; active: boolean }[]) {
  const map = new Map<string, number>();

  posts
    .filter((p) => p.active)
    .forEach((p) => {
      if (!p.tags) return;
      p.tags.split(",").forEach((t) => {
        const name = t.trim();
        if (!name) return;
        map.set(name, (map.get(name) || 0) + 1);
      });
    });

  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
//make an array of each post tags that are active and split them where there is a comma to make them independent
export function getTagList(posts: { tags: string; active: boolean }[]): string[] {
  return [...new Set(
            posts
                .filter((post) => post.active)
                .flatMap((post) => post.tags.split(",")),
        ),
    ];
  }