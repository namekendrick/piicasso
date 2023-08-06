import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { ModalProvider } from "@/providers/modal-provider";

import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "Piicasso - An AI Image Guessing Game",
  description: "An AI image guessing game",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${nunito.className} scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-gray-100`}
        >
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
