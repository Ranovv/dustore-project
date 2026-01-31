import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginForm } from "./components/login-form";
import { SignupForm } from "./components/signup-form";
import Dashboard from "./pages/dashboard";
import Kasir from "./pages/kasir";
import { Toaster } from "sonner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { useRestoreSession } from "./lib/store/useRestoreSession";
import { useSession } from "./lib/store/useSession";
import MenuAndOrders from "./pages/menu-and-orders";
import HistoryPage from "./pages/history";
import AccountPage from "./pages/account";

function App() {
  useRestoreSession();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <RootRedirect />
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registration" element={<SignupForm />} />
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashier"
            element={
              <ProtectedRoute>
                <Kasir />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu-and-orders"
            element={
              <ProtectedRoute>
                <MenuAndOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

function RootRedirect() {
  const { isLoggedIn } = useSession();
  return isLoggedIn ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
