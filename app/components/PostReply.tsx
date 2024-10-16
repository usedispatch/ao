import React, { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { Avatar } from "./ui/avatar";
import Avvvatars from "avvvatars-react";
import { truncateAddress } from "@/lib/utils";

interface PostCommentsProps {
  postId: string;
  addReply: (text: string, parentId: string) => void;
}

const PostComments: React.FC<PostCommentsProps> = ({ postId, addReply }) => {
  const [newPost, setNewPost] = useState("");
  const { data: posts, error } = useFetchPosts();
  //   console.log("error", error);
  const replies = posts?.filter((post) => post.ParentId === postId);

  console.log("replies", replies);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Separator />
      <CardContent className="p-4">
        {/* TODO(Pratik): Need to add the loading state for the posts */}
        {replies && (
          <ScrollArea className="h-40 mb-4">
            {replies?.map((reply) => (
              <div key={reply.Id} className="flex items-start space-x-4 mb-4">
                <Avatar>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    <Avvvatars value={reply.Creator} style="shape" />
                  </div>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {truncateAddress(reply.Creator)}
                  </p>
                  {/* {TODO(Pratik):  Need to extract the markdown component into a file and use it here} */}
                  <p className="text-sm text-gray-600">{reply.Text}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Write a reply..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="flex-grow bg-[#FAFAF8] text-[#141414] border-[#CE775A] focus:border-[#CE775A] focus:ring focus:ring-[#CE775A]/20"
          />
          <Button
            onClick={() => addReply(newPost, postId)}
            className="bg-[#CE775A] text-[#FAFAF8] hover:bg-[#CE775A]/90"
          >
            Reply
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );
};

export default PostComments;
