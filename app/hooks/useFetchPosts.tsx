import { getPosts } from "@/lib/process";
import { createThreadedPosts } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const fetchPosts = async () => {
  const fetchedPosts = await getPosts();
  return createThreadedPosts(fetchedPosts);
};

export const useFetchPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};
