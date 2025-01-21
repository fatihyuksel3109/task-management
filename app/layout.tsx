import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from '@/contexts/ThemeContext';

const geist = Geist({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "TaskFlow | Modern Task Management",
  description: "A modern, intuitive task management application to help you stay organized and productive.",
  keywords: ["task management", "productivity", "organization", "project management", "todo list"],
  authors: [{ name: "Fatih YUKSEL" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased bg-gray-50 dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  {children}
                </div>
              </main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
