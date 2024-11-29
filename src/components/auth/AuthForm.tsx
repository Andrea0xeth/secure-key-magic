import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { Alert, AlertDescription } from "../ui/alert";
import { AuthError } from "@supabase/supabase-js";

export const AuthForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in successfully");
        toast({
          title: "Benvenuto!",
          description: "Hai effettuato l'accesso con successo.",
        });
        navigate('/');
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        toast({
          title: "Disconnesso",
          description: "Sei stato disconnesso con successo.",
        });
      }

      if (event === 'USER_UPDATED') {
        console.log("User updated:", session);
      }

      setError(null);
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    if (error.message.includes("weak_password")) {
      setError("La password deve contenere almeno 6 caratteri.");
    } else if (error.message.includes("invalid_credentials")) {
      setError("Credenziali non valide. Verifica email e password.");
    } else if (error.message.includes("already registered")) {
      setError("Questo utente è già registrato. Prova ad accedere invece.");
    } else {
      setError("Si è verificato un errore durante l'autenticazione. Riprova.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-artence-navy dark:text-white">
          Benvenuto a Hendrick's Events
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Accedi per esperienze gin esclusive
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
          className: {
            container: 'auth-form-container',
            label: 'auth-form-label',
            input: 'auth-form-input',
            button: 'auth-form-button',
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}`}
        magicLink={false}
        showLinks={true}
        view="sign_up"
        localization={{
          variables: {
            sign_up: {
              email_label: 'Indirizzo email',
              password_label: 'Password (minimo 6 caratteri)',
              button_label: 'Registrati',
              loading_button_label: 'Registrazione in corso...',
              social_provider_text: 'Accedi con',
              link_text: 'Non hai un account? Registrati',
            },
            sign_in: {
              email_label: 'Indirizzo email',
              password_label: 'Password',
              button_label: 'Accedi',
              loading_button_label: 'Accesso in corso...',
              social_provider_text: 'Accedi con',
              link_text: 'Hai già un account? Accedi',
            },
          },
        }}
        options={{
          emailRedirectTo: `${window.location.origin}`,
          data: {
            first_name: '',
            last_name: '',
          }
        }}
        extendedSignUpFields={[
          {
            id: 'first_name',
            label: 'Nome',
            type: 'text',
            required: true,
          },
          {
            id: 'last_name',
            label: 'Cognome',
            type: 'text',
            required: true,
          },
        ]}
      />
    </div>
  );
};