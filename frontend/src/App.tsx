import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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



        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}



