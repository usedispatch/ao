/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreatePost } from "@/components/ui/CreatePost";
import { PostFeed } from "@/components/ui/PostFeed";
import { addProfile, connectArConnectWallet, getProfiles } from "@/lib/process";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    checkWalletConnection();
    checkProfile();
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

  const checkProfile = async () => {
    const profiles = await getProfiles();
    setHasProfile(profiles.length > 0);
  };

  const handleConnectWallet = async () => {
    console.log("Connecting wallet");
    const connected = await connectArConnectWallet();
    setIsConnected(connected);
  };

  const handleAddProfile = async () => {
    console.log("Adding profile");
    await addProfile();
    setHasProfile(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Permaweb</h1>
      {!isConnected && (
        <Button onClick={handleConnectWallet}>Connect Wallet</Button>
      )}
      {isConnected && !hasProfile && (
        <Button onClick={handleAddProfile}>Create Profile</Button>
      )}
      {isConnected && hasProfile && (
        <>
          <CreatePost />
        </>
      )}
      <PostFeed />
    </div>
  );
}
