import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Particles } from "../components/Particles";
import { CustomCursor } from "../components/CustomCursor";
import { Nav } from "../components/Nav";
import { CoupleProvider, useCouple } from "../contexts/CoupleContext";
import { getCoupleBySlug } from "../lib/api";
import { BackgroundMusic } from "../components/BackgroundMusic";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ location }) => {
    // Skip Supabase calls during SSR to avoid WebSocket issues in Node.js 20
    if (typeof window === 'undefined') {
      return { couple: null };
    }
    
    // Only fetch couple if we're on a slug route (not root, not edit, not other named routes)
    const pathParts = location.pathname.split('/').filter(Boolean);
    const isRootRoute = pathParts.length === 0;
    const isEditRoute = pathParts.length > 0 && pathParts[0] === 'edit';
    const isNamedRoute = pathParts.length > 0 && ['date', 'letter', 'reasons', 'compliments', 'constellation', 'garden', 'finale', 'gallery', 'voice'].includes(pathParts[0]);
    
    if (!isRootRoute && !isEditRoute && !isNamedRoute && pathParts.length > 0) {
      const slug = pathParts[0];
      const couple = await getCoupleBySlug(slug);
      return { couple };
    }
    return { couple: null };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Always Us — A Little Love Letter" },
      { name: "description", content: "A romantic interactive love letter, page by page." },
      { property: "og:title", content: "Always Us — A Little Love Letter" },
      { property: "og:description", content: "A romantic interactive love letter, page by page." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Poppins:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { couple } = Route.useLoaderData();
  const { location } = useRouter();

  // Only show music on public couple pages (not creation form, not edit dashboard)
  const isPublicCouplePage = couple !== null && !location.pathname.startsWith('/edit');

  return (
    <QueryClientProvider client={queryClient}>
      <CoupleProvider initialCouple={couple}>
        <Particles />
        <CustomCursor />
        <Nav />
        <Outlet />
        <BackgroundMusic show={isPublicCouplePage} />
      </CoupleProvider>
    </QueryClientProvider>
  );
}
