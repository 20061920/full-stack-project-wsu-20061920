"use client";

import { useState } from "react";
import type { ButtonHTMLAttributes } from "react";
//imports typescript types for button attributes from react

interface ActiveStatusButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  postId: number;
  active: boolean;
  activeClassName?: string;
  inactiveClassName?: string;
}
//defines the props for the ActiveStatusButton component,
//extending the default button attributes and adding an "active" boolean prop

export function ActiveStatusButton({ postId, active: initialActive, activeClassName, inactiveClassName, ...props }: ActiveStatusButtonProps) {
  const [active, setActive] = useState(initialActive);
  const [saving, setSaving] = useState(false);

  async function toggleStatus() {
    if (saving) return;

    setSaving(true);
    const response = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });

    if (!response.ok) {
      window.alert("Could not save the post status.");
    } else {
      const result = await response.json();
      setActive(result.active);
    }

    setSaving(false);
  }

  return (
    <button
      {...props}
      type="button"
      onClick={toggleStatus}
      disabled={saving}
      className={active ? activeClassName : inactiveClassName}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
}

