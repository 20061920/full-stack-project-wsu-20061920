import { client } from "@repo/db/client";
import { Navigation } from "@/components/Navigation";
import { Search } from "@/components/SearchHeader";
import { getCategoryList } from "@/functions/categories";
import { getTagList } from "@/functions/tags";
import { history } from "@/functions/history";
import Image from "next/image";

const POSTS_PER_PAGE = 6;

export default async function HistoryPosts({
    params,
    searchParams,
}: {
    params: Promise<{ name: string }>;
    searchParams?: Promise<{ page?: string }>;
}) {

    //make dynamic route params with async. name is used as a dynamic paramater and is used for the url string and data passed
    const { name } = await params;
    const posts = await client.db.post.findMany();

    //make an array of each post tags that are active and split them where there is a comma to make them independent
    const tagList = getTagList(posts);

     //make an array of each post that is active and map its category
    const categoryList = getCategoryList(posts);
    const dateList = history(posts);

    // route param expected as "YYYY-MM" (same key used in Navigation)
    const [yearStr, monthStr] = name.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    //filters the posts with active and if it matches with the year and the month of the paramaters id
    const filteredDates = posts.filter(
        (post) => post.active && new Date(post.date).getFullYear() === year && (new Date(post.date).getMonth() + 1) === month
    );
    const pageParams = searchParams ? await searchParams : {};
    const requestedPage = Number.parseInt(pageParams.page ?? "1", 10);
    const totalPages = Math.max(1, Math.ceil(filteredDates.length / POSTS_PER_PAGE));
    const currentPage = Math.min(Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1), totalPages);
    const pagePosts = filteredDates.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

    return (
        <main className="blog-page">
            <Search />

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
                        {pagePosts.map((post) => (

                            <article key={post.title} className="blog-card">
                                <div className="blog-card-image" aria-hidden="true">
                                    <Image src={post.imageUrl} alt={post.title} width={280} height={180} />
                                </div>
                                <div className="blog-card-body">
                                    <h3>
                                        <a href={`/details/${post.urlId}`}>{post.title}</a>
                                    </h3>
                                    <p>{post.description}</p>

                                    <div className="blog-meta">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                                            <span className="blog-date">{new Date(post.date).toLocaleDateString()}</span>
                                            <span className="blog-views">{post.views} views</span>
                                            <span className="blog-likes">{post.likes} likes</span>

                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <nav className="pagination" aria-label="Date archive pages">
                        {currentPage > 1 ? <a href={`/date/${name}?page=${currentPage - 1}`} className="pagination-link">Previous</a> : <span className="pagination-link pagination-link--disabled">Previous</span>}
                        <span className="pagination-status">Page {currentPage} of {totalPages}</span>
                        {currentPage < totalPages ? <a href={`/date/${name}?page=${currentPage + 1}`} className="pagination-link">Next</a> : <span className="pagination-link pagination-link--disabled">Next</span>}
                    </nav>
                </section>
            </div>
        </main>
    );
}
