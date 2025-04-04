import { useQuery } from "@tanstack/react-query";

import { getPlayerGame } from "@/db/game";

export const useGetPlayerGame = (values) => {
  const { data, isLoading } = useQuery({
    queryKey: ["player-game", values?.userId, values?.gameId],
    queryFn: () => {
      return getPlayerGame(values);
    },
    enabled: !!values,
  });

  return { data, isLoading };
};
