import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabaseClients";



export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: fullName,
            role: "user",
          },
        },
      });

      if (error) throw new Error(error.message);
      return data;
    },
  });
};