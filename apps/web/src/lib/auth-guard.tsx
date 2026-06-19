"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "./auth-client";

// Protects all pages except /login. Redirects users who are not logged in.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (isPending) return;
    if (!session && !isLoginPage) {
      router.replace("/login");
    }
    if (session && isLoginPage) {
      router.replace("/");
    }
  }, [session, isPending, isLoginPage, router]);

  if (isPending) {
    return <div className="p-8 text-muted-foreground">Loading…</div>;
  }

  if (!session && !isLoginPage) return null;

  return <>{children}</>;
}
