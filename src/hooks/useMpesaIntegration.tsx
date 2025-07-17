
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useMpesaIntegration = () => {
  const { toast } = useToast();

  const stkPushMutation = useMutation({
    mutationFn: async ({ phoneNumber, amount, description }: {
      phoneNumber: string;
      amount: number;
      description?: string;
    }) => {
      console.log('=== M-Pesa STK Push Started ===');
      console.log('Phone Number:', phoneNumber);
      console.log('Amount:', amount);
      console.log('Description:', description);

      try {
        const { data, error } = await supabase.functions.invoke('mpesa-integration', {
          body: {
            action: 'stk_push',
            phoneNumber,
            amount,
            description: description || 'Chama transaction'
          }
        });

        console.log('=== Supabase Function Response ===');
        console.log('Data:', data);
        console.log('Error:', error);

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'Failed to call M-Pesa service');
        }

        if (!data) {
          console.error('No data returned from function');
          throw new Error('No response from M-Pesa service');
        }

        // Check if the response indicates an error
        if (!data.success) {
          console.error('M-Pesa API error:', data.error);
          throw new Error(data.error || 'M-Pesa transaction failed');
        }

        console.log('=== M-Pesa API Response ===');
        console.log('Response Code:', data.ResponseCode);
        console.log('Response Description:', data.ResponseDescription);
        console.log('Full Response:', data);

        return data;
      } catch (err) {
        console.error('=== M-Pesa Integration Error ===');
        console.error('Error message:', err instanceof Error ? err.message : 'Unknown error');
        console.error('Full error:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('=== STK Push Mutation Success ===');
      console.log('Success data:', data);
      
      if (data?.ResponseCode === '0' || data?.success) {
        toast({
          title: "Payment Request Sent! 📱",
          description: "Check your phone for the M-Pesa PIN prompt to complete the payment.",
        });
      } else {
        console.warn('Unexpected response:', data);
        toast({
          title: "Payment Request Issues",
          description: data?.ResponseDescription || data?.error || "Please check your phone and try again",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('=== STK Push Mutation Error ===');
      console.error('Error in onError:', error);
      
      let errorMessage = "Failed to initiate payment. Please try again.";
      
      if (error?.message) {
        if (error.message.includes('credentials')) {
          errorMessage = "M-Pesa service configuration error. Please contact support.";
        } else if (error.message.includes('network') || error.message.includes('Network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes('phone') || error.message.includes('Phone')) {
          errorMessage = "Invalid phone number. Please check the format and try again.";
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = "Insufficient funds in your M-Pesa account.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Request timeout. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Payment Failed ❌",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    stkPushMutation,
    isProcessingPayment: stkPushMutation.isPending,
  };
};
