import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/hooks/useProfileDialog";
import { SetStateAction, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addProfile } from "@/lib/process";
import { ToastAction } from "./ui/toast";
import Spinner from "./Spinner";

type ProfileCreationDialogProps = {
  isWalletConnected: boolean;
  handleConnectWallet: () => void;
  setProfile: (value: SetStateAction<any>) => void;
  setShowConfetti: (value: SetStateAction<boolean>) => void;
};

export function ProfileCreationDialog({
  isWalletConnected,
  handleConnectWallet,
  setProfile,
  setShowConfetti,
}: ProfileCreationDialogProps) {
  const { showProfileDialog, setShowProfileDialog } = useDialogStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const createProfileHandler = async () => {
    try {
      if (!isWalletConnected) {
        handleConnectWallet();
        return;
      }
      setIsLoading(true);
      const address = await (
        globalThis as any
      ).arweaveWallet.getActiveAddress();
      console.log("address", address);
      const hash = await addProfile(address, displayName);
      setIsLoading(false);

      const aoLink = `https://www.ao.link/#/message/${hash}`;
      toast({
        title: "",
        description: "Your Profile has been created!",
        action: (
          <ToastAction
            onClick={() => window.open(aoLink, "_blank")}
            altText="Check in AO"
          >
            View in AO
          </ToastAction>
        ),
      });
      setProfile({
        DisplayName: displayName,
        UserId: address,
      });
      setShowProfileDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
      <DialogContent className="sm:max-w-[425px] bg-[#FAFAF8]">
        <DialogHeader>
          <DialogTitle className="text-[#141414]">
            Create Your Profile
          </DialogTitle>
          <DialogDescription className="text-[#141414]/70">
            Join our community and start sharing your thoughts!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="username"
              placeholder="Enter your username"
              className="col-span-4 bg-[#FAFAF8] text-[#141414] border-[#CE775A] focus:border-[#CE775A] focus:ring focus:ring-[#CE775A]/20"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={createProfileHandler}
            className="bg-[#CE775A] text-[#FAFAF8] hover:bg-[#CE775A]/90"
          >
            {isWalletConnected ? (
              isLoading ? (
                <Spinner />
              ) : (
                "Create Profile"
              )
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
