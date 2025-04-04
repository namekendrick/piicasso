import { useMutation } from "@tanstack/react-query";

import { generateDailyImage } from "@/features/game/server/generate-daily-image";

export const useGenerateDailyImage = () => {
  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await generateDailyImage(values);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response.imageUrl;
    },
  });

  return mutation;
};
