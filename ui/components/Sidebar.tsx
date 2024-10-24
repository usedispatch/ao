import { connectArConnectWallet, Profile } from "@/lib/process";
import { Avatar } from "@radix-ui/react-avatar";
import Avvvatars from "avvvatars-react";
import { Home, User, Bell, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useDialogStore } from "@/hooks/useProfileDialog";

import { Link } from "@/arnext";
import { useProfile } from "@/hooks/useProfile";

export const Sidebar = ({ className = "" }: { className?: string }) => {
  const { setShowProfileDialog, showProfileDialog } = useDialogStore();
  const { profile } = useProfile();

  return (
    <div
      className={`bg-[#FAFAF8] shadow-md p-4 flex flex-col sticky top-0 h-screen  md:flex w-64 `}
    >
      <div className="flex items-center gap-2 mb-8">
        {profile ? (
          <>
            <Avatar>
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <Avvvatars value={profile.DisplayName} style="shape" />
              </div>
            </Avatar>
            <span className="font-semibold">{profile.DisplayName}</span>
            <Button
              onClick={async () => {
                await (globalThis as any).arweaveWallet.disconnect();
                window.location.reload();
              }}
              variant="ghost"
              className="ml-auto"
              size="icon"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            onClick={async () => {
              await connectArConnectWallet();
              if (!profile) {
                setShowProfileDialog(true);
              }
            }}
            variant="outline"
            className="w-full bg-[#CE775A] text-[#FAFAF8] hover:bg-[#CE775A]/90"
          >
            Create Profile
          </Button>
        )}
      </div>
      <nav className="space-y-2">
        <Link to="/" href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
      </nav>
    </div>
  );
};
