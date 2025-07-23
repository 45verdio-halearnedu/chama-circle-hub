<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Calendar, DollarSign, TrendingUp, PiggyBank, Smartphone, Award, BarChart3, Target, Sparkles } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const upcomingContributions = [
    { chama: 'Unity Savings Group', amount: 5000, date: '2024-01-15', status: 'pending' },
    { chama: 'School Fees Chama', amount: 3000, date: '2024-01-12', status: 'due' }
  ];

  const recentActivity = [
    { type: 'contribution', chama: 'Unity Savings Group', amount: 5000, date: '2023-12-15' },
    { type: 'payout', chama: 'School Fees Chama', amount: 24000, date: '2023-12-10' },
    { type: 'joined', chama: 'Tech Entrepreneurs Chama', date: '2023-12-05' }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'personal-savings':
        navigate('/personal-savings');
        break;
      case 'create-chama':
        navigate('/create-chama');
        break;
      case 'smart-wallet':
        navigate('/smart-wallet');
        break;
      case 'investment':
        navigate('/investment');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'mobile-money':
        navigate('/mobile-money');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Hero Section */}
        <div className="text-center space-y-6 py-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
              <PiggyBank className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Welcome to Chama Circle Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your all-in-one platform for building wealth through digital savings groups, smart investments, and community-driven financial growth.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Trusted by 10,000+ Kenyans</span>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Wealth</CardTitle>
              <DollarSign className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              <CurrencyDisplay amount={336000} className="text-3xl font-bold text-white" showToggle={false} />
              <p className="text-xs text-blue-100 flex items-center mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Chamas</CardTitle>
              <Users className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-xs text-green-100">Both performing excellently</p>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Personal Savings</CardTitle>
              <PiggyBank className="h-5 w-5 text-purple-200" />
            </CardHeader>
            <CardContent>
              <CurrencyDisplay amount={85000} className="text-3xl font-bold text-white" showToggle={false} />
              <p className="text-xs text-purple-100">Goal: KES 100,000</p>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white transform hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Growth Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">18.5%</div>
              <p className="text-xs text-orange-100">Annual return</p>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-blue-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-500" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-lg">What would you like to do today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                className="h-24 flex-col gap-3 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 transform hover:scale-105 transition-all duration-200" 
                onClick={() => handleQuickAction('personal-savings')}
              >
                <PiggyBank className="h-8 w-8" />
                <span className="font-medium">Personal Savings</span>
              </Button>
              
              <Button 
                className="h-24 flex-col gap-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 transform hover:scale-105 transition-all duration-200" 
                onClick={() => handleQuickAction('smart-wallet')}
              >
                <Target className="h-8 w-8" />
                <span className="font-medium">Smart Wallet</span>
              </Button>
              
              <Button 
                className="h-24 flex-col gap-3 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 transform hover:scale-105 transition-all duration-200" 
                onClick={() => handleQuickAction('create-chama')}
              >
                <Plus className="h-8 w-8" />
                <span className="font-medium">Create Chama</span>
              </Button>
              
              <Button 
                className="h-24 flex-col gap-3 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 transform hover:scale-105 transition-all duration-200" 
                onClick={() => handleQuickAction('investment')}
              >
                <TrendingUp className="h-8 w-8" />
                <span className="font-medium">Invest</span>
              </Button>
              
              <Button 
                className="h-24 flex-col gap-3 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 transform hover:scale-105 transition-all duration-200" 
                onClick={() => handleQuickAction('mobile-money')}
              >
                <Smartphone className="h-8 w-8" />
                <span className="font-medium">Mobile Money</span>
              </Button>
              
              <Button 
                className="h-24 flex-col gap-3 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-0 transform hover:scale-105 transition-all duration-200" 
                onClick={() => handleQuickAction('analytics')}
              >
                <BarChart3 className="h-8 w-8" />
                <span className="font-medium">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming Contributions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Contributions
              </CardTitle>
              <CardDescription>Your scheduled payments this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingContributions.map((contribution, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                  <div>
                    <p className="font-medium">{contribution.chama}</p>
                    <p className="text-sm text-muted-foreground">{contribution.date}</p>
                  </div>
                  <div className="text-right">
                    <CurrencyDisplay amount={contribution.amount} showToggle={false} className="font-medium" />
                    <Badge variant={contribution.status === 'due' ? 'destructive' : 'secondary'} className="ml-2">
                      {contribution.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                View All Contributions
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'contribution' ? 'bg-green-500' :
                    activity.type === 'payout' ? 'bg-blue-500' : 'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.type === 'contribution' ? 'Contribution made' :
                       activity.type === 'payout' ? 'Payout received' : 'Joined chama'}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.chama}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  {activity.amount && (
                    <CurrencyDisplay amount={activity.amount} showToggle={false} className="text-sm font-medium" />
                  )}
                </div>
              ))}
              <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Call to Action */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white relative overflow-hidden">
          <CardContent className="p-12 text-center relative z-10">
            <div className="flex justify-center mb-6">
              <Award className="h-16 w-16 text-yellow-300" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Financial Future?</h2>
            <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
              Join thousands of Kenyans who are building wealth through community savings, smart investments, and innovative financial tools. 
              Start your journey today and achieve your financial goals faster than ever before.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4">
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4">
                Explore Features
              </Button>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
        </Card>
=======
// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
>>>>>>> 3cb844b4da99a468447495c39155af6bf62815c9
      </div>
    </div>
  );
};

export default Index;
