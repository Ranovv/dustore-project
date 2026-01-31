import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store/auth";
import type { JSX } from "react";

export function ProtectedRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role?: string;
}) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/unauthorized" />;


  return children;
}
