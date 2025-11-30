import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Separator } from "./ui/separator";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_ENDPOINTS, apiRequest } from "../config/api";
import { setAuthToken } from "../config/api";
import { analytics } from "../utils/analytics";

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  created_at: string;
}

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserData, token: string) => void;
  defaultTab?: 'login' | 'signup';
}

export function Auth({ isOpen, onClose, onAuthSuccess, defaultTab = 'login' }: AuthProps) {
  const [step, setStep] = useState('email' as 'email' | 'otp' | 'details');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [mockOtp, setMockOtp] = useState(undefined as string | undefined);
  const [isSignup, setIsSignup] = useState(defaultTab === 'signup');
  const [hasAttemptedVerify, setHasAttemptedVerify] = useState(false);

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRequestOTP = async () => {
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Requesting OTP for email:', email);
      const response = await apiRequest(API_ENDPOINTS.AUTH.REQUEST_OTP, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.success) {
        console.log('OTP request successful. Response:', response);
        setMockOtp(response.mockOtp); // For dev mode

        // Track OTP request (check if it's a resend)
        const isResend = step === 'otp';
        if (isResend) {
          analytics.resendOTP();
        } else {
          analytics.otpRequested(email);
        }

        setStep('otp');
        setHasAttemptedVerify(false); // Reset verification attempt flag
        toast.success('OTP sent successfully!', {
          description: mockOtp
            ? `Your OTP is: ${mockOtp}`
            : 'Check your email for the OTP',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.log('OTP request failed:', error);
      toast.error('Failed to send OTP', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setHasAttemptedVerify(true);
    try {
      if (isSignup) {
        // For signup, go to details step
        setStep('details');
        setIsLoading(false);
        setHasAttemptedVerify(false);
        analytics.otpVerified(true);
      } else {
        // For login, verify OTP directly
        await verifyOTPAndLogin();
        setHasAttemptedVerify(false);
        analytics.otpVerified(true);
      }
    } catch (error: any) {
      analytics.otpVerified(false);
      toast.error('Invalid OTP', {
        description: error.message || 'Please try again',
      });
      setIsLoading(false);
      // Don't reset hasAttemptedVerify here - let user manually retry
    }
  };

  // Reset verification attempt flag when OTP changes (allows retry after error)
  useEffect(() => {
    if (otp.length < 6 && hasAttemptedVerify) {
      setHasAttemptedVerify(false);
    }
  }, [otp, hasAttemptedVerify]);

  // Auto-verify when OTP is complete (only once, not continuously)
  useEffect(() => {
    if (otp.length === 6 && step === 'otp' && !isLoading && !hasAttemptedVerify) {
      // Small delay to let user see the last digit
      const timer = setTimeout(() => {
        handleVerifyOTP();
      }, 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step, isLoading, hasAttemptedVerify]);

  const verifyOTPAndLogin = async (userDetails?: typeof signupData) => {
    try {
      const requestBody: any = {
        email,
        otp,
      };

      // Add user details for signup
      if (isSignup && userDetails) {
        requestBody.name = userDetails.name;
        if (userDetails.phone) requestBody.phone = userDetails.phone;
        if (userDetails.address) requestBody.address = userDetails.address;
        if (userDetails.city) requestBody.city = userDetails.city;
        if (userDetails.state) requestBody.state = userDetails.state;
        if (userDetails.pincode) requestBody.pincode = userDetails.pincode;
      }

      const response = await apiRequest(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      if (response.success) {
        setAuthToken(response.token);
        onAuthSuccess(response.user, response.token);

        // Track analytics
        if (isSignup) {
          analytics.signUp('email');
        } else {
          analytics.login('email');
        }

        onClose();
        resetForms();
        toast.success(isSignup ? 'Account created successfully!' : 'Welcome back!', {
          description: `Logged in as ${response.user.name}`,
          duration: 3000,
        });
      }
    } catch (error: any) {
      // Extract error message from response
      const errorMessage = error.message || 'Failed to verify OTP. Please try again.';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSignup = async () => {
    const { name, phone, address, city, state, pincode } = signupData;

    if (!name) {
      toast.error('Name is required');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTPAndLogin(signupData);
    } catch (error: any) {
      toast.error('Failed to create account', {
        description: error.message || 'Please try again',
      });
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setEmail('');
    setOtp('');
    setStep('email');
    setSignupData({
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    });
    setMockOtp(undefined);
    setHasAttemptedVerify(false);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('email');
      setOtp('');
    } else if (step === 'details') {
      setStep('otp');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <img src="/images/logo.png" alt="MoyoClub Logo" className="h-16 w-16 object-contain" />
          </div>
          <DialogTitle className="text-2xl">Welcome to MoyoClub</DialogTitle>
          <DialogDescription>
            {step === 'email' && (isSignup ? 'Create an account' : 'Sign in to your account')}
            {step === 'otp' && 'Enter the OTP sent to your email'}
            {step === 'details' && 'Complete your profile'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRequestOTP()}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">We'll send you an OTP to verify your email</p>
            </div>

            <Button
              className="w-full"
              size="lg"
              style={{ backgroundColor: '#E87722' }}
              onClick={handleRequestOTP}
              disabled={isLoading || !validateEmail(email)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <button
                    className="hover:underline"
                    style={{ color: '#E87722' }}
                    onClick={() => setIsSignup(false)}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    className="hover:underline"
                    style={{ color: '#E87722' }}
                    onClick={() => setIsSignup(true)}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="space-y-6">
              <div className="text-center">
                <Label className="text-lg font-semibold">Enter Verification Code</Label>
                <p className="text-sm text-gray-600 mt-2">
                  We sent a 6-digit code to <span className="font-medium">{email}</span>
                </p>
              </div>

              <div className="flex justify-center py-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  autoFocus
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {mockOtp && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-blue-900">
                    Dev Mode: Your OTP is <span className="font-mono text-lg">{mockOtp}</span>
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying OTP...
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  style={{ backgroundColor: '#E87722' }}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleRequestOTP}
                  disabled={isLoading}
                  className="w-full"
                >
                  Resend Code
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={signupData.name}
                onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                value={signupData.phone}
                onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
              />
            </div>

            <Separator />
            <p className="text-sm text-gray-600">Optional: Add delivery address</p>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="House/Flat No., Street"
                value={signupData.address}
                onChange={(e) => setSignupData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Mumbai"
                  value={signupData.city}
                  onChange={(e) => setSignupData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="Maharashtra"
                  value={signupData.state}
                  onChange={(e) => setSignupData(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="400001"
                  maxLength={6}
                  value={signupData.pincode}
                  onChange={(e) => setSignupData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                />
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              style={{ backgroundColor: '#E87722' }}
              onClick={handleCompleteSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Complete Signup'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
