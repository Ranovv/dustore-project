import { useAuthStore } from "@/lib/store/auth";

export const useSession = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    role: user?.role,
    isLoggedIn: !!user,
    setUser,
    logout,
  };
};