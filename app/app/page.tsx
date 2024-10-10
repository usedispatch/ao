"use client";
import { Button } from "@/components/ui/button";
import {
  addPost,
  addProfile,
  connectArConnectWallet,
  getPosts,
  getProfiles,
} from "@/lib/process";

export default function Home() {
  const handleAddProfile = async () => {
    console.log("Adding profile");
    await addProfile();
  };

  const handleConnectWallet = async () => {
    console.log("Connecting wallet");
    await connectArConnectWallet();
  };

  const handleAddPost = async () => {
    console.log("Adding post");
    await addPost();
  };

  const handleGetPosts = async () => {
    console.log("Getting posts");
    const result = await getPosts();
    console.log("Get Posts", result);
  };

  const handleGetProfiles = async () => {
    console.log("Getting profiles");
    const result = await getProfiles();
    console.log("Get Profiles", result);
  };

  return (
    <div>
      <h1>Welcome to the Permaweb</h1>
      <Button onClick={handleConnectWallet}>Connect Wallet</Button>
      <Button onClick={handleAddProfile}>Add Profile</Button>
      <Button onClick={handleAddPost}>Add Post</Button>
      <Button onClick={handleGetPosts}>Get Posts</Button>
      <Button onClick={handleGetProfiles}>Get Profiles</Button>
    </div>
  );
}
