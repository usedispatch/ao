/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreatePost } from "@/components/ui/CreatePost";

import { addProfile, connectArConnectWallet, getProfiles } from "@/lib/process";

import { CreateProfile } from "@/components/CreateProfile";
import { Toaster } from "@/components/ui/toaster";
import SocialMediaApp from "@/components/new-ui";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isProfileCreated, setIsProfileCreated] = useState(false);

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
    const connected = await connectArConnectWallet();
    setIsConnected(connected);
  };

  return (
    <div className=" mx-auto ">
      <SocialMediaApp
        isWalletConnected={isConnected}
        handleConnectWallet={handleConnectWallet}
      />
      <Toaster />
    </div>
  );
}
