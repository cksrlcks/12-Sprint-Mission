import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/addBoard",
    "/modifyBoard/:path",
    "/addItem",
    "/modifyItem/:path",
    "/mypage",
    "/changePassword",
    "/editProfile",
  ],
};
