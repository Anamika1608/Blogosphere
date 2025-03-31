
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // if (isAuthenticated && window.location.pathname === '/login') {
    // toast({
    //   title: "Already logged in",
    //   description: "You are already logged in. Redirecting to home page.",
    // });
  //   return <Navigate to="/" replace />;
  // } else <Navigate to="/login" replace />;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please log in to access this page",
    });
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
