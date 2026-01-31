import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClients";
import { useSession } from "../store/useSession";
import type { AuthUser } from "../store/auth";
export const useLoginMutation = () => {
  const { setUser } = useSession();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      if (!data.user || !data.user.email) throw new Error("Email tidak ditemukan.");

      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name || "",
        role: data.user.user_metadata.role || "user",
        avatar: data.user.user_metadata.avatar_url || "",
      };
    },
    onSuccess: (user: AuthUser) => {
      setUser(user);
      navigate("/dashboard");
    },
  });
};
