"use client";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  async function handleLogout() {
    const response = await fetch("/api/auth/logout", { method: "DELETE" });

    if (response.ok) {
      window.location.href = "/";
    }
  }

  return (
    <button type="button" className={className} onClick={handleLogout}>
      Logout
    </button>
  );
}
