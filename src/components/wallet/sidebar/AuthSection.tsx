import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

interface AuthSectionProps {
  onClose: () => void;
}

export const AuthSection = ({ onClose }: AuthSectionProps) => {
  const {
    isLogin,
    setIsLogin,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    confirmPassword,
    setConfirmPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleLogin,
    handleSignUp,
  } = useAuthForm();

  return (
    <div className="relative p-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-4 rotate-animation"
      >
        <X className="h-5 w-5" />
      </Button>
      
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>
        
        {isLogin ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onSubmit={handleLogin}
            onToggleForm={() => setIsLogin(false)}
          />
        ) : (
          <SignUpForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            onSubmit={handleSignUp}
            onToggleForm={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};