import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// Only "/auth" is public
const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (request) => {
  const isPublic = isPublicPage(request);
  const isAuthenticated = await isAuthenticatedNextjs();

  // 1. If not authenticated and page is not public → redirect to /auth
  if (!isPublic && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }

  // 2. If authenticated and visiting /auth → redirect to homepage
  if (isPublic && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  // 3. Otherwise, allow request
});


export const config = {
  matcher: ["/((?!.*\\..*|_next|favicon.ico).*)"],
};
