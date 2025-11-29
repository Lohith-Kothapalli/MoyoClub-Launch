import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPassword({ isOpen, onClose }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      toast.success("Password reset link sent!", {
        description: "Check your email for instructions to reset your password",
        duration: 5000,
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setEmail("");
        onClose();
      }, 3000);
    }, 1500);
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail("");
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your password
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="forgot-email">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1"
                style={{ backgroundColor: "#E87722" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "#E8772220" }}
            >
              <CheckCircle2 className="h-8 w-8" style={{ color: "#E87722" }} />
            </div>
            <h3 className="text-lg mb-2">Email Sent!</h3>
            <p className="text-gray-600 text-sm">
              Check your inbox for password reset instructions
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
