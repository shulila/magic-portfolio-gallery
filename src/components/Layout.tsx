
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold">
            גלריית עבודות
          </Link>
          
          <nav className="flex gap-4 items-center">
            {authState.isAuthenticated ? (
              <>
                {location.pathname !== '/admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      ניהול גלריה
                    </Button>
                  </Link>
                )}
                {location.pathname !== '/' && (
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      צפייה בגלריה
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  התנתק
                </Button>
                <span className="text-sm text-muted-foreground">
                  {authState.email}
                </span>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      כניסה למערכת
                    </Button>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
      
      <footer className="border-t p-4 text-center text-muted-foreground">
        <div className="container mx-auto">
          <p className="text-sm">גלריית עבודות © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
