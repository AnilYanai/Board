import { create } from "zustand";

export const userStore = create((set, get) => ({
  user: null, // User object: { id, name, email } or null
  isLoading: true,

  setUser: (user) => set({ user }),
  getUser: () => get().user?.name || get().user?.id || "guest",

  // Check active session on initial load
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      set({ user: data.user || null, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  // Logout action
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      set({ user: null });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  },
}));