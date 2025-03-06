import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function middleware(req:NextRequest){
  const token = (await cookies()).get('accessToken')?.value;

  if (!token && req.nextUrl.pathname !== "/login") {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }
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
