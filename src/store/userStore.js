import { create } from "zustand";

export const userStore = create((set, get) => ({
  user: "guest",
  setUser: (user) => set({ user }), // Setter for user
  getUser: () => get().user, // Getter for user
}));