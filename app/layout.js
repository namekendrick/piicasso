import { Nunito } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { GameProvider } from "@/providers/game-provider";
import { ModalProvider } from "@/providers/modal-provider";
import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
});

export const metadata = {
  title: "Piicasso | An AI Image Guessing Game",
  description: "Identify the secret prompt from 3 image clues.",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={nunito.className}>
          <QueryProvider>
            <GameProvider>
              <ModalProvider />
              {children}
            </GameProvider>
          </QueryProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
