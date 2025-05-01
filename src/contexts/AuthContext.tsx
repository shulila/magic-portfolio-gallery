
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthState } from '../types';
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  authState: AuthState;
  login: (email: string) => Promise<void>;
  logout: () => void;
  sendMagicLink: (email: string) => Promise<boolean>;
  verifyMagicLink: (token: string, email: string) => Promise<boolean>;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  email: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const checkAuth = () => {
      const storedEmail = localStorage.getItem('portfolioUserEmail');
      const storedAuthTime = localStorage.getItem('portfolioAuthTime');
      
      if (storedEmail && storedAuthTime) {
        const authTime = parseInt(storedAuthTime);
        const currentTime = new Date().getTime();
        
        // Session expires after 24 hours
        if (currentTime - authTime < 24 * 60 * 60 * 1000) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            email: storedEmail,
          });
          return;
        } else {
          // Session expired
          localStorage.removeItem('portfolioUserEmail');
          localStorage.removeItem('portfolioAuthTime');
        }
      }
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        email: null,
      });
    };
    
    checkAuth();
  }, []);

  const login = async (email: string) => {
    // In a real app, you would validate the login token with your backend
    // For now we'll simulate a successful login
    localStorage.setItem('portfolioUserEmail', email);
    localStorage.setItem('portfolioAuthTime', new Date().getTime().toString());
    
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      email: email,
    });
    
    toast({
      title: "Login successful",
      description: `Welcome, ${email}`,
    });
  };

  const logout = () => {
    localStorage.removeItem('portfolioUserEmail');
    localStorage.removeItem('portfolioAuthTime');
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      email: null,
    });
    
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  const sendMagicLink = async (email: string): Promise<boolean> => {
    try {
      // In a real app, you would call your API to send a magic link
      // For this demo, we'll simulate the process
      
      // Generate a simple token (in a real app, this would be more secure)
      const token = Math.random().toString(36).substring(2, 15);
      
      // Store the email and token temporarily
      sessionStorage.setItem('pendingAuthEmail', email);
      sessionStorage.setItem('magicLinkToken', token);
      
      // Set expiration time (30 minutes)
      const expiresAt = new Date().getTime() + 30 * 60 * 1000;
      sessionStorage.setItem('magicLinkExpires', expiresAt.toString());
      
      // Log the magic link URL for demonstration purposes
      console.log(`Magic link for demo: ${window.location.origin}/login?token=${token}&email=${encodeURIComponent(email)}`);
      
      toast({
        title: "Magic link sent",
        description: "Check your inbox and click the link to sign in.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to send magic link:", error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send the login link. Please try again.",
      });
      
      return false;
    }
  };

  const verifyMagicLink = async (token: string, email: string): Promise<boolean> => {
    const pendingEmail = sessionStorage.getItem('pendingAuthEmail');
    const storedToken = sessionStorage.getItem('magicLinkToken');
    const expiresAtStr = sessionStorage.getItem('magicLinkExpires');
    
    if (!pendingEmail || !storedToken || !expiresAtStr) {
      toast({
        variant: "destructive",
        title: "Invalid link",
        description: "This login link is invalid or has expired. Please request a new one.",
      });
      return false;
    }
    
    const expiresAt = parseInt(expiresAtStr);
    const currentTime = new Date().getTime();
    
    // Check if the link has expired
    if (currentTime > expiresAt) {
      sessionStorage.removeItem('pendingAuthEmail');
      sessionStorage.removeItem('magicLinkToken');
      sessionStorage.removeItem('magicLinkExpires');
      
      toast({
        variant: "destructive",
        title: "Link expired",
        description: "This login link has expired. Please request a new one.",
      });
      return false;
    }
    
    // Verify the token and email
    if (email === pendingEmail && token === storedToken) {
      // Clear the pending authentication data
      sessionStorage.removeItem('pendingAuthEmail');
      sessionStorage.removeItem('magicLinkToken');
      sessionStorage.removeItem('magicLinkExpires');
      
      // Complete login
      await login(email);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Invalid link",
      description: "This login link is invalid. Please request a new one.",
    });
    return false;
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, sendMagicLink, verifyMagicLink }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
