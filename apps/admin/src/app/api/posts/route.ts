import { client } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
} 

function validatePost(data: Record<string, unknown>) {
  const title = String(data.title ?? "").trim();
  const description = String(data.description ?? "").trim();
  const content = String(data.content ?? "").trim();
  const tags = String(data.tags ?? "").trim();
  const imageUrl = String(data.imageUrl ?? "").trim();
  const category = String(data.category ?? "").trim();

  if (!title || !description || !content || !tags || !imageUrl || !category) {
    return { error: "All post fields are required" };
  }

  if (description.length > 200) {
    return { error: "Description must be 200 characters or less" };
  }

  try {
    new URL(imageUrl);
  } catch {
    return { error: "Image URL is invalid" };
  }

  return { value: { title, description, content, tags, imageUrl, category } };
}

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = validatePost(await request.json());
  if ("error" in result) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const values = result.value;
  const baseUrlId = slugify(values.title);
  let urlId = baseUrlId;
  let suffix = 2;

  while (await client.db.post.findUnique({ where: { urlId } })) {
    urlId = `${baseUrlId}-${suffix}`;
    suffix += 1;
  }

  const post = await client.db.post.create({
    data: { ...values, urlId },
  });

  return NextResponse.json(post, { status: 201 });
}
