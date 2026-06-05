import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/top-nav";
import { ProgressProvider } from "@/components/ProgressProvider";
import { AuthGuard } from "@/components/AuthGuard";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "SAA-C03 Learning Portal",
  description: "Domain-first self-learning portal for AWS Certified Solutions Architect – Associate (SAA-C03)",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <ProgressProvider>
          <main className="mx-auto max-w-7xl px-4 py-6">
            <AuthGuard portal="SAA-C03">{children}</AuthGuard>
          </main>
          <SiteFooter portalName="SAA-C03 Learning Portal" />
        </ProgressProvider>
      </body>
    </html>
  );
}
