import { useEffect } from "react";
import { useSession } from "./useSession";
import { supabase } from "../supabaseClients";

export const useRestoreSession = () => {
  const { setUser } = useSession();

  useEffect(() => {
    const restore = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const parsed = JSON.parse(storedUser);
      const { data, error } = await supabase
        .from("auth_users")
        .select("*")
        .eq("id", parsed.id)
        .maybeSingle();

      if (error || !data) return;

      const safeUser = { ...data };
      delete safeUser.password;

      setUser(safeUser);
    };

    restore();
  }, [setUser]);
};