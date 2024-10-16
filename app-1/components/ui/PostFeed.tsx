import { useEffect, useState } from "react";
import { getPosts } from "@/lib/process";

interface Post {
  Id: number;
  Text: string;
  CreatedAt: string;
  Creator: string;
}

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Post Feed</h2>
      {posts.map((post) => (
        <div key={post.Id} className="border p-4 mb-4 rounded-md">
          <p className="mb-2">{post.Text}</p>
          <p className="text-sm text-gray-500">
            Posted by {post.Creator} on {new Date(post.CreatedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
