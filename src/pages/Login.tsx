
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { authState, login, sendMagicLink } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get the token from URL if it exists
  const token = searchParams.get('token');
  const emailFromParams = searchParams.get('email');
  
  useEffect(() => {
    // Check if this is a magic link login
    if (token && emailFromParams) {
      // Validate token (in a real app you'd verify this against your backend)
      const pendingEmail = sessionStorage.getItem('pendingAuthEmail');
      
      if (pendingEmail === emailFromParams) {
        // Clear the pending email
        sessionStorage.removeItem('pendingAuthEmail');
        
        // Complete login
        login(emailFromParams);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, emailFromParams]);
  
  // If user is already authenticated, redirect to admin
  if (authState.isAuthenticated) {
    return <Navigate to="/admin" />;
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    const success = await sendMagicLink(email);
    setIsSubmitting(false);
    
    if (success) {
      setMagicLinkSent(true);
    }
  };
  
  // For demo purposes, simulate magic link
  const handleSimulateLogin = () => {
    // In a real app, the user would receive an email with this link
    window.location.href = `/login?token=demo-token&email=${encodeURIComponent(email)}`;
  };
  
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">כניסה למערכת</CardTitle>
          <CardDescription>
            כניסה לניהול גלריית תיק העבודות
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {magicLinkSent ? (
            <div className="text-center space-y-4">
              <div className="bg-secondary p-4 rounded-lg inline-block mx-auto">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-8 h-8 mx-auto text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium">בדוק את תיבת הדואר שלך</h3>
              <p className="text-muted-foreground">
                שלחנו קישור כניסה ל-{email}. 
                לחץ על הקישור כדי להיכנס למערכת.
              </p>
              
              {/* For demo purposes only */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground mb-2">לצורך הדגמה בלבד:</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSimulateLogin}
                >
                  סימולציית קישור קסם
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>
            
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !email.trim()}
              >
                {isSubmitting ? 'שולח...' : 'שלח לי קישור כניסה'}
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <p>נשלח אליך קישור למייל כדי להתחבר</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
