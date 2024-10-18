import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import { X } from "lucide-react";
import { addProfile } from "@/lib/process";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";

const Spinner: React.FC = () => {
  return (
    <div
      className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

type CreateProfileProps = {
  isWalletConnected: boolean;
  handleConnectWallet: () => void;
  setProfile: (value: SetStateAction<any>) => void;
  setShowConfetti: (value: SetStateAction<boolean>) => void;
};

export function CreateProfile({
  isWalletConnected,
  handleConnectWallet,
  setProfile,
  setShowConfetti,
}: CreateProfileProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const { toast } = useToast();

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
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Solarplex
        </CardTitle>
        <CardDescription className="text-center">
          A social media platform for the Permaweb.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => setShowProfileModal(true)}
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
          >
            Create Profile
          </Button>
        </motion.div>
      </CardContent>
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 w-96 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Create Profile
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowProfileModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                placeholder="Enter your username"
                className="mb-4"
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Button
                onClick={createProfileHandler}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
