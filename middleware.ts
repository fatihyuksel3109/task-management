import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (
        req.nextUrl.pathname.startsWith('/auth') ||
        req.nextUrl.pathname === '/'
      ) {
        return true;
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|auth/signin).*)',
  ],
}; 