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

export const useProfile = () => {
  const { data: profiles } = useFetchProfiles();
  const { profile, setProfile } = useProfileStore();

  const { data: connectedAddress } = useQuery({
    queryKey: ["connectedAddress"],
    queryFn: async () =>
      await (globalThis as any).arweaveWallet.getActiveAddress(),
  });

  React.useEffect(() => {
    if (profiles && connectedAddress && !profile) {
      const connectedProfile = profiles[connectedAddress];
      console.log("Connected Profile", connectedProfile);
      if (connectedProfile) {
        setProfile({ UserId: connectedAddress, DisplayName: connectedProfile });
      }
    }
  }, [profiles, connectedAddress, profile, setProfile]);

  return { profile, setProfile };
};
