import type { Metadata } from "next";
import { TRPCProvider } from "@/lib/trpc-provider";
import { AuthGuard } from "@/lib/auth-guard";
import "./globals.css";

export const metadata: Metadata = {
  title: "App",
  description: "Monorepo starter template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCProvider>
          <AuthGuard>{children}</AuthGuard>
        </TRPCProvider>
      </body>
    </html>
  );
}
