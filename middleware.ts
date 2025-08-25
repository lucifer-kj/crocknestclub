import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/instamojo",
    "/store", // Allow public access to storefront
    "/store/(.*)", // Allow all storefront routes
    "/api/[storeId]/products", // Make product APIs public
    "/api/[storeId]/categories",
    "/api/[storeId]/billboards",
    "/api/[storeId]/sizes",
    "/api/[storeId]/colors"
  ],
  ignoredRoutes: ["/api/health"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};