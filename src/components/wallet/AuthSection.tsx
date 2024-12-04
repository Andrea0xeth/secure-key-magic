import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { SignUpForm } from "../auth/SignUpForm";

interface AuthSectionProps {
  showSignUp: boolean;
  setShowSignUp: (show: boolean) => void;
}

export const AuthSection = ({ showSignUp, setShowSignUp }: AuthSectionProps) => {
  return (
    <div className="mt-8">
      {!showSignUp ? (
        <>
          <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7C3AED',
                  },
                },
              },
            }}
            view={showSignUp ? "sign_up" : "sign_in"}
            providers={[]}
          />
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setShowSignUp(true)}
                className="text-artence-purple hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowSignUp(false)}
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              ←
            </button>
            <h2 className="text-2xl font-semibold">Create an Account</h2>
          </div>
          <SignUpForm onSuccess={() => setShowSignUp(false)} />
        </>
      )}
    </div>
  );
};