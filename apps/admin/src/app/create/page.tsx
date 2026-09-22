import { isLoggedIn } from "../../utils/auth";
import { PostForm } from "../../components/PostForm";
import { redirect } from "next/navigation";

export default async function CreatePage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/");
  }

  return <PostForm />;
}
