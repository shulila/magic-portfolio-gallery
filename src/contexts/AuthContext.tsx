
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthState } from '../types';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Whitelist of allowed email addresses
const ALLOWED_EMAILS = ['shilla.bahar@gmail.com'];

interface AuthContextType {
  authState: AuthState;
  login: (email: string) => Promise<void>;
  logout: () => void;
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
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setAuthState({
            isAuthenticated: !!session,
            isLoading: false,
            email: session?.user?.email || null,
          });
        }
      }
    );

    // Check for existing session
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setAuthState({
          isAuthenticated: !!data.session,
          isLoading: false,
          email: data.session?.user?.email || null,
        });
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          email: null,
        });
      }
    };
    
    checkAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string) => {
    // Verify the email is in the whitelist before login
    if (!ALLOWED_EMAILS.includes(email)) {
      toast({
        variant: "destructive",
        title: "גישה נדחתה",
        description: "אינך מורשה לגשת לאפליקציה זו.",
      });
      return;
    }
    
    // Session already validated through Supabase
    toast({
      title: "התחברת בהצלחה",
      description: `ברוך הבא, ${email}`,
    });
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        email: null,
      });
      
      toast({
        title: "התנתקת",
        description: "להתראות בקרוב!",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בהתנתקות",
        description: "אירעה שגיאה בתהליך ההתנתקות. נסה שנית.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
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
