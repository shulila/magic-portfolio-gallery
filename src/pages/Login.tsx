
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2, Lock } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const { authState, login } = useAuth();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          await login(data.session.user.email || '');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await login(session.user.email || '');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [login]);
  
  // If user is already authenticated, redirect to admin
  if (authState.isAuthenticated) {
    return <Navigate to="/admin" />;
  }
  
  // If we're checking the session, show loading
  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl">בודק מצב התחברות</CardTitle>
              <CardDescription>
                נא להמתין...
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
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: 'https://magic-portfolio-gallery.lovable.app/login/callback'
        }
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "שגיאה בהתחברות",
          description: error.message,
        });
        return;
      }
      
      setMagicLinkSent(true);
      toast({
        title: "קישור התחברות נשלח למייל",
        description: "בדוק את תיבת הדואר שלך",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות",
        description: "אירעה שגיאה בתהליך ההתחברות. נסה שנית מאוחר יותר.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-[70vh]" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">התחברות למערכת הניהול</CardTitle>
          <CardDescription>
            התחבר כדי לנהל את תיק העבודות שלך
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {magicLinkSent ? (
            <div className="text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg inline-block mx-auto">
                <Mail className="w-8 h-8 mx-auto text-primary" />
              </div>
              <h3 className="text-xl font-medium">בדוק את הדואר שלך</h3>
              <p className="text-muted-foreground">
                שלחנו קישור התחברות ל {email}.
                לחץ על הקישור כדי להתחבר.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full inline-flex">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  אזור הניהול מוגבל למשתמשים מורשים בלבד
                </p>
              </div>
              
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    שולח...
                  </>
                ) : (
                  'שלח לי קישור התחברות'
                )}
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <p>קישור התחברות יישלח לאימייל שלך</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
