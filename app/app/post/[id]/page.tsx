"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Post,
  getPosts,
  addPost,
  connectArConnectWallet,
  Profile,
} from "@/lib/process";
import { PostCard } from "@/components/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ProfileCreationDialog } from "@/components/ProfileDialog";
import { createThreadedPosts } from "@/lib/utils";
import { useProfile } from "@/components/ProfileProvider";

export default function SinglePostPage() {
  const { id } = useParams();
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
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const posts = await getPosts();
        const threadedPosts = createThreadedPosts(posts);
        const foundPost = posts.find((p) => p.Id === id);
        if (foundPost) {
          foundPost.Replies = posts.filter((p) => p.ParentId === foundPost.Id);
        }
        setPost(foundPost || null);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
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
          {/* <Card className="mt-4">
        <CardContent className="p-4">
          <Textarea
            placeholder="Write a reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="mb-2"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={createReply}
              disabled={isReplying}
              className="bg-[#CE775A] text-[#FAFAF8] hover:bg-[#CE775A]/90"
            >
              {isReplying ? (
                "Posting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post Reply
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card> */}
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
