
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Shield, 
  Building2,
  Users,
  TrendingUp,
  Wallet,
  Brain,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthPage: React.FC = () => {
  const { signIn, signUp, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await signIn(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signUp(formData.email, formData.password, formData.fullName);
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  const features = [
    {
      icon: Users,
      title: "Chama Management",
      description: "Create and manage savings groups with trusted members"
    },
    {
      icon: Wallet,
      title: "Smart Wallet",
      description: "Secure digital wallet with mobile money integration"
    },
    {
      icon: TrendingUp,
      title: "Investment Tracking",
      description: "Monitor your savings growth and investment returns"
    },
    {
      icon: Brain,
      title: "AI Financial Navigator",
      description: "Get personalized financial insights and predictions"
    },
    {
      icon: Shield,
      title: "Secure Lending",
      description: "Access loans with competitive rates and flexible terms"
    },
    {
      icon: Building2,
      title: "Bank Integration",
      description: "Connect with verified financial institutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 text-white flex-col justify-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to ChamaVault
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            The future of community finance and digital savings in Kenya
          </p>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="font-semibold">Trusted by 10,000+ users</span>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="font-semibold">KES 50M+ in savings managed</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="font-semibold">Bank-grade security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              ChamaVault
            </div>
            <p className="text-muted-foreground">
              Your gateway to smart community finance
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started Today</CardTitle>
              <CardDescription>
                Join thousands of users building their financial future
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" disabled={isLoading}>
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" disabled={isLoading}>
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={isLoading}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          disabled={isLoading}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          disabled={isLoading}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={isLoading}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          disabled={isLoading}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          disabled={isLoading}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Separator />
                <div className="text-center text-sm text-muted-foreground mt-4">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Need help? Contact our{' '}
            <a href="#" className="text-primary hover:underline">support team</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
