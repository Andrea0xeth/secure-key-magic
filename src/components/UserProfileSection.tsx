import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export const UserProfileSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
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
            setEditedProfile(profileData);
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

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && editedProfile) {
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: editedProfile.first_name,
            last_name: editedProfile.last_name,
            email: editedProfile.email
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile:', error);
          toast({
            title: "Error",
            description: "Failed to update profile information",
            variant: "destructive",
          });
        } else {
          setProfile(editedProfile);
          setIsEditing(false);
          toast({
            title: "Success",
            description: "Profile updated successfully",
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile information",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading profile...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Information</CardTitle>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="h-8 w-8"
          >
            <Save className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          {isEditing ? (
            <Input
              value={editedProfile?.first_name || ''}
              onChange={(e) => 
                setEditedProfile(prev => ({ ...prev!, first_name: e.target.value }))
              }
              placeholder="Enter first name"
            />
          ) : (
            <div className="p-2 bg-secondary rounded-md">
              {profile?.first_name || 'Not set'}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          {isEditing ? (
            <Input
              value={editedProfile?.last_name || ''}
              onChange={(e) => 
                setEditedProfile(prev => ({ ...prev!, last_name: e.target.value }))
              }
              placeholder="Enter last name"
            />
          ) : (
            <div className="p-2 bg-secondary rounded-md">
              {profile?.last_name || 'Not set'}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          {isEditing ? (
            <Input
              value={editedProfile?.email || ''}
              onChange={(e) => 
                setEditedProfile(prev => ({ ...prev!, email: e.target.value }))
              }
              placeholder="Enter email"
            />
          ) : (
            <div className="p-2 bg-secondary rounded-md">
              {profile?.email || 'Not set'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};