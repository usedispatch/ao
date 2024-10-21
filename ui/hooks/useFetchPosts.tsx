import { getPosts, Post } from "@/lib/process";
import { createThreadedPosts } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const fetchPosts = async (): Promise<Post[]> => {
  const fetchedPosts = await getPosts();
  return createThreadedPosts(fetchedPosts);
};

export const useFetchPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};
