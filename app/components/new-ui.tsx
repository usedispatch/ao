"use client";

import { useState, useEffect, Key } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  Send,
  Home,
  User,
  Bell,
  Settings,
  Menu,
} from "lucide-react";
import { ProfileCreationDialog } from "./ProfileDialog";
import { useDialogStore } from "@/hooks/useProfileDialog";
import { addPost, getPosts, Post, Profile } from "@/lib/process";
import Avvvatars from "avvvatars-react";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import PostComments from "./PostReply";
import { truncateAddress } from "@/lib/utils";

const EditorComp = dynamic(() => import("./EditorComponent"), { ssr: false });

const initialPosts = [
  {
    id: 1,
    author: {
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just finished a great book! Any recommendations for my next read?\n\n![Book](https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80)",
    likes: 15,
    comments: [
      {
        id: 101,
        author: {
          name: "Bob Smith",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: 'I highly recommend "The Midnight Library" by Matt Haig!',
      },
      {
        id: 102,
        author: {
          name: "Charlie Brown",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: 'You might enjoy "Project Hail Mary" by Andy Weir.',
      },
    ],
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "David Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just launched my new website! Check it out and let me know what you think.\n\n[My New Website](https://example.com)\n\n## Features\n- Responsive design\n- Dark mode\n- Fast loading times",
    likes: 32,
    comments: [],
    timestamp: "5 hours ago",
  },
];

type SocialMediaAppProps = {
  isWalletConnected: boolean;
  handleConnectWallet: () => void;
};

// New PostCard component
interface PostCardProps {
  post: any;
  depth?: number;
  createPost: (text: string, parentId?: string) => Promise<void>;
  likePost: (id: string) => void;
  promptProfileCreation: () => void;
  profile: any;
}

const PostCard = ({ post, depth = 0, createPost, likePost, promptProfileCreation, profile }: PostCardProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    if (replyContent.trim()) {
      await createPost(replyContent, post.Id);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  return (
    <Card className={`overflow-hidden bg-[#FAFAF8] shadow-sm hover:shadow-md transition-shadow duration-200 ${depth > 0 ? 'ml-6' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between bg-[#F1F0EA] p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
              <Avvvatars value={post.Creator} style="shape" />
            </div>
          </Avatar>
          <div>
            <h3 className="font-semibold text-[#141414]">
              {truncateAddress(post.Creator)}
            </h3>
            <p className="text-sm text-[#141414]/70">
              {new Date(post.CreatedAt).toLocaleDateString()} at{" "}
              {new Date(post.CreatedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#141414]"
        >
          <MoreHorizontal className="h-4 w-4 " />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <ReactMarkdown
          className="prose max-w-none text-[#141414]"
          components={{
            img: ({ node, ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                {...props}
                className="max-w-full h-auto rounded-lg my-4"
                alt="post image"
              />
            ),
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-[#CE775A] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
            h1: ({ node, ...props }) => (
              <h1
                {...props}
                className="text-2xl font-bold mt-6 mb-4"
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                className="text-xl font-semibold mt-5 mb-3"
              />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="mb-4" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc pl-5 mb-4" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal pl-5 mb-4" />
            ),
            li: ({ node, ...props }) => (
              <li {...props} className="mb-2" />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                className="border-l-4 border-[#CE775A] pl-4 italic my-4"
              />
            ),
            code: ({ node, ...props }) => (
              <code
                {...props}
                className="block bg-[#F1F0EA] rounded p-2 my-2 whitespace-pre-wrap"
              />
            ),
          }}
        >
          {post.Text}
        </ReactMarkdown>
      </CardContent>
      <CardFooter className="flex justify-between bg-[#F1F0EA] p-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => likePost(post.Id)}
            className="text-[#141414] hover:bg-[#FAFAF8] transition-colors duration-200"
          >
            <Heart className="w-4 h-4 mr-2" />
            {0}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => profile ? setIsReplying(!isReplying) : promptProfileCreation()}
            className="text-[#141414] hover:bg-[#FAFAF8] transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {post.Replies?.length || 0}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#141414] hover:bg-[#FAFAF8] transition-colors duration-200"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </motion.div>
      </CardFooter>
      {isReplying && (
        <div className="p-4 bg-[#F1F0EA]">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleReply}>Reply</Button>
        </div>
      )}
      {post.Replies && post.Replies.map((reply: { Id: Key | null | undefined; }) => (
        <PostCard
          key={reply.Id}
          post={reply}
          depth={depth + 1}
          createPost={createPost}
          likePost={likePost}
          promptProfileCreation={promptProfileCreation}
          profile={profile}
        />
      ))}
    </Card>
  );
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
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { setShowProfileDialog, showProfileDialog } = useDialogStore();
  const { toast } = useToast();

  console.log("isWalletConnected", isWalletConnected);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      const threaded = createThreadedPosts(fetchedPosts);
      setPosts(threaded);
    };
    fetchPosts();
  }, []);

  const createThreadedPosts = (flatPosts: any[]) => {
    const postMap = new Map();
    const rootPosts: any[] = [];

    flatPosts.forEach((post: { Replies: never[]; Id: any; }) => {
      post.Replies = [];
      postMap.set(post.Id, post);
    });

    flatPosts.forEach((post: { ParentId: any; }) => {
      if (post.ParentId) {
        const parent = postMap.get(post.ParentId);
        if (parent) {
          parent.Replies.push(post);
        }
      } else {
        rootPosts.push(post);
      }
    });

    return rootPosts.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
  };

  const createPost = async (text: string, parentId?: string) => {
    if (text.trim()) {
      setIsPosting(true);
      try {
        const hash = await addPost(text, parentId);
        console.log("Post added with hash:", hash);

        // Create a new post object
        const newPost: Post = {
          Id: hash, // Using the hash as a temporary ID
          Text: text,
          Creator: profile?.DisplayName || "Anonymous", // Use the profile name if available
          CreatedAt: new Date().toISOString(),
          ParentId: parentId || undefined,
          Cid: "",
          ReplyCid: "",
          ReplyUri: "",
          Likes: 0
        };

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
        // @ts-expect-error Replies is not defined in the Post type
        return { ...post, Replies: [newReply, ...(post.Replies || [])] };
                // @ts-expect-error Replies is not defined in the Post type

      } else if (post.Replies && post.Replies.length > 0) {
        // @ts-expect-error Replies is not defined in the Post type

        return { ...post, Replies: updatePostsWithReply(post.Replies, parentId, newReply) };
      }
      return post;
    });
  };

  const promptProfileCreation = () => {
    setShowProfileDialog(true);
  };

  const likePost = (id: string) => {
    console.log("likePost", id);
  };

  const Sidebar = ({ className = "" }) => (
    <div
      className={`bg-[#FAFAF8] shadow-md p-4 flex flex-col sticky top-0 h-screen ${className}`}
    >
      <div className="flex items-center gap-2 mb-8">
        {profile ? (
          <>
            <Avatar>
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <Avvvatars value={profile.DisplayName} style="shape" />
              </div>
            </Avatar>
            <span className="font-semibold">{profile.DisplayName}</span>
          </>
        ) : (
          <Button
            onClick={promptProfileCreation}
            variant="outline"
            className="w-full bg-[#CE775A] text-[#FAFAF8] hover:bg-[#CE775A]/90"
          >
            Create Profile
          </Button>
        )}
      </div>
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
    </div>
  );

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
      <Sidebar className="hidden md:flex w-64 shadow-md" />

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
                  onClick={() => createPost(newPost)}
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
                    likePost={likePost}
                    promptProfileCreation={promptProfileCreation}
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
