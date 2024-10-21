"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components-1/ui/button";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components-1/ui/card";
import { Textarea } from "@/components-1/ui/textarea";

import { Sheet, SheetContent, SheetTrigger } from "@/components-1/ui/sheet";
import { Send, Menu } from "lucide-react";
import { ProfileCreationDialog } from "./ProfileDialog";
import { useDialogStore } from "@/hooks/useProfileDialog";
import { addPost, connectArConnectWallet, Post, Profile } from "@/lib/process";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "./Sidebar";
import { PostCard } from "./PostCard";
import { Skeleton } from "./ui/skeleton";
import { fetchPosts, useFetchPosts } from "@/hooks/useFetchPosts";
import { useProfile } from "./ProfileProvider";

const EditorComp = dynamic(() => import("./EditorComponent"), { ssr: false });

const PostSkeleton = () => (
  <Card className="overflow-hidden bg-[#FAFAF8] shadow-sm hover:shadow-md transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between bg-[#F1F0EA] p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="w-8 h-8 rounded-full" />
    </CardHeader>
    <CardContent className="p-4">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
    <CardFooter className="flex justify-between bg-[#F1F0EA] p-2">
      <Skeleton className="w-16 h-8 rounded" />
      <Skeleton className="w-16 h-8 rounded" />
      <Skeleton className="w-16 h-8 rounded" />
    </CardFooter>
  </Card>
);

export default function SocialMediaApp({
  _posts = undefined,
}: {
  _posts?: Post[] | undefined;
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [posts, setPosts] = useState<Post[]>(_posts ?? []);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();
  const { setShowProfileDialog, showProfileDialog } = useDialogStore();
  const { data, isLoading } = useFetchPosts();
  const [isConnected, setIsConnected] = useState(false);
  const { profile, setProfile } = useProfile();

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const address = await (
        globalThis as any
      ).arweaveWallet.getActiveAddress();
      setIsConnected(!!address);
    } catch (error) {
      console.error(error);
      setIsConnected(false);
    }
  };

  const handleConnectWallet = async () => {
    const connected = await connectArConnectWallet();
    setIsConnected(connected);
  };

  const createPost = async (text: string, parentId?: string) => {
    if (text.trim()) {
      setIsPosting(true);
      try {
        const newPost = (await addPost(text, parentId)) as Post;

        // Create a new post object
        // const newPost: Post = {
        //   Id: "test",
        //   Text: text,
        //   Creator: profile?.DisplayName || "Anonymous", // Use the profile name if available
        //   CreatedAt: new Date().toISOString(),
        //   ParentId: parentId || undefined,
        //   Cid: "",
        //   ReplyCid: "",
        //   ReplyUri: "",
        //   Likes: 0
        // };

        // Update the posts state
        setPosts((prevPosts) => {
          if (parentId) {
            // If it's a reply, find the parent post and add the reply
            return updatePostsWithReply(prevPosts, parentId, newPost);
          } else {
            // If it's a new top-level post, add it to the beginning of the list
            return [newPost, ...prevPosts];
          }
        });

        setNewPost(""); // Clear the input field
      } catch (error) {
        console.error("Error creating post:", error);
        toast({
          title: "Error",
          description: "Failed to create post. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsPosting(false);
      }
    }
  };

  // Helper function to update posts with a new reply
  const updatePostsWithReply = (
    posts: Post[],
    parentId: string,
    newReply: Post
  ): Post[] => {
    return posts.map((post) => {
      if (post.Id === parentId) {
        return { ...post, Replies: [newReply, ...(post.Replies || [])] };
      } else if (post.Replies && post.Replies.length > 0) {
        return {
          ...post,
          Replies: updatePostsWithReply(post.Replies, parentId, newReply),
        };
      }
      return post;
    });
  };

  const promptProfileCreation = async () => {
    setShowProfileDialog(true);
  };

  const likePost = (id: string) => {
    console.log("likePost", id);
  };

  return (
    <div className="min-h-screen bg-[#F1F0EA] font-sans flex flex-col md:flex-row">
      {/* {showConfetti && <ReactConfetti recycle={false} />} */}

      {/* Mobile Header */}
      <header className="md:hidden bg-[#FAFAF8] shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#141414]">Solarplex</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#141414]">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className=" bg-[#FAFAF8]">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </header>

      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 bg-[#FAFAF8] shadow-sm">
            <CardContent className="pt-6">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-4 border-[#CE775A] focus:border-[#CE775A] focus:ring focus:ring-[#CE775A]/20 transition-all duration-200 bg-[#FAFAF8] text-[#141414]"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() =>
                    !profile ? promptProfileCreation() : createPost(newPost)
                  }
                  className="bg-[#CE775A] text-[#FAFAF8] hover:bg-[#CE775A]/90 transition-all duration-200 flex items-center gap-2"
                  disabled={isPosting}
                >
                  {/* TODO(Pratik): Need to add the loading state for the button */}
                  <span>Post</span>
                  <motion.div
                    animate={{
                      x: isPosting ? [0, 5, 0] : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: isPosting ? Infinity : 0,
                      repeatType: "loop",
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
          {/* TODO(Pratik): Need to add the loading state for the posts */}
          <div className="space-y-4">
            <AnimatePresence>
              {isLoading ? (
                <div>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </div>
              ) : (
                posts.map((post) => (
                  <motion.div
                    key={post.Id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <PostCard
                      post={post}
                      createPost={createPost}
                      likePost={likePost}
                      profile={profile}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

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

