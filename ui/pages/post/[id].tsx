"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Post,
  getPosts,
  addPost,
  connectArConnectWallet,
} from "@/lib/process";
import { PostCard } from "@/components/PostCard";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ProfileCreationDialog } from "@/components/ProfileDialog";
import { createThreadedPosts } from "@/lib/utils";
import { useProfile } from "@/components/ProfileProvider";

interface SinglePostPageParams {
  id: string
}

const fetchPost = async (id: string, setPost?: any) => {
  try {
    const posts = await getPosts();
    const threadedPosts = createThreadedPosts(posts);
    const foundPost = threadedPosts.find((p) => p.Id === id);
    // if (foundPost) {
    //   foundPost.Replies = posts.filter((p) => p.ParentId === foundPost.Id);
    // }
    if (setPost) {
    setPost(foundPost || null);
    }
  } catch (error) {
    console.error("Error fetching post:", error);
  }
};

export default function SinglePostPage(params: SinglePostPageParams) {
  const id = params.id;
  const [post, setPost] = useState<Post | null>(null);
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
    if (id) {
      fetchPost(id, setPost);
    }
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className=" mx-auto ">
      <div className="min-h-screen bg-[#F1F0EA] font-sans flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 overflow-y-auto">
          <PostCard
            post={post}
            createPost={createReply}
            likePost={() => {}}
            profile={null}
          />
        </div>
      </div>
      <Toaster />
      {/* Profile Creation Dialog */}
      <ProfileCreationDialog
        handleConnectWallet={handleConnectWallet}
        isWalletConnected={isConnected}
        setProfile={setProfile}
        setShowConfetti={setShowConfetti}
      />
    </div>
  );
}

export async function getStaticProps(params: SinglePostPageParams) {
  const posts = fetchPost(params.id)
  return { props: { posts: posts ?? [] } };
}

export async function getStaticPaths() {
    const posts = await getPosts()
    const paths = posts.map((post) => ({
        params: { id: post.Id.toString() },
    }))

    return { paths, fallback: 'blocking' }
}

