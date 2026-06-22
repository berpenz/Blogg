import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Public layout + pages
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import ArticleView from './pages/ArticleView';
import Gedankenarchiv from './pages/Gedankenarchiv';
import UeberMich from './pages/UeberMich';
import Suche from './pages/Suche';
import Galerie from './pages/Galerie';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ArticleList from './pages/admin/ArticleList';
import ArticleEditor from './pages/admin/ArticleEditor';
import ThoughtManager from './pages/admin/ThoughtManager';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <span className="font-display text-2xl tracking-[0.25em] text-foreground">BERPEN</span>
          <div className="mt-6 w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public routes with layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/artikel/:id" element={<ArticleView />} />
        <Route path="/gedankenarchiv" element={<Gedankenarchiv />} />
        <Route path="/ueber-mich" element={<UeberMich />} />
        <Route path="/suche" element={<Suche />} />
        <Route path="/galerie" element={<Galerie />} />
      </Route>

      {/* Admin routes (protected) */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/artikel" element={<ArticleList />} />
          <Route path="/admin/artikel/:id" element={<ArticleEditor />} />
          <Route path="/admin/gedanken" element={<ThoughtManager />} />
          <Route path="/admin/gedanken/:id" element={<ThoughtManager />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeProvider>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App