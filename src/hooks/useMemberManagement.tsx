
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export const useMemberManagement = (chamaId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chama members
  const { data: members, isLoading } = useQuery({
    queryKey: ['chama-members', chamaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chama_members')
        .select(`
          *,
          profiles(full_name, email, phone_number)
        `)
        .eq('chama_id', chamaId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  // Update member role mutation
  const updateMemberRoleMutation = useMutation({
    mutationFn: async ({ memberId, newRole }: { memberId: string; newRole: string }) => {
      console.log('=== Updating Member Role ===');
      console.log('Member ID:', memberId);
      console.log('New Role:', newRole);

      const { error } = await supabase
        .from('chama_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Role Updated! ✅",
        description: "Member role has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['chama-members', chamaId] });
    },
    onError: (error: any) => {
      console.error('Error updating member role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member role",
        variant: "destructive",
      });
    },
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: async ({ email, role = 'member' }: { email: string; role?: string }) => {
      console.log('=== Inviting Member ===');
      console.log('Email:', email);
      console.log('Role:', role);

      // Check if user exists in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .single();

      if (profileError || !profile) {
        throw new Error('User with this email is not registered. They need to sign up first.');
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('chama_members')
        .select('id')
        .eq('chama_id', chamaId)
        .eq('user_id', profile.user_id)
        .single();

      if (existingMember) {
        throw new Error('User is already a member of this chama.');
      }

      // Add as member
      const { error } = await supabase
        .from('chama_members')
        .insert({
          chama_id: chamaId,
          user_id: profile.user_id,
          role: role,
          is_active: true,
          total_contributed: 0,
        });

      if (error) throw error;

      // Update chama member count using raw SQL increment
      const { error: updateError } = await supabase.rpc('increment_chama_members', {
        chama_id: chamaId
      });

      if (updateError) {
        console.error('Error updating member count:', updateError);
        // Fallback to manual update
        const { data: chama } = await supabase
          .from('chamas')
          .select('current_members')
          .eq('id', chamaId)
          .single();

        if (chama) {
          await supabase
            .from('chamas')
            .update({ current_members: (chama.current_members || 0) + 1 })
            .eq('id', chamaId);
        }
      }

      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Member Added! ✅",
        description: "Member has been added to the chama successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['chama-members', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['chamas'] });
    },
    onError: (error: any) => {
      console.error('Error inviting member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    },
  });

  return {
    members,
    isLoading,
    updateMemberRole: updateMemberRoleMutation.mutate,
    isUpdatingRole: updateMemberRoleMutation.isPending,
    inviteMember: inviteMemberMutation.mutate,
    isInviting: inviteMemberMutation.isPending,
  };
};
