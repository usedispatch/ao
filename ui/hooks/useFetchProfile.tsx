import { getProfiles } from "@/lib/process";
import { useQuery } from "@tanstack/react-query";

const loadProfiles = async () => {
  try {
    const profiles = await getProfiles();

    const profilesMap: { [walletAddress: string]: string } = profiles.reduce(
      (acc, profile) => {
        acc[profile.UserId] = profile.DisplayName;
        return acc;
      },
      {} as { [walletAddress: string]: string }
    );
    return profilesMap;
  } catch (error) {
    console.error("Error loading profile:", error);
  }
};

export const useFetchProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: loadProfiles,
  });
};
