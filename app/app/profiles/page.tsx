import { dryrun } from "@permaweb/aoconnect";
import { Suspense } from "react";

export const metadata = {
  title: "User Profiles",
  description: "View and manage user profiles",
};
const SPLX_LUA_AO = "Jp72YrAFtQNxYTmKDiUge5NkVtW-SS44cEpXdgMs8tg";

interface Post {
  Id: number;
  Text: string;
  Cid: string;
  ReplyCid: string;
  ReplyUri: string;
  CreatedAt: string;
  Creator: string;
}

interface Profile {
  UserId: string;
  DisplayName: string;
}
async function getProfiles(): Promise<Profile[]> {
  const dryrunResult = await dryrun({
    process: SPLX_LUA_AO,
    tags: [
      {
        name: "Action",
        value: "GetProfiles",
      },
    ],
  });
  console.log(JSON.parse(dryrunResult.Messages[0].Data));
  return JSON.parse(dryrunResult.Messages[0].Data);
}

export default async function ProfilesPage() {
  const profiles = await getProfiles();
  console.log(profiles);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profiles</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {profiles.map((profile, index) => (
          <div key={index} className="profile">
            <p>UserId: {profile.UserId}</p>
            <p>DisplayName: {profile.DisplayName}</p>
          </div>
        ))}
      </Suspense>
    </div>
  );
}
