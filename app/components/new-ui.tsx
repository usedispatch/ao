"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Heart,
  Home,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Send,
  Settings,
  Share2,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Key, useEffect, useState } from "react";
import { Post, Profile, addPost, getPosts, likePost, unlikePost } from "@/lib/process";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createThreadedPosts, truncateAddress } from "@/lib/utils";

import Avvvatars from "avvvatars-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { PostCard } from "./PostCard";
import PostComments from "./PostReply";
import { ProfileCreationDialog } from "./ProfileDialog";
import ReactConfetti from "react-confetti";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./Sidebar";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { useDialogStore } from "@/hooks/useProfileDialog";
import { useProfile } from "./ProfileProvider";
import { useToast } from "@/hooks/use-toast";

const EditorComp = dynamic(() => import("./EditorComponent"), { ssr: false });


type SocialMediaAppProps = {
  isWalletConnected: boolean;
  handleConnectWallet: () => void;
};

export default function SocialMediaApp({
  isWalletConnected,
  handleConnectWallet,
}: SocialMediaAppProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();
  const { setShowProfileDialog, showProfileDialog } = useDialogStore();


  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      const threaded = createThreadedPosts(fetchedPosts);
      setPosts(threaded);
    };
    fetchPosts();
  }, []);



  const createPost = async (text: string, parentId?: string) => {
    if (text.trim()) {
      setIsPosting(true);
      try {
        const newPost = await addPost(text, parentId) as Post;

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
  const updatePostsWithReply = (posts: Post[], parentId: string, newReply: Post): Post[] => {
    return posts.map(post => {
      if (post.Id === parentId) {
        return { ...post, Replies: [newReply, ...(post.Replies || [])] };
      } else if (post.Replies && post.Replies.length > 0) {
        return { ...post, Replies: updatePostsWithReply(post.Replies, parentId, newReply) };
      }
      return post;
    });
  };

  const promptProfileCreation = async () => {
    setShowProfileDialog(true);
  };

  const handleLike = async (postId: string) => {
    if (!profile) {
      promptProfileCreation();
      return;
    }
    try {
      await likePost(postId);
      setPosts(
        posts.map((post) =>
          post.Id === postId
            ? { ...post, Likes: post.Likes ? post.Likes + 1 : 1 }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async (postId: string) => {
    if (!profile) {
      promptProfileCreation();
      return;
    }
    try {
      await unlikePost(postId);
      setPosts(
        posts.map((post) =>
          post.Id === postId
            ? { ...post, Likes: post.Likes ? post.Likes - 1 : 0 }
            : post
        )
      );
    } catch (error) {
      console.error("Error unliking post:", error);
    }
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
                  onClick={() => !profile ? promptProfileCreation() : createPost(newPost)}
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
              {posts.map((post) => (
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
                    handleLike={handleLike}
                    handleUnlike={handleUnlike}
                    profile={profile}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Profile Creation Dialog */}
      <ProfileCreationDialog
        handleConnectWallet={handleConnectWallet}
        isWalletConnected={isWalletConnected}
        setProfile={setProfile}
        setShowConfetti={setShowConfetti}
      />
    </div>
  );
}