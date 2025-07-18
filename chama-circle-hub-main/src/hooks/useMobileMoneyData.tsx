
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useMpesaIntegration } from '@/hooks/useMpesaIntegration';

export const useMobileMoneyData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { stkPushMutation } = useMpesaIntegration();

  const mobileMoneyQuery = useQuery({
    queryKey: ['mobile-money-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching mobile money data for user:', user.id);

      // Fetch user's mobile money accounts
      const { data: accounts, error: accountsError } = await supabase
        .from('mobile_money_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (accountsError) {
        console.error('Error fetching mobile money accounts:', accountsError);
        throw accountsError;
      }

      // Fetch recent transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
      }

      // Calculate statistics
      const totalTransactions = transactions?.length || 0;
      const successfulTransactions = transactions?.filter(t => t.status === 'completed').length || 0;
      const pendingTransactions = transactions?.filter(t => t.status === 'pending').length || 0;
      const failedTransactions = transactions?.filter(t => t.status === 'failed').length || 0;
      
      const totalDeposits = transactions?.filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalWithdrawals = transactions?.filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      // Transaction trends for chart
      const transactionTrends = [];
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      last7Days.forEach(date => {
        const dayTransactions = transactions?.filter(t => 
          t.created_at.split('T')[0] === date
        ) || [];
        
        transactionTrends.push({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          deposits: dayTransactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
          withdrawals: dayTransactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0)
        });
      });

      return {
        accounts: accounts || [],
        transactions: transactions || [],
        statistics: {
          totalTransactions,
          successfulTransactions,
          pendingTransactions,
          failedTransactions,
          totalDeposits,
          totalWithdrawals,
          successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0
        },
        transactionTrends
      };
    },
    enabled: !!user,
  });

  const addAccountMutation = useMutation({
    mutationFn: async ({ provider, phoneNumber, accountName }: { 
      provider: string; 
      phoneNumber: string; 
      accountName?: string; 
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mobile_money_accounts')
        .insert({
          user_id: user.id,
          provider,
          phone_number: phoneNumber,
          account_name: accountName,
          is_verified: false,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-money-data'] });
      toast({
        title: "Account Added",
        description: "Mobile money account has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Account",
        description: error.message || "Failed to add mobile money account",
        variant: "destructive",
      });
    },
  });

  const depositMutation = useMutation({
    mutationFn: async ({ amount, description, phoneNumber }: { 
      amount: number; 
      description?: string;
      phoneNumber: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Use M-Pesa STK Push for real payments
      const result = await stkPushMutation.mutateAsync({
        phoneNumber,
        amount,
        description: description || 'Chama deposit'
      });

      if (result.ResponseCode === '0') {
        // Transaction initiated successfully, create pending record
        const { data, error } = await supabase
          .from('wallet_transactions')
          .insert({
            user_id: user.id,
            amount,
            type: 'deposit',
            currency: 'KES',
            description: description || 'M-Pesa deposit',
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        throw new Error(result.ResponseDescription || 'Failed to initiate payment');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-money-data'] });
      toast({
        title: "Payment Initiated",
        description: "Check your phone for M-Pesa PIN prompt",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to process deposit",
        variant: "destructive",
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description?: string }) => {
      if (!user) throw new Error('User not authenticated');

      // For withdrawals, we'll create a pending transaction and handle it manually
      // In a real app, you'd need additional M-Pesa API calls for B2C transactions
      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          amount: -amount,
          type: 'withdrawal',
          currency: 'KES',
          description: description || 'Mobile money withdrawal',
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-money-data'] });
      toast({
        title: "Withdrawal Request Submitted",
        description: "Your withdrawal request is being processed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to process withdrawal",
        variant: "destructive",
      });
    },
  });

  return {
    ...mobileMoneyQuery,
    addAccountMutation,
    depositMutation,
    withdrawMutation,
    isAddingAccount: addAccountMutation.isPending,
    isProcessingDeposit: depositMutation.isPending || stkPushMutation.isPending,
    isProcessingWithdrawal: withdrawMutation.isPending
  };
};
