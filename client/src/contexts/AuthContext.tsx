import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_LOGIN_URL, {
        email,
        password,
      });

      const { _id, name: userName, email: userEmail, token } = response.data;

      const user = { id: _id, name: userName, email: userEmail };

      setUser(user);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);


      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,

      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {

      const response = await axios.post(import.meta.env.VITE_REGISTER_URL, {
        name,
        email,
        password,
      });

      const { _id, name: userName, email: userEmail, token } = response.data;

      const user = { id: _id, name: userName, email: userEmail };

      setUser(user);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast({
        title: "Sign up successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "An error occurred during signup.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/'; 
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
