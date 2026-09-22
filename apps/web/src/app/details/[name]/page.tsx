import { client } from "@repo/db/client";
import styles from "./page.module.css";
import { Navigation } from "@/components/Navigation";
import { history } from "@/functions/history";
import { Search } from "@/components/SearchHeader";
import { getCategoryList } from "@/functions/categories";
import { getTagList } from "@/functions/tags";
import { LikeButton } from "@/components/LikeButton";
import DOMPurify from "isomorphic-dompurify"; //used to sanitize the html content and prevent XSS attacks
import Image from "next/image";

export default async function DetailsPost({ params }: { params: Promise<{ name: string }> }) {

    const { name } = await params;
    
    const postBeforeView = await client.db.post.findFirst({
        where: { urlId: name, active: true },
    });
    const selectedPost = postBeforeView
        ? await client.db.post.update({
            where: { id: postBeforeView.id },
            data: { views: { increment: 1 } },
        })
        : null;
        // Increment the view count for the selected post if it exists. If the post is found, update its view count by incrementing it by 1. If not found, set selectedPost to null.
    const posts = await client.db.post.findMany({ where: { active: true } });
    //make an array of each post tags that are active and split them where there is a comma to make them independent

    const tagList = getTagList(posts);

    //make an array of each post that is active and map its category
    const categoryList = getCategoryList(posts);
    const dateList = history(posts);

    //searches to return the one with the same title 
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


                    {selectedPost ? (
                        <article className="post-detail">
                            <div className="post-detail-image">
                                <Image src={selectedPost.imageUrl} alt={selectedPost.title} width={280} height={180} />
                            </div>  

                            <div className="post-detail-body">
                                <span className="blog-card-tag">{selectedPost.category}</span>
                                <h1>{selectedPost.title}</h1>
                                <div
                                className={styles["post-detail-content"]}
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(selectedPost.content),
                                }}
                                />

                                <div className="post-detail-meta">
                                    <span className="blog-date">
                                        {new Date(selectedPost.date).toLocaleDateString()}
                                    </span>
                                    <span className="blog-views">{selectedPost.views} views</span>

                                    {selectedPost.tags && (
                                        <div className="blog-tags blog-tags--inline">
                                            {selectedPost.tags.split(",").map((t) => (
                                                <span key={t} className="blog-tag">{`#${t.trim()}`}</span>
                                            ))}
                                            <LikeButton postId={selectedPost.id} initialLikes={selectedPost.likes} />
                                        </div>



                                    )}
                                </div>
                            </div>
                        </article>
                    ) : (
                        <p>Post not found.</p>
                    )}
                </section>
            </div>
        </main>
    );
}
