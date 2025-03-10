
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EventForm } from "@/components/admin/EventForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Try to connect to Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Supabase session error:", sessionError);
          setConnectionError(true);
          return;
        }
        
        if (!session) {
          navigate("/");
          return;
        }
        
        // Additional admin check
        if (session.user.email !== "ADMIN@admin.com") {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Admin check error:", error);
        setConnectionError(true);
      }
    };
    
    checkAdmin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-artence-navy dark:via-artence-dark dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>
        
        {connectionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Unable to connect to the database. Some administrative functions may be unavailable.
            </AlertDescription>
          </Alert>
        )}
        
        <EventForm />
      </div>
    </div>
  );
};

export default Admin;
