
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  
  // Determine if current page is home page
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center" dir={isHomePage ? "rtl" : "ltr"}>
          <Link to="/" className="text-xl font-semibold">
            {isHomePage ? "תיק העבודות" : "Portfolio Gallery"}
          </Link>
          
          <nav className="flex gap-4 items-center">
            {authState.isAuthenticated ? (
              <>
                {location.pathname !== '/admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      {isHomePage ? "ניהול גלריה" : "Manage Gallery"}
                    </Button>
                  </Link>
                )}
                {location.pathname !== '/' && (
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      {isHomePage ? "צפייה בגלריה" : "View Gallery"}
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  {isHomePage ? "התנתקות" : "Logout"}
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
                      {isHomePage ? "התחברות" : "Login"}
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
        <div className="container mx-auto" dir={isHomePage ? "rtl" : "ltr"}>
          <p className="text-sm">
            {isHomePage 
              ? `תיק העבודות של שילה © ${new Date().getFullYear()}`
              : `Portfolio Gallery © ${new Date().getFullYear()}`}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
