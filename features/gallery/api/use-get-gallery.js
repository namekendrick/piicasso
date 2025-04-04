import { useInfiniteQuery } from "@tanstack/react-query";

import { getGallery } from "@/db/gallery";

export const useGetGallery = (values) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["gallery", values],
      queryFn: async ({ pageParam }) => {
        return await getGallery({ ...values, pageParam });
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
      initialPageParam: "",
    });

  return { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage };
};
