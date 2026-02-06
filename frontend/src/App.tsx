import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
  const [isLogin, setIsLogin] = useState(false);

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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Routes>

          <Route path="/" element={<AuthPage />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/snippets"
            element={
              <ProtectedRoute>
                <SnippetList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/snippets/create"
            element={
              <ProtectedRoute>
                <CreateSnippet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/snippets/:id"
            element={
              <ProtectedRoute>
                <SnippetDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/snippets/edit/:id"
            element={
              <ProtectedRoute>
                <EditSnippet />
              </ProtectedRoute>
            }
          />

          <Route path="/public/snippet/:id" element={<PublicSnippet />} />

          <Route
            path="/dashboard/snippets/:id/history"
            element={
              <ProtectedRoute>
                <SnippetHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/folders/create"
            element={
              <ProtectedRoute>
                <CreateFolder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/folder/:id"
            element={
              <ProtectedRoute>
                <FolderDetail />
              </ProtectedRoute>
            }
          />



          <Route
            path="/dashboard/trending"
            element={
              <ProtectedRoute>
                <TrendingSnippets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Team Routes */}
          <Route
            path="/dashboard/teams"
            element={
              <ProtectedRoute>
                <TeamList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/teams/create"
            element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/teams/:id"
            element={
              <ProtectedRoute>
                <TeamDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}



