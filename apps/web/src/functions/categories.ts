export function categories(
  posts: { category: string; active: boolean }[],
): { name: string; count: number }[] {
  return posts
    .filter((p) => p.active)
    .sort((a, b) => a.category.localeCompare(b.category))
    .reduce(
      (acc, post) => {
        const category = acc.find((c) => c.name === post.category);
        if (category) {
          category.count++;
        } else {
          acc.push({ name: post.category, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[],
    );
}

//make an array of each post that is active and map its category
export function getCategoryList(posts: { category: string; active: boolean }[]): string[] {
  return [...new Set(
            posts
                .filter((post) => post.active)
                .map((post) => post.category)
        ),
    ];
  }
  
  