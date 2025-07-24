import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useChamaMeetings = (chamaId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch meetings for the chama
  const meetingsQuery = useQuery({
    queryKey: ['chama-meetings', chamaId],
    queryFn: async () => {
      console.log('Fetching meetings for chama:', chamaId);

      const { data, error } = await supabase
        .from('chama_meetings')
        .select(`
          *,
          chama_members!inner(
            id,
            user_id,
            profiles!inner(full_name, email)
          )
        `)
        .eq('chama_id', chamaId)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching meetings:', error);
        throw error;
      }

      console.log('Fetched meetings:', data);
      return data || [];
    },
    enabled: !!chamaId,
  });

  // Schedule a new meeting
  const scheduleMeetingMutation = useMutation({
    mutationFn: async ({ 
      title, 
      description, 
      scheduledDate,
      meetingType,
      location 
    }: {
      title: string;
      description: string;
      scheduledDate: string;
      meetingType: 'physical' | 'virtual' | 'hybrid';
      location?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Scheduling meeting:', { title, description, scheduledDate, meetingType, location });

      // Get current user's member ID
      const { data: memberData, error: memberError } = await supabase
        .from('chama_members')
        .select('id')
        .eq('chama_id', chamaId)
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        console.error('Error getting member data:', memberError);
        throw new Error('You must be a member to schedule meetings');
      }

      // Create meeting
      const { data, error } = await supabase
        .from('chama_meetings')
        .insert({
          chama_id: chamaId,
          organizer_id: memberData.id,
          title,
          description,
          scheduled_date: scheduledDate,
          meeting_type: meetingType,
          location: location || null,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating meeting:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chama-meetings'] });
      toast({
        title: "Meeting Scheduled! 📅",
        description: "Your meeting has been scheduled successfully",
      });
    },
    onError: (error: any) => {
      console.error('Meeting scheduling failed:', error);
      toast({
        title: "Scheduling Failed",
        description: error.message || "Failed to schedule meeting",
        variant: "destructive",
      });
    },
  });

  // Update meeting attendance
  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ meetingId, attendance }: { meetingId: string; attendance: 'attending' | 'not_attending' | 'maybe' }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Updating attendance:', { meetingId, attendance });

      // Get current user's member ID
      const { data: memberData, error: memberError } = await supabase
        .from('chama_members')
        .select('id')
        .eq('chama_id', chamaId)
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        console.error('Error getting member data:', memberError);
        throw new Error('You must be a member to update attendance');
      }

      // Upsert attendance record
      const { data, error } = await supabase
        .from('meeting_attendance')
        .upsert({
          meeting_id: meetingId,
          member_id: memberData.id,
          status: attendance,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating attendance:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chama-meetings'] });
      toast({
        title: "Attendance Updated! ✅",
        description: "Your attendance status has been updated",
      });
    },
    onError: (error: any) => {
      console.error('Attendance update failed:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update attendance",
        variant: "destructive",
      });
    },
  });

  return {
    meetings: meetingsQuery.data || [],
    isLoading: meetingsQuery.isLoading,
    scheduleMeeting: scheduleMeetingMutation.mutate,
    isScheduling: scheduleMeetingMutation.isPending,
    updateAttendance: updateAttendanceMutation.mutate,
    isUpdatingAttendance: updateAttendanceMutation.isPending,
  };
};