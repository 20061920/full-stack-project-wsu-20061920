import { client } from "@repo/db/client";
import { toUrlPath } from "@repo/utils/url";
import { Navigation } from "@/components/Navigation";
import { Search} from "@/components/SearchHeader";
import { getCategoryList } from "@/functions/categories";
import { getTagList } from "@/functions/tags";
import { history } from "@/functions/history";
import Image from "next/image";

function scorePost(title: string, query: string): number {

  //scoring system based on how close the name after decoded is to the title and maps to be displayed
  const t = title.toLowerCase();
  const q = query.toLowerCase();

  if (t === q) return 3;
  if (t.startsWith(q)) return 2;
  if (t.includes(q)) return 1;
  return 0;
}

const POSTS_PER_PAGE = 6;

export default async function SearchResults({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {

  const { name } = await params;
  const posts = await client.db.post.findMany({ where: { active: true } });

  //decodes the typed input in the search bar and reformats any spaces
  const decoded = decodeURIComponent(name);

  //based on score results map everything and show the top result
  const results = posts
    .map((post) => ({ post, score: scorePost(post.title, decoded) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ post }) => post);
    // Sort the results by score in descending order and map them to just the post objects.

   //make an array of each post tags that are active and split them where there is a comma to make them independent
    const tagList = getTagList(posts);

    //make an array of each post that is active and map its category
    const categoryList = getCategoryList(posts);
    const dateList = history(posts);
    const pageParams = searchParams ? await searchParams : {};
    const requestedPage = Number.parseInt(pageParams.page ?? "1", 10);
    const totalPages = Math.max(1, Math.ceil(results.length / POSTS_PER_PAGE));
    const currentPage = Math.min(Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1), totalPages);
    const pageResults = results.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <main className="blog-page">
      <Search/>

      <div className="blog-body">
        <Navigation
          categoryList={categoryList}
          tagList={tagList}
          dateList={dateList}
        />

        <section className="blog-content">

          <div className="blog-section-head">
            <h2>From The Blog</h2>
          </div>

          <div className="blog-grid">
            {results.length > 0 ? (
              pageResults.map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-card-image" aria-hidden="true">
                    <Image src={post.imageUrl} alt={post.title} width={280} height={180} />
                  </div>
                  <div className="blog-card-body">
                    <h3>
                      <a href={`/details/${toUrlPath(post.title).toLowerCase()}`}>
                        {post.title}
                      </a>
                    </h3>
                    <p>{post.description}</p>

                    <div className="blog-meta">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="blog-card-tag">{post.category}</span>

                        {post.tags && (
                          <div className="blog-tags blog-tags--inline">
                            {post.tags.split(",").map((t) => (
                              <span key={t} className="blog-tag">{`#${t.trim()}`}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="blog-meta-right">
                        <span className="blog-date">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <span className="blog-views">{post.views} views</span>
                        <span className="blog-likes">{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p>0 posts found.</p>
            )}
          </div>

          <nav className="pagination" aria-label="Search result pages">
            {currentPage > 1 ? <a href={`/search/${name}?page=${currentPage - 1}`} className="pagination-link">Previous</a> : <span className="pagination-link pagination-link--disabled">Previous</span>}
            <span className="pagination-status">Page {currentPage} of {totalPages}</span>
            {currentPage < totalPages ? <a href={`/search/${name}?page=${currentPage + 1}`} className="pagination-link">Next</a> : <span className="pagination-link pagination-link--disabled">Next</span>}
          </nav>
        </section>
      </div>
    </main>
  );
}