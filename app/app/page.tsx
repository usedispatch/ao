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
    console.log("Connecting wallet");
    const connected = await connectArConnectWallet();
    setIsConnected(connected);
  };


  return (
    <div className=" mx-auto ">
      {/* <h1 className="text-3xl font-bold mb-6">Welcome to the Permaweb</h1>
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
      <PostFeed /> */}
      {/* <SocialMediaApp />
       */}
      <SocialMediaApp
        isWalletConnected={isConnected}
        handleConnectWallet={handleConnectWallet}
      />

      {/* {isProfileCreated ? (
        <SocialMediaApp />
      ) : (
        <div className="flex justify-center items-center ">
          <CreateProfile
            isWalletConnected={isConnected}
            handleConnectWallet={handleConnectWallet}
            setIsProfileCreated={setIsProfileCreated}
          />
        </div>
      )} */}
      <Toaster />
    </div>
  );
}
