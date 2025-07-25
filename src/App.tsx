import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import VerticalNavigation from "@/components/VerticalNavigation";
import HorizontalSubNav from "@/components/HorizontalSubNav";

// Page imports
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ChamasPage from "./pages/ChamasPage";
import ChamaDetailPage from "./pages/ChamaDetailPage";
import CreateChamaPage from "./pages/CreateChamaPage";
import JoinChamaPage from "./pages/JoinChamaPage";
import AdvancedChamaPage from "./pages/AdvancedChamaPage";
import InvestmentPage from "./pages/InvestmentPage";
import StakingPage from "./pages/StakingPage";
import P2PTradingPage from "./pages/P2PTradingPage";
import SmartWalletPage from "./pages/SmartWalletPage";
import MobileMoneyPage from "./pages/MobileMoneyPage";
import PersonalSavingsPage from "./pages/PersonalSavingsPage";
import LoanManagementPage from "./pages/LoanManagementPage";
import AdaptiveCreditPage from "./pages/AdaptiveCreditPage";
import BlockchainLendingPage from "./pages/BlockchainLendingPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CommunityHubPage from "./pages/CommunityHubPage";
import VotingSystemPage from "./pages/VotingSystemPage";
import FinancialNavigatorPage from "./pages/FinancialNavigatorPage";
import AdminPortalPage from "./pages/AdminPortalPage";
import BankPortalPage from "./pages/BankPortalPage";
import AvailableChamasPage from "./pages/AvailableChamasPage";
import PartnerDashboardPage from "./pages/PartnerDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Sub-navigation configurations
const getSubNavItems = (pathname: string) => {
  if (pathname.startsWith('/chamas') || pathname === '/create-chama' || pathname === '/join-chama' || pathname === '/advanced-chama' || pathname === '/available-chamas') {
    return [
      { title: 'My Chamas', path: '/chamas', description: 'View and manage your chamas' },
      { title: 'Available Chamas', path: '/available-chamas', badge: 'New', description: 'Browse and join chamas' },
      { title: 'Create Chama', path: '/create-chama', description: 'Start a new chama' },
      { title: 'Join Chama', path: '/join-chama', description: 'Join an existing chama' },
      { title: 'Advanced Features', path: '/advanced-chama', badge: 'Pro', description: 'Advanced chama management' },
    ];
  }
  
  if (pathname.startsWith('/investment') || pathname === '/staking' || pathname === '/p2p-trading') {
    return [
      { title: 'Portfolio', path: '/investment', description: 'Investment portfolio' },
      { title: 'Staking', path: '/staking', badge: 'Earn', description: 'Stake and earn rewards' },
      { title: 'P2P Trading', path: '/p2p-trading', description: 'Peer-to-peer trading' },
    ];
  }
  
  if (pathname.startsWith('/smart-wallet') || pathname === '/mobile-money' || pathname === '/personal-savings') {
    return [
      { title: 'Smart Wallet', path: '/smart-wallet', badge: 'AI', description: 'AI-powered wallet management' },
      { title: 'Mobile Money', path: '/mobile-money', description: 'M-Pesa integration' },
      { title: 'Personal Savings', path: '/personal-savings', badge: 'New', description: 'Personal savings & lending' },
    ];
  }
  
  if (pathname.startsWith('/loan-management') || pathname === '/adaptive-credit' || pathname === '/blockchain-lending') {
    return [
      { title: 'My Loans', path: '/loan-management', description: 'Manage your loans' },
      { title: 'Adaptive Credit', path: '/adaptive-credit', badge: 'Smart', description: 'AI-powered credit scoring' },
      { title: 'Blockchain Lending', path: '/blockchain-lending', badge: 'DeFi', description: 'Decentralized lending' },
    ];
  }
  
  if (pathname.startsWith('/community-hub') || pathname === '/voting-system' || pathname === '/financial-navigator') {
    return [
      { title: 'Community Hub', path: '/community-hub', description: 'Community features' },
      { title: 'Voting System', path: '/voting-system', description: 'Democratic decision making' },
      { title: 'Financial Navigator', path: '/financial-navigator', badge: 'Guide', description: 'Financial guidance' },
    ];
  }
  
  return null;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const subNavItems = getSubNavItems(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50">
      <VerticalNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {subNavItems && (
          <HorizontalSubNav items={subNavItems} />
        )}
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/chamas" element={<ChamasPage />} />
                        <Route path="/available-chamas" element={<AvailableChamasPage />} />
                        <Route path="/chama/:id" element={<ChamaDetailPage />} />
                        <Route path="/create-chama" element={<CreateChamaPage />} />
                        <Route path="/join-chama" element={<JoinChamaPage />} />
                        <Route path="/advanced-chama" element={<AdvancedChamaPage />} />
                        <Route path="/partner-dashboard" element={<PartnerDashboardPage />} />
                        <Route path="/investment" element={<InvestmentPage />} />
                        <Route path="/staking" element={<StakingPage />} />
                        <Route path="/p2p-trading" element={<P2PTradingPage />} />
                        <Route path="/smart-wallet" element={<SmartWalletPage />} />
                        <Route path="/mobile-money" element={<MobileMoneyPage />} />
                        <Route path="/personal-savings" element={<PersonalSavingsPage />} />
                        <Route path="/loan-management" element={<LoanManagementPage />} />
                        <Route path="/adaptive-credit" element={<AdaptiveCreditPage />} />
                        <Route path="/blockchain-lending" element={<BlockchainLendingPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/community-hub" element={<CommunityHubPage />} />
                        <Route path="/voting-system" element={<VotingSystemPage />} />
                        <Route path="/financial-navigator" element={<FinancialNavigatorPage />} />
                        <Route path="/admin-portal" element={<AdminPortalPage />} />
                        <Route path="/bank-portal" element={<BankPortalPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;