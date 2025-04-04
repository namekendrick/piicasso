import { DailyGame } from "@/features/game/components/daily-game";
import { Navbar } from "@/components/navbar";

export default async function Home() {
  return (
    <>
      <Navbar />
      <DailyGame />
    </>
  );
}
