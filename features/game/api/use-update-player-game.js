import { useMutation } from "@tanstack/react-query";

import { updatePlayerGame } from "@/features/game/server/update-player-game";

export const useUpdatePlayerGame = () => {
  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updatePlayerGame(values);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);
    },
  });

  return mutation;
};
