"use client";

import { useState, useEffect } from "react";
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

import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { CreateProfile } from "./CreateProfile";
import { addPost, getPosts } from "@/lib/process";
import Avvvatars from "avvvatars-react";

type SocialMediaAppProps = {
  isWalletConnected: boolean;
  handleConnectWallet: () => void;
};

interface Post {
  Id: number;
  Text: string;
  CreatedAt: string;
  Creator: string;
}

export default function SocialMediaApp({
  handleConnectWallet,
  isWalletConnected,
}: SocialMediaAppProps) {
  const [profile, setProfile] = useState<{
    DisplayName: string;
    UserId: string;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      const sortInMostRecent = fetchedPosts.sort(
        (a, b) =>
          new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
      );
      console.log("sortInMostRecent", sortInMostRecent);
      console.log("fetchedPosts", fetchedPosts);
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (newPost.trim()) {
      setIsPosting(true);
      try {
        const hash = await addPost(newPost);
        console.log("Post added with hash:", hash);

        // Fetch updated posts
        const fetchedPosts = await getPosts();
        const sortInMostRecent = fetchedPosts.sort(
          (a, b) =>
            new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );
        setPosts(sortInMostRecent);

        setNewPost("");
      } catch (error) {
        console.error("Error creating post:", error);
      } finally {
        setIsPosting(false);
      }
    }
  };

  const likePost = (id: number) => {};

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <CreateProfile
          handleConnectWallet={handleConnectWallet}
          isWalletConnected={isWalletConnected}
          setProfile={setProfile}
          setShowConfetti={setShowConfetti}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      {showConfetti && <ReactConfetti recycle={false} />}
      <div className="max-w-2xl mx-auto">
        <motion.header
          className="mb-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-gray-800">Solarplex</h1>
          <div className="flex items-center gap-2">
            <Avatar>
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <Avvvatars value={profile.DisplayName} style="shape" />
              </div>

              {/* <AvatarFallback>{profile.UserId}</AvatarFallback> */}
            </Avatar>
            <span className="text-gray-800 font-medium">
              {profile.DisplayName}
            </span>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8 bg-white shadow-sm">
            <CardContent className="pt-6">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-4 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={createPost}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
                  disabled={isPosting}
                >
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
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.Id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between bg-gray-50 p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        {/* <AvatarImage
                          src={post.author.avatar}
                          alt={post.author.name}
                        /> */}
                        {/* <AvatarFallback>Fall Back</AvatarFallback> */}
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                          <Avvvatars value={post.Creator} style="shape" />
                        </div>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {/* {post.author.name}
                           */}
                          {post.Creator.length > 10
                            ? `${post.Creator.substring(
                                0,
                                7
                              )}...${post.Creator.slice(-3)}`
                            : post.Creator}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {/* {post.timestamp}
                           */}
                          {new Date(post.CreatedAt).toLocaleDateString()} at{" "}
                          {new Date(post.CreatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-700">{post.Text}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-gray-50 p-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likePost(post.Id)}
                        className="text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        {/* {post.likes} */}
                        11
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {/* {post.comments} */}
                        11
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
