import { client } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";

function validatePost(data: Record<string, unknown>) {
  const title = String(data.title ?? "").trim();
  const description = String(data.description ?? "").trim();
  const content = String(data.content ?? "").trim();
  const tags = String(data.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean).join(","); //ensures that tags are trimmed and non-empty format is "tag1,tag2,tag3"
  const imageUrl = String(data.imageUrl ?? "").trim();
  const category = String(data.category ?? "").trim();

  if (!title || !description || !content || !tags || !imageUrl || !category) {
    return { error: "All post fields are required" };
  } // Validate the post data received in the request. Check if all required fields are present and valid. If any field is missing or invalid, return an error message.

  if (description.length > 200) {
    return { error: "Description must be 200 characters or less" };
  }

  try {
    new URL(imageUrl);
  } catch {
    return { error: "Image URL is invalid" };
  }

  // If all validations pass, return the validated post data.

  return { value: { title, description, content, tags, imageUrl, category } };
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ message: "Invalid post id" }, { status: 400 });
  }

  const result = validatePost(await request.json());
  if ("error" in result) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const existingPost = await client.db.post.findUnique({ where: { id } });
  if (!existingPost) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const post = await client.db.post.update({
    where: { id },
    data: result.value,
  });
  // Update the post in the database with the validated data. If the post is successfully updated, return the updated post data in the response.
  return NextResponse.json(post);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ message: "Invalid post id" }, { status: 400 });
  }

  const body = await request.json();
  if (typeof body.active !== "boolean") {
    return NextResponse.json({ message: "active must be a boolean" }, { status: 400 });
  }

  const post = await client.db.post.update({
    where: { id },
    data: { active: body.active },
    select: { id: true, active: true },
  });

  return NextResponse.json(post);
  // Update the active status of the post in the database. If the update is successful, return the updated post data in the response.
}
