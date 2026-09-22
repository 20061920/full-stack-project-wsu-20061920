import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth_token";

export function createAuthToken(username: string) {
  return jwt.sign({ username }, env.JWT_SECRET, { expiresIn: "1h" });
}

export async function isLoggedIn(): Promise<boolean> {
  const userCookies = await cookies();
  const token = userCookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
//checks if the user has a valid JWT token in the cookies, if not it will redirect to the login page. If the token is valid, it will return true.
