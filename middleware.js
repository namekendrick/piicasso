import { authMiddleware } from "@clerk/nextjs";

// Edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring this middleware
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook", "/api/image", "/api/user"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
