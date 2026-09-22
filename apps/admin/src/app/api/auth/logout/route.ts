import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  return NextResponse.redirect(new URL("/", request.url));
}
// uses delete method to delete the auth_token cookie and redirect the user to the login page. This is used in the LogoutButton component to log the user out of the application.