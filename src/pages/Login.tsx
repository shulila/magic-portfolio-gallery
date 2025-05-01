
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [verifyingLink, setVerifyingLink] = useState(false);
  const { authState, sendMagicLink, verifyMagicLink } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get the token from URL if it exists
  const token = searchParams.get('token');
  const emailFromParams = searchParams.get('email');
  
  useEffect(() => {
    // Check if this is a magic link login
    if (token && emailFromParams) {
      const verifyTokenAsync = async () => {
        setVerifyingLink(true);
        await verifyMagicLink(token, emailFromParams);
        setVerifyingLink(false);
      };
      
      verifyTokenAsync();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, emailFromParams]);
  
  // If user is already authenticated, redirect to admin
  if (authState.isAuthenticated) {
    return <Navigate to="/admin" />;
  }
  
  // If we're verifying a link, show loading
  if (verifyingLink) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl">Verifying your login</CardTitle>
              <CardDescription>
                Please wait while we verify your login link...
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
    const token = sessionStorage.getItem('magicLinkToken');
    window.location.href = `/login?token=${token}&email=${encodeURIComponent(email)}`;
  };
  
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Portfolio Admin Login</CardTitle>
          <CardDescription>
            Sign in to manage your portfolio gallery
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {magicLinkSent ? (
            <div className="text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg inline-block mx-auto">
                <Mail className="w-8 h-8 mx-auto text-primary" />
              </div>
              <h3 className="text-xl font-medium">Check your inbox</h3>
              <p className="text-muted-foreground">
                We've sent a login link to {email}.
                Click the link to sign in.
              </p>
              
              {/* For demo purposes only */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground mb-2">For demonstration purposes only:</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSimulateLogin}
                >
                  Simulate Magic Link
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full inline-flex">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This admin area is restricted to authorized users only
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !email.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send me a login link'
                )}
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <p>A magic link will be sent to your email to log in</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
