import { posts } from "@repo/db/data";
import Image from "next/image";
import { Press_Start_2P } from "next/font/google";
import { notFound } from "next/navigation";

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
});

export default async function Page({
    params,
}: {
    params: Promise<{ urlid: string }>;
}) {
    // Fetch the post data based on the URL parameter (urlid) from the params object. The posts data is imported from the database.
    const { urlid } = await params;

    const filteredpost = posts.find((post) => post.urlId === urlid);

    if (!filteredpost) {
        notFound();
    }
    // Check if the post has an image URL and if it's not empty. This will be used to conditionally render the image in the component.
    const hasImage = filteredpost.imageUrl && filteredpost.imageUrl.trim() !== "";

    return (
        <div>
            <h1>Post Selected: {urlid} </h1>
            <hr />
            <ul>
                <li key={filteredpost.id}>
                    <h2 className={pressStart2P.className}> Title: {filteredpost.title} </h2>
                    <div>Content: {filteredpost.content}</div>
                    {hasImage && (
                        <div>
                            Image:
                            <Image
                                src={filteredpost.imageUrl}
                                alt="image"
                                width={600}
                                height={600}
                            />
                        </div>
                    )}
                    <hr />
                </li>
            </ul>
        </div>
    );
}