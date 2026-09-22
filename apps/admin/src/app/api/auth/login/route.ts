import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { createAuthToken } from "../../../../utils/auth";

export async function POST(request: Request) {
  //request form data where username and password are sent from the login form
  const formData = await request.formData();
  const username = String(formData.get("uname") ?? "");
  const password = String(formData.get("psw") ?? "");

  //search the database from neon for the admin username and password hash
  const admin = await client.db.admin.findUnique({ where: { username } });

  const passwordMatches = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  //search the database from neon for the admin username and password hash.

  if (!admin || !passwordMatches) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("error", "Invalid username or password");

    return NextResponse.redirect(redirectUrl);
  }

  //if the username and password are correct, create a JWT token and set it as a cookie

  const cookieStore = await cookies();

  cookieStore.set("auth_token", createAuthToken(username), {
    httpOnly: true,
    sameSite: "strict", //anti-CSRF
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1hr
  }); // Set the auth_token cookie with the JWT token, making it HTTP-only, secure in production, and valid for 1 hour.

  return NextResponse.redirect(new URL("/", request.url));
}
