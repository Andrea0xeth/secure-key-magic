import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EventForm } from "@/components/admin/EventForm";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== "ADMIN@admin.com") {
        navigate("/");
      }
    };
    
    checkAdmin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-artence-navy dark:via-artence-dark dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>
        <EventForm />
      </div>
    </div>
  );
};

export default Admin;