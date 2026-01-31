import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
};

type AuthStore = {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        const cleanUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        };
        set({ user: cleanUser });
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "authAdminUser",
    }
  )
);