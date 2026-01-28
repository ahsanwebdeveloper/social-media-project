import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        
        if (pathname.startsWith("/api/auth")) {
          return true;
        }


        if (pathname === "/" || pathname === "/login" || pathname === "/register") {
          return true;
        }

        
        if (pathname.startsWith("/api/video") && req.method === "GET") {
          return true;
        }

        
        if (pathname.startsWith("/api/cloudinary")) {
          return !!token;
        }

        
        if (pathname.startsWith("/api/video")) {
          return !!token;
        }

  
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
