import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export const UserProfileSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            toast({
              title: "Error",
              description: "Failed to load profile information",
              variant: "destructive",
            });
          } else {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  if (loading) {
    return <div className="animate-pulse">Loading profile...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <div className="p-2 bg-secondary rounded-md">
            {profile?.first_name || 'Not set'}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <div className="p-2 bg-secondary rounded-md">
            {profile?.last_name || 'Not set'}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="p-2 bg-secondary rounded-md">
            {profile?.email || 'Not set'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};