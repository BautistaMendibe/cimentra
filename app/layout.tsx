import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import ImgLogoHeader from "@/components/img-logo-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Cimentra - Plataforma de gestion de proyectos y obras", 
  description: "Autmatiza la gestion de tus proyectos y obras con Cimentra",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>

          <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex flex-col flex-1 min-h-screen bg-background">
                <div className="flex-1 flex flex-col">
                <nav className="w-full border-b border-b-foreground/10 h-16 flex justify-center">
                  <div className="w-full flex justify-between items-center p-3 px-16 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                      <ImgLogoHeader />
                    </div>
                    <HeaderAuth />
                  </div>
                </nav>

                <div className="flex-1 flex flex-col gap-4 p-4 px-16">
                  {children}
                </div>
              </div>
                </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
