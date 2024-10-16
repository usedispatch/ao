import { create } from "zustand";

interface DialogState {
  showProfileDialog: boolean;
  setShowProfileDialog: (show: boolean) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  showProfileDialog: false,
  setShowProfileDialog: (show) => set({ showProfileDialog: show }),
}));
