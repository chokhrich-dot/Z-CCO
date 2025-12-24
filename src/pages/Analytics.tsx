import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Activity, Users, 
  Filter, Search, RefreshCw, ArrowUp, ArrowDown,
  Shield, Lock, Unlock, Clock
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useBlockchainEvents } from '@/hooks/useBlockchainEvents';

// Mock data for credit score trends
const creditScoreTrends = [
  { month: 'Jan', excellent: 45, good: 120, fair: 80, poor: 30 },
  { month: 'Feb', excellent: 52, good: 135, fair: 75, poor: 28 },
  { month: 'Mar', excellent: 60, good: 140, fair: 70, poor: 25 },
  { month: 'Apr', excellent: 68, good: 155, fair: 65, poor: 22 },
  { month: 'May', excellent: 75, good: 160, fair: 60, poor: 20 },
  { month: 'Jun', excellent: 82, good: 170, fair: 55, poor: 18 },
];

// Mock transaction timeline data
const transactionTimeline = [
  { time: '00:00', submissions: 12, computations: 8, decryptions: 5 },
  { time: '04:00', submissions: 8, computations: 6, decryptions: 3 },
  { time: '08:00', submissions: 25, computations: 18, decryptions: 12 },
  { time: '12:00', submissions: 42, computations: 35, decryptions: 22 },
  { time: '16:00', submissions: 38, computations: 30, decryptions: 18 },
  { time: '20:00', submissions: 28, computations: 22, decryptions: 15 },
];

// Mock prediction data
const predictedTrends = [
  { month: 'Jul', actual: null, predicted: 88 },
  { month: 'Aug', actual: null, predicted: 95 },
  { month: 'Sep', actual: null, predicted: 102 },
  { month: 'Oct', actual: null, predicted: 108 },
];

// Tier distribution data
const tierDistribution = [
  { name: 'Excellent', value: 82, color: 'hsl(142, 76%, 36%)' },
  { name: 'Good', value: 170, color: 'hsl(47, 93%, 51%)' },
  { name: 'Fair', value: 55, color: 'hsl(38, 92%, 50%)' },
  { name: 'Poor', value: 18, color: 'hsl(0, 72%, 51%)' },
];

// Stats data
const statsData = [
  { label: 'Total Users', value: '1,247', change: '+12.5%', trend: 'up', icon: Users },
  { label: 'Credit Scores Computed', value: '3,892', change: '+8.3%', trend: 'up', icon: Shield },
  { label: 'Avg. Credit Score', value: '724', change: '+2.1%', trend: 'up', icon: TrendingUp },
  { label: 'Decryption Requests', value: '892', change: '-3.2%', trend: 'down', icon: Unlock },
];

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');
  const [realTimeData, setRealTimeData] = useState(transactionTimeline);

  // Use blockchain events for real-time updates
  useBlockchainEvents({
    onProfileSubmitted: (borrower) => {
      console.log('New profile submitted:', borrower);
      // Update real-time data
      setRealTimeData(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          submissions: updated[lastIndex].submissions + 1
        };
        return updated;
      });
    },
    onCreditScoreComputed: (borrower, tier) => {
      console.log('Score computed:', borrower, tier);
    },
    onDecryptionRequested: (borrower, lender) => {
      console.log('Decryption requested:', borrower, lender);
    }
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        updated[randomIndex] = {
          ...updated[randomIndex],
          submissions: updated[randomIndex].submissions + Math.floor(Math.random() * 3),
          computations: updated[randomIndex].computations + Math.floor(Math.random() * 2),
        };
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="text-foreground font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background relative">
      <MatrixBackground />
      <Header />

      <main className="relative z-10 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Real-time insights into credit scores and platform activity
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-border">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {statsData.map((stat, index) => (
              <Card key={stat.label} className="bg-card border-border card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <div className={`flex items-center gap-1 mt-1 text-sm ${
                        stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by address or transaction..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterTier} onValueChange={setFilterTier}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Credit Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Credit Score Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Credit Score Trends
                  </CardTitle>
                  <CardDescription>
                    Distribution of credit tiers over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={creditScoreTrends}>
                        <defs>
                          <linearGradient id="colorExcellent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorGood" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(47, 93%, 51%)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(47, 93%, 51%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(196, 27%, 32%)" />
                        <XAxis dataKey="month" stroke="hsl(210, 10%, 60%)" />
                        <YAxis stroke="hsl(210, 10%, 60%)" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="excellent" 
                          stackId="1"
                          stroke="hsl(142, 76%, 36%)" 
                          fill="url(#colorExcellent)" 
                          name="Excellent"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="good" 
                          stackId="1"
                          stroke="hsl(47, 93%, 51%)" 
                          fill="url(#colorGood)" 
                          name="Good"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Transaction Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Activity className="w-5 h-5 text-primary" />
                    Transaction Activity
                    <Badge variant="outline" className="ml-2 text-xs animate-pulse">
                      Live
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Real-time transaction volume by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={realTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(196, 27%, 32%)" />
                        <XAxis dataKey="time" stroke="hsl(210, 10%, 60%)" />
                        <YAxis stroke="hsl(210, 10%, 60%)" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="submissions" 
                          fill="hsl(47, 93%, 51%)" 
                          name="Submissions"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="computations" 
                          fill="hsl(196, 70%, 50%)" 
                          name="Computations"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="decryptions" 
                          fill="hsl(142, 76%, 36%)" 
                          name="Decryptions"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Predicted Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Predicted Trends
                  </CardTitle>
                  <CardDescription>
                    AI-predicted credit score improvements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[...creditScoreTrends.slice(-3).map(d => ({
                        month: d.month,
                        actual: d.excellent,
                        predicted: null
                      })), ...predictedTrends]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(196, 27%, 32%)" />
                        <XAxis dataKey="month" stroke="hsl(210, 10%, 60%)" />
                        <YAxis stroke="hsl(210, 10%, 60%)" />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="hsl(47, 93%, 51%)" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(47, 93%, 51%)', strokeWidth: 2 }}
                          name="Actual"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="hsl(142, 76%, 36%)" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2 }}
                          name="Predicted"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tier Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Shield className="w-5 h-5 text-primary" />
                    Credit Tier Distribution
                  </CardTitle>
                  <CardDescription>
                    Current distribution of user credit tiers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tierDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {tierDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity Feed
                </CardTitle>
                <CardDescription>
                  Latest blockchain events in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'submit', address: '0x742d...1a1f8', time: '2 min ago', icon: Lock },
                    { type: 'compute', address: '0x8ba1...DBA72', time: '5 min ago', icon: Shield },
                    { type: 'decrypt', address: '0x1CBd...c9Ec', time: '8 min ago', icon: Unlock },
                    { type: 'submit', address: '0x3f4a...9e2c', time: '12 min ago', icon: Lock },
                    { type: 'compute', address: '0x5c2b...8a1d', time: '15 min ago', icon: Shield },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <activity.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {activity.type === 'submit' && 'Profile Submitted'}
                            {activity.type === 'compute' && 'Score Computed'}
                            {activity.type === 'decrypt' && 'Decryption Requested'}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {activity.address}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
