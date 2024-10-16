import React, { createContext, useState, useContext, useEffect } from 'react';
import { Profile, getProfiles } from '@/lib/process';

interface ProfileContextType {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  loadProfile: () => Promise<void>;
  profiles: {
    // walletAddress: string;
    [walletAddress: string]: string;
  }
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<{ [walletAddress: string]: string }>({});

  const loadProfile = async () => {
    try {
      const profiles = await getProfiles();
      const profilesMap: { [walletAddress: string]: string } = profiles.reduce((acc, profile) => {
        acc[profile.UserId] = profile.DisplayName;
        return acc;
      }, {} as { [walletAddress: string]: string });
      setProfiles(profilesMap);
      const connectedAddress = await (
        globalThis as any
      ).arweaveWallet.getActiveAddress();
      const connectedProfile = profilesMap[connectedAddress];
      if (connectedProfile) {
        setProfile({UserId: connectedAddress, DisplayName: connectedProfile});
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loadProfile, profiles }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

