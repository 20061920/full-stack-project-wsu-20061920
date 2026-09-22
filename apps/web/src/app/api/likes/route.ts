import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
} // Get the client's IP address from the request headers. This is used to identify unique users for liking posts.

export async function GET(request: Request) {
  const postId = Number(new URL(request.url).searchParams.get("postId"));
  const userIP = getClientIp(request);

  if (!Number.isInteger(postId) || postId < 1) {
    return NextResponse.json({ message: "A valid postId is required" }, { status: 400 });
  } // get the postId from the query parameters and validate it. If it's not a valid integer greater than 0, return a 400 error.

  const [post, like] = await Promise.all([
    client.db.post.findUnique({ where: { id: postId }, select: { likes: true } }),
    client.db.like.findUnique({ where: { postId_userIP: { postId, userIP } } }),
  ]); // Fetch the post's like count and check if the user has already liked the post using a transaction. This is done in parallel for efficiency.

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  } // If the post doesn't exist, return a 404 error.

  return NextResponse.json({ liked: Boolean(like), likes: post?.likes ?? 0 });
} // Return a JSON response indicating whether the user has liked the post and the total number of likes for the post. If the post doesn't exist, return 0 likes.

async function getPostId(request: Request) {
  const body = await request.json();
  const postId = Number(body.postId);
  return Number.isInteger(postId) && postId > 0 ? postId : null;
} // Helper function to extract and validate the postId from the request body. Returns the postId if valid, otherwise returns null.

export async function POST(request: Request) {
  const postId = await getPostId(request);
  if (!postId) {
    return NextResponse.json({ message: "A valid postId is required" }, { status: 400 });
  } // Get the postId from the request body and validate it. If it's not valid, return a 400 error.

  const userIP = getClientIp(request);
  const existingLike = await client.db.like.findUnique({
    where: { postId_userIP: { postId, userIP } },
  }); // Check if the user has already liked the post by querying the likes table for a record with the given postId and userIP.

  if (existingLike) {
    const post = await client.db.post.findUnique({ where: { id: postId } });
    return NextResponse.json({ liked: true, likes: post?.likes ?? 0 });
  } // If the user has already liked the post, return a JSON response indicating that the post is already liked and the current like count.

  const post = await client.db.$transaction(async (transaction) => {
    await transaction.like.create({ data: { postId, userIP } });
    return transaction.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    });
  }); // If the user hasn't liked the post yet, create a new like record and increment the post's like count in a transaction to ensure data consistency. Return the updated like count.

  return NextResponse.json({ liked: true, likes: post.likes });
} // Return a JSON response indicating that the post has been liked and the updated like count.

export async function DELETE(request: Request) {
  const postId = await getPostId(request);
  if (!postId) {
    return NextResponse.json({ message: "A valid postId is required" }, { status: 400 });
  } // Get the postId from the request body and validate it. If it's not valid, return a 400 error.

  const userIP = getClientIp(request);
  const existingLike = await client.db.like.findUnique({
    where: { postId_userIP: { postId, userIP } },
  }); // Check if the user has already liked the post by querying the likes table for a record with the given postId and userIP.

  if (!existingLike) {
    const post = await client.db.post.findUnique({ where: { id: postId } });
    return NextResponse.json({ liked: false, likes: post?.likes ?? 0 });
  } // If the user hasn't liked the post yet, return a JSON response indicating that the post is not liked and the current like count.

  const post = await client.db.$transaction(async (transaction) => {
    await transaction.like.delete({ where: { postId_userIP: { postId, userIP } } });
    return transaction.post.update({
      where: { id: postId },
      data: { likes: { decrement: 1 } },
      select: { likes: true },
    });
  }); // If the user has liked the post, delete the like record and decrement the post's like count in a transaction to ensure data consistency. Return the updated like count.

  return NextResponse.json({ liked: false, likes: post.likes });
}
