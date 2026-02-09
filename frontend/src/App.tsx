import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./layout/AuthLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import OAuthSuccess from "./pages/OAuthSuccess";
import CreateSnippet from "./pages/CreateSnippet";
import SnippetList from "./pages/SnippetList";
import SnippetDetail from "./pages/SnippetDetail";
import EditSnippet from "./pages/EditSnippet";
import PublicSnippet from "./pages/PublicSnippet";
import SnippetHistory from "./pages/SnippetHistory";
import CreateFolder from "./pages/CreateFolder";
import FolderDetail from "./pages/FolderDetail";
import TrendingSnippets from "./pages/TrendingSnippets";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import CreateTeam from "./pages/CreateTeam";
import TeamList from "./pages/TeamList";
import TeamDetail from "./pages/TeamDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function AuthPage() {
  const { token } = useAuth();
  const [isLogin, setIsLogin] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      {isLogin ? (
        <Login switchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register switchToLogin={() => setIsLogin(true)} />
      )}
    </AuthLayout>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/oauth-success",
    element: <OAuthSuccess />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/public/snippet/:id",
    element: <PublicSnippet />,
  },
  {
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/snippets",
        element: <SnippetList />,
      },
      {
        path: "/dashboard/snippets/create",
        element: <CreateSnippet />,
      },
      {
        path: "/dashboard/snippets/:id",
        element: <SnippetDetail />,
      },
      {
        path: "/dashboard/snippets/edit/:id",
        element: <EditSnippet />,
      },
      {
        path: "/dashboard/snippets/:id/history",
        element: <SnippetHistory />,
      },
      {
        path: "/dashboard/folders/create",
        element: <CreateFolder />,
      },
      {
        path: "/dashboard/folder/:id",
        element: <FolderDetail />,
      },
      {
        path: "/dashboard/trending",
        element: <TrendingSnippets />,
      },
      {
        path: "/dashboard/analytics",
        element: <AnalyticsDashboard />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
      {
        path: "/dashboard/settings",
        element: <Settings />,
      },
      {
        path: "/dashboard/teams",
        element: <TeamList />,
      },
      {
        path: "/dashboard/teams/create",
        element: <CreateTeam />,
      },
      {
        path: "/dashboard/teams/:id",
        element: <TeamDetail />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}



