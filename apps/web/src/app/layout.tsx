import type { Metadata } from "next";
import { Roboto } from "next/font/google";


import "./globals.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Full-Stack Blog",
  description: "Blog about full stack development",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={roboto.variable}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.body.classList.add('dark-mode');
                }
              } catch (e) {}
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}