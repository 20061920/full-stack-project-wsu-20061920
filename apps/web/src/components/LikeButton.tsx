"use client";

import { useEffect, useState } from "react";

export function LikeButton({ postId, initialLikes }: { postId: number; initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/likes?postId=${postId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (result) {
          setLiked(result.liked);
          setLikes(result.likes);
        }
      });
  }, [postId]); // Fetch the initial like status and count for the post when the component mounts or when the postId changes. Update the liked and likes state accordingly.

  async function toggleLike() {
    if (loading) return;

    setLoading(true);
    const response = await fetch("/api/likes", {
      method: liked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });

    if (response.ok) {
      const result = await response.json();
      setLiked(result.liked);
      setLikes(result.likes);
    }

    setLoading(false);
  } // Toggle the like status for the post when the button is clicked. 
  // If the user has already liked the post, send a DELETE request to remove the like; otherwise, send a POST request to add a like. Update the liked and likes state based on the response.

  return (
    <button type="button" className="likeButton" onClick={toggleLike} disabled={loading}>
      <span className="leftContainer">
        <svg fill="currentColor" viewBox="0 0 512 512" height="1em" aria-hidden="true">
          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
        </svg>
        <span>{liked ? "Unlike" : "Like"}</span>
      </span>
      <span className="likeCount">{likes.toLocaleString()}</span>
    </button>
  );
}
