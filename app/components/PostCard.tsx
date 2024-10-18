import { Post } from "@/lib/process";
import { sharePost, truncateAddress } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import Avvvatars from "avvvatars-react";
import { motion } from "framer-motion";
import { MoreHorizontal, Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Textarea } from "./ui/textarea";
import Link from "next/link";
import { Button } from "./ui/button";

import { useDialogStore } from "@/hooks/useProfileDialog";
import { useFetchProfiles } from "@/hooks/useFetchProfile";
import { useProfile } from "@/hooks/useProfile";
interface PostCardProps {
  post: Post;
  depth?: number;
  createPost: (content: string, parentId: string) => Promise<void>;
  likePost: (postId: string) => void;
  profile: any;
}

export const PostCard = ({
  post,
  depth = 0,
  createPost,
  likePost,
}: PostCardProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const profile = useProfile();
  const { data: profiles } = useFetchProfiles();
  const { setShowProfileDialog } = useDialogStore();
  const handleReply = async () => {
    if (replyContent.trim()) {
      await createPost(replyContent, post.Id);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const promptProfileCreation = async () => {
    setShowProfileDialog(true);
  };

  return (
    <Card
      className={`overflow-hidden bg-[#FAFAF8] shadow-sm hover:shadow-md transition-shadow duration-200 ${
        depth > 0 ? "ml-6 border-l-2 border-[#CE775A]/20" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between bg-[#F1F0EA] p-4">
        <Link href={`/post/${post.Id}`} className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <Avvvatars value={post.Creator} style="shape" />
              </div>
            </Avatar>
            <div>
              <h3 className="font-semibold text-[#141414]">
                {profiles?.[post.Creator] ?? truncateAddress(post.Creator)}
              </h3>
              <p className="text-sm text-[#141414]/70">
                {new Date(post.CreatedAt).toLocaleDateString()} at{" "}
                {new Date(post.CreatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="text-[#141414]">
          <MoreHorizontal className="h-4 w-4" />
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
              <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} className="text-xl font-semibold mt-5 mb-3" />
            ),
            p: ({ node, ...props }) => <p {...props} className="mb-4" />,
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc pl-5 mb-4" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal pl-5 mb-4" />
            ),
            li: ({ node, ...props }) => <li {...props} className="mb-2" />,
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
            {post.Likes}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              profile ? setIsReplying(!isReplying) : promptProfileCreation()
            }
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
            onClick={() => sharePost(post.Id)}
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
            className="mb-2 bg-[#FAFAF8] border-[#CE775A] focus:border-[#CE775A] focus:ring focus:ring-[#CE775A]/20"
          />
          <Button
            onClick={handleReply}
            className="bg-[#CE775A] text-[#FAFAF8] hover:bg-[#CE775A]/90"
          >
            Reply
          </Button>
        </div>
      )}
      {post.Replies && post.Replies.length > 0 && (
        <div className="pl-4 border-l-2 border-[#CE775A]/20">
          {post.Replies.map((reply: Post) => (
            <PostCard
              key={reply.Id}
              post={reply}
              depth={depth + 1}
              createPost={createPost}
              likePost={likePost}
              profile={profile}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
