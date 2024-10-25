"use client";

import { useState, useEffect } from "react";
import { Post, getPosts, addPost, connectArConnectWallet } from "@/lib/process";
import { PostCard } from "@/components/PostCard";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ProfileCreationDialog } from "@/components/ProfileDialog";
import { createThreadedPosts } from "@/lib/utils";
import { useProfile } from "@/components/ProfileProvider";
import { useParams } from "@/arnext";

interface SinglePostPageParams {
  id?: string;
  post?: Post;
}

const fetchPost = async (id: string, setPost?: any): Promise<Post | null> => {
  try {
    const posts = await getPosts();
    const threadedPosts = createThreadedPosts(posts);
    const foundPost = threadedPosts.find((p) => p.Id === id);
    if (foundPost) {
      foundPost.Replies = posts.filter((p) => p.ParentId === foundPost.Id);
    }
    if (setPost) {
      console.log("setting post", foundPost);
      setPost(foundPost || null);
    }
    console.log("foundPost", foundPost);
    return foundPost;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export default function SinglePostPage({
  _post = undefined,
}: {
  _post?: Post | undefined;
}) {
  const params = useParams();

  const id = params?.id as string | undefined;
  const [post, setPost] = useState<Post | undefined>(_post);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { profile, setProfile } = useProfile();
  const handleConnectWallet = async () => {
    const connected = await connectArConnectWallet();
    setIsConnected(connected);
  };

  useEffect(() => {
    (async () => {
      try {
        const posts = await getPosts();
        const threadedPosts = createThreadedPosts(posts);
        const foundPost = threadedPosts.find((p) => p.Id === id);
        if (foundPost) {
          foundPost.Replies = posts.filter((p) => p.ParentId === foundPost.Id);
        }

        console.log("foundPost", foundPost, posts, threadedPosts);
        setPost(foundPost || null);
        return foundPost;
      } catch (error) {
        console.error("Error fetching post:", error);
        return null;
      }
    })();
  }, [id]);

  const createReply = async (newReply: string, parentId?: string) => {
    if (newReply.trim()) {
      setIsReplying(true);
      try {
        await addPost(newReply, parentId);
        toast({
          title: "Reply posted",
          description: "Your reply has been added to the thread.",
        });
        // Refresh the post to include the new reply
        if (parentId === post?.Id) {
          post?.Replies?.push({
            Id: "newReply",
            Text: newReply,
            Creator: profile?.DisplayName || "Anonymous",
            CreatedAt: new Date().toISOString(),
            ParentId: parentId,
            Cid: "",
            ReplyCid: "",
            ReplyUri: "",
            Likes: 0,
          });
        } else {
          const foundParent = post?.Replies?.find((p) => p.Id === parentId);
          if (foundParent) {
            foundParent.Replies?.push({
              Id: "newReply",
              Text: newReply,
              Creator: profile?.DisplayName || "Anonymous",
              CreatedAt: new Date().toISOString(),
              ParentId: parentId,
              Cid: "",
              ReplyCid: "",
              ReplyUri: "",
              Likes: 0,
            });
          }
          setPost(post);
        }
      } catch (error) {
        console.error("Error creating reply:", error);
        toast({
          title: "Error",
          description: "Failed to post reply. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsReplying(false);
      }
    }
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!post) {
  //   return <div>Post not found</div>;
  // }

  return (
    <div className=" mx-auto ">
      <div className="min-h-screen bg-[#F1F0EA] font-sans flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 overflow-y-auto">
          {post ? (
            <PostCard
              post={post}
              createPost={createReply}
              likePost={() => {}}
              profile={null}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <Toaster />
      {/* Profile Creation Dialog */}
      <ProfileCreationDialog
        setProfile={setProfile}
        setShowConfetti={setShowConfetti}
      />
    </div>
  );
}

export async function getStaticProps(params: { params: { id: string } }) {
  const post = await fetchPost(params.params.id);
  return { props: { post: post ?? [] } };
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}
