
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthState } from '../types';
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  authState: AuthState;
  login: (email: string) => Promise<void>;
  logout: () => void;
  sendMagicLink: (email: string) => Promise<boolean>;
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
      title: "נכנסת למערכת בהצלחה",
      description: `ברוכים הבאים, ${email}`,
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
      title: "יצאת מהמערכת",
      description: "להתראות!",
    });
  };

  const sendMagicLink = async (email: string): Promise<boolean> => {
    try {
      // In a real app, you would call your API to send a magic link
      // For this demo, we'll simulate the process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the email temporarily to validate when they come back with the "token"
      sessionStorage.setItem('pendingAuthEmail', email);
      
      toast({
        title: "קישור נשלח לאימייל",
        description: "בדוק את תיבת הדואר שלך וכנס לקישור.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to send magic link:", error);
      
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא הצלחנו לשלוח את הקישור. נסה שוב.",
      });
      
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, sendMagicLink }}>
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
