import { useQuery } from "@tanstack/react-query";

import { getGames } from "@/db/game";

export const useGetGames = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: () => {
      return getGames();
    },
  });

  return { data, isLoading };
};
