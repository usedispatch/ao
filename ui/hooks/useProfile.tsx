import { create } from "zustand";
import { Profile } from "@/lib/process"; // Adjust the import path as needed
import { useFetchProfiles } from "./useFetchProfile";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));

export const useProfile = (mutate: boolean = false) => {
  const { data: profiles, isLoading } = useFetchProfiles();
  const { profile, setProfile } = useProfileStore();

  const { data: connectedAddress, isLoading: isLoadingConnectedAddress } =
    useQuery({
      queryKey: ["connectedAddress"],
      queryFn: async () =>
        await (globalThis as any).arweaveWallet.getActiveAddress(),
    });

  React.useEffect(() => {
    if (profiles && connectedAddress && !profile) {
      const connectedProfile = profiles[connectedAddress];

      if (connectedProfile) {
        setProfile({ UserId: connectedAddress, DisplayName: connectedProfile });
      }
    }
  }, [
    profiles,
    connectedAddress,
    profile,
    setProfile,
    isLoading,
    mutate,
    isLoadingConnectedAddress,
  ]);

  return { profile, setProfile, isLoading };
};
