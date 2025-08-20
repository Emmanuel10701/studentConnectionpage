import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./_app"; // your session wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KCUTSA  community",
  description: "A vibrant community platform connecting young talents with employers and opportunities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />

        {/* Single favicon for your logo */}
        <link rel="icon" href="/leaders/KCUTSA_LOGO.png" /> 
        {/* Place your "my-logo.ico" in the public/ folder */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
