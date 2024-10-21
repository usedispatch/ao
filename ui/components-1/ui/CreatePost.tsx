import { useState } from "react";
import { Button } from "@/components-1/ui/button";
import { addPost } from "@/lib/process";

export function CreatePost() {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      await addPost(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
        placeholder="What's on your mind?"
      />
      <Button type="submit">Create Post</Button>
    </form>
  );
}