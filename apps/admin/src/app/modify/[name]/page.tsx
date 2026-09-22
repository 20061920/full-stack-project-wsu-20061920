import { isLoggedIn } from "../../../utils/auth";
import { PostForm } from "../../../components/PostForm";
import { redirect } from "next/navigation";
import { client } from "@repo/db/client";

export default async function ModifyPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/");
  }

  const { name } = await params;
  const posts = await client.db.post.findMany();
  const post = posts.find((p) => p.urlId === name);

  if (!post) {
    redirect("/");
  }
// Create an initialPost object with the post data, converting the date to a string in "YYYY-MM-DD" format for the PostForm component.
  const initialPost = {
  id: post.id.toString(),
  title: post.title,
  description: post.description,
  content: post.content || "",
  tags: post.tags,
  imageUrl: post.imageUrl,
  category: post.category,
  date: post.date.toISOString().split("T")[0], // "YYYY-MM-DD" string, matching PostForm's Post.date
  active: post.active,
};
  // Render the PostForm component with the initialPost data and set isEdit to true, indicating that this is an edit form.
  return <PostForm initialPost={initialPost} isEdit={true} />;
}
