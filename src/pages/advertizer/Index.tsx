import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp, TrendingDown, Eye, Users, DollarSign,
    ShoppingBag, BarChart2, Clock, Calendar, Target,
    Activity, Package, MessageCircle, Share2, Download,
    Filter, MoreVertical, ArrowUpRight, ArrowDownRight,
    Play, Pause, Bell, Settings, RefreshCw, Zap,
    Award, Star, TrendingUp as TrendingUpIcon, Target as TargetIcon,
    Globe, Smartphone, Laptop, ChartBar
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Dummy data
const overviewStats = {
    totalImpressions: 1254300,
    totalClicks: 45210,
    clickThroughRate: 3.6,
    totalConversions: 2150,
    conversionRate: 4.8,
    totalRevenue: 45250.75,
    averageOrderValue: 210.47,
    totalSpend: 18250.25,
    returnOnAdSpend: 2.48,
    activeCampaigns: 8,
    audienceReach: 125000,
    engagementRate: 2.4,
}

const campaigns = [
    {
        id: 1,
        name: 'Summer Sale 2024',
        status: 'active',
        budget: 5000,
        spent: 3250.75,
        impressions: 450230,
        clicks: 16235,
        conversions: 812,
        ctr: 3.6,
        roas: 2.8,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        dailyBudget: 50,
        platform: 'facebook',
    },
    {
        id: 2,
        name: 'Product Launch - Pro Series',
        status: 'active',
        budget: 3000,
        spent: 1875.50,
        impressions: 285120,
        clicks: 11405,
        conversions: 570,
        ctr: 4.0,
        roas: 2.5,
        startDate: '2024-07-15',
        endDate: '2024-09-15',
        dailyBudget: 30,
        platform: 'instagram',
    },
    {
        id: 3,
        name: 'Back to School Campaign',
        status: 'paused',
        budget: 2500,
        spent: 1250.00,
        impressions: 198750,
        clicks: 7950,
        conversions: 398,
        ctr: 4.0,
        roas: 2.2,
        startDate: '2024-08-01',
        endDate: '2024-09-30',
        dailyBudget: 25,
        platform: 'google',
    },
    {
        id: 4,
        name: 'Black Friday Prep',
        status: 'draft',
        budget: 10000,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        roas: 0,
        startDate: '2024-10-15',
        endDate: '2024-11-30',
        dailyBudget: 100,
        platform: 'multi',
    },
]

const performanceMetrics = [
    { label: 'Impressions', value: overviewStats.totalImpressions.toLocaleString(), change: '+12.5%', trend: 'up', icon: Eye, color: 'text-blue-500' },
    { label: 'Clicks', value: overviewStats.totalClicks.toLocaleString(), change: '+8.3%', trend: 'up', icon: Activity, color: 'text-green-500' },
    { label: 'Conversions', value: overviewStats.totalConversions.toLocaleString(), change: '+15.2%', trend: 'up', icon: ShoppingBag, color: 'text-purple-500' },
    { label: 'Revenue', value: `$${overviewStats.totalRevenue.toLocaleString()}`, change: '+18.9%', trend: 'up', icon: DollarSign, color: 'text-amber-500' },
]

const audienceData = [
    { age: '18-24', percentage: 35, color: 'bg-primary' },
    { age: '25-34', percentage: 45, color: 'bg-blue-500' },
    { age: '35-44', percentage: 15, color: 'bg-green-500' },
    { age: '45+', percentage: 5, color: 'bg-purple-500' },
]

const deviceData = [
    { device: 'Mobile', percentage: 65, icon: Smartphone },
    { device: 'Desktop', percentage: 30, icon: Laptop },
    { device: 'Tablet', percentage: 5, icon: Globe },
]

const recentActivities = [
    { id: 1, type: 'campaign', action: 'Campaign "Summer Sale 2024" budget increased', time: '2 hours ago', user: 'You' },
    { id: 2, type: 'ad', action: 'New ad creative uploaded', time: '4 hours ago', user: 'Team Member' },
    { id: 3, type: 'performance', action: 'CTR improved by 15% on Google Ads', time: '1 day ago', user: 'System' },
    { id: 4, type: 'campaign', action: 'Campaign "Product Launch" went live', time: '2 days ago', user: 'You' },
    { id: 5, type: 'analytics', action: 'Monthly report generated', time: '3 days ago', user: 'System' },
]

const topPerformingAds = [
    { id: 1, name: 'Summer Sale Video Ad', views: 125000, engagement: 8.5, ctr: 4.2, conversions: 125, status: 'active' },
    { id: 2, name: 'Product Demo Carousel', views: 98500, engagement: 7.8, ctr: 3.9, conversions: 98, status: 'active' },
    { id: 3, name: 'Limited Time Offer', views: 75200, engagement: 9.2, ctr: 5.1, conversions: 153, status: 'paused' },
    { id: 4, name: 'Brand Awareness Story', views: 210500, engagement: 6.5, ctr: 2.8, conversions: 45, status: 'active' },
]

export default function Index() {
    const [timeRange, setTimeRange] = useState('30d')
    const [activeTab, setActiveTab] = useState('overview')
    const [autoRefresh, setAutoRefresh] = useState(false)

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount)
    }

    // Format number with K/M
    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    // Calculate campaign progress
    const calculateCampaignProgress = (spent: number, budget: number) => {
        return (spent / budget) * 100
    }

    // Get platform icon
    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'facebook':
                return 'Fb'
            case 'instagram':
                return 'Ig'
            case 'google':
                return 'Go'
            case 'multi':
                return 'All'
            default:
                return 'Ad'
        }
    }

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500">Active</Badge>
            case 'paused':
                return <Badge variant="outline" className="text-amber-600 border-amber-600">Paused</Badge>
            case 'draft':
                return <Badge variant="outline">Draft</Badge>
            default:
                return null
        }
    }

    // Auto-refresh effect
    useEffect(() => {
        if (!autoRefresh) return

        const interval = setInterval(() => {
            // In a real app, this would refetch data
            console.log('Refreshing data...')
        }, 30000) // Refresh every 30 seconds

        return () => clearInterval(interval)
    }, [autoRefresh])

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Advertiser Overview</h1>
                                <p className="text-muted-foreground">
                                    Welcome back! Here's what's happening with your campaigns.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={autoRefresh}
                                        onCheckedChange={setAutoRefresh}
                                    />
                                    <span className="text-sm">Auto-refresh</span>
                                </div>
                                <Select value={timeRange} onValueChange={setTimeRange}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7d">Last 7 days</SelectItem>
                                        <SelectItem value="30d">Last 30 days</SelectItem>
                                        <SelectItem value="90d">Last 90 days</SelectItem>
                                        <SelectItem value="ytd">Year to date</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon">
                                    <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Welcome Card */}
                        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-semibold">Good morning, Advertiser!</h2>
                                        <p className="text-muted-foreground">
                                            Your campaigns are performing {overviewStats.roas > 2 ? 'exceptionally' : 'well'} today.
                                            {overviewStats.roas > 2 && ' Keep up the great work!'}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="outline" className="gap-1">
                                                <Target className="w-3 h-3" />
                                                {overviewStats.activeCampaigns} Active Campaigns
                                            </Badge>
                                            <Badge variant="outline" className="gap-1">
                                                <TrendingUpIcon className="w-3 h-3" />
                                                ROAS: {overviewStats.returnOnAdSpend}x
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button className="gap-2">
                                            <Zap className="w-4 h-4" />
                                            Optimize Campaigns
                                        </Button>
                                        <Button variant="outline" className="gap-2">
                                            <Play className="w-4 h-4" />
                                            Create New
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {performanceMetrics.map((metric, index) => {
                            const Icon = metric.icon
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 rounded-lg bg-muted">
                                                    <Icon className={`w-5 h-5 ${metric.color}`} />
                                                </div>
                                                <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'} className="gap-1">
                                                    {metric.trend === 'up' ? (
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    ) : (
                                                        <ArrowDownRight className="w-3 h-3" />
                                                    )}
                                                    {metric.change}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-bold">{metric.value}</h3>
                                                <p className="text-sm text-muted-foreground">{metric.label}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Campaigns & Analytics */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Campaigns List */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Campaigns</CardTitle>
                                            <CardDescription>
                                                Active and upcoming advertising campaigns
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Play className="w-4 h-4" />
                                            New Campaign
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {campaigns.map((campaign) => (
                                            <div key={campaign.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg">
                                                            <TargetIcon className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold">{campaign.name}</h4>
                                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                    {' - '}
                                                                    {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                </span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {getPlatformIcon(campaign.platform)}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(campaign.status)}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>
                                                                    {campaign.status === 'active' ? 'Pause' : 'Resume'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-600">
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="space-y-2 mb-3">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Budget Progress</span>
                                                        <span className="font-medium">
                                                            {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={calculateCampaignProgress(campaign.spent, campaign.budget)}
                                                        className="h-2"
                                                    />
                                                </div>

                                                {/* Campaign Metrics */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">Impressions</p>
                                                        <p className="font-medium">{formatNumber(campaign.impressions)}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">CTR</p>
                                                        <p className="font-medium">{campaign.ctr}%</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">Conversions</p>
                                                        <p className="font-medium">{campaign.conversions}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">ROAS</p>
                                                        <p className="font-medium">{campaign.roas}x</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">
                                        View All Campaigns
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Analytics Charts Placeholder */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performance Analytics</CardTitle>
                                    <CardDescription>
                                        Key metrics over the selected time period
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                                            <p className="text-muted-foreground">Performance charts will appear here</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Showing data for {timeRange === '7d' ? 'last 7 days' :
                                                    timeRange === '30d' ? 'last 30 days' :
                                                        timeRange === '90d' ? 'last 90 days' : 'year to date'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Insights & Quick Actions */}
                        <div className="space-y-6">
                            {/* Audience Insights */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Audience Insights</CardTitle>
                                    <CardDescription>
                                        Your audience demographics
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <h4 className="font-medium">Age Distribution</h4>
                                        {audienceData.map((item, index) => (
                                            <div key={index} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">{item.age}</span>
                                                    <span className="text-sm font-medium">{item.percentage}%</span>
                                                </div>
                                                <Progress value={item.percentage} className="h-2" />
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-medium">Device Usage</h4>
                                        {deviceData.map((item, index) => {
                                            const Icon = item.icon
                                            return (
                                                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4" />
                                                        <span className="text-sm">{item.device}</span>
                                                    </div>
                                                    <span className="font-medium">{item.percentage}%</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Performing Ads */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Performing Ads</CardTitle>
                                    <CardDescription>
                                        Best performing creatives this month
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {topPerformingAds.map((ad) => (
                                        <div key={ad.id} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm">{ad.name}</h4>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>{formatNumber(ad.views)} views</span>
                                                    <span>{ad.ctr}% CTR</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className="mb-1">{ad.conversions} sales</Badge>
                                                <div className="flex items-center gap-1 text-xs">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "w-3 h-3",
                                                                i < Math.floor(ad.engagement / 2)
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : "text-muted-foreground"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>
                                        Latest actions in your account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3">
                                            <div className="mt-1">
                                                {activity.type === 'campaign' && (
                                                    <div className="p-1.5 bg-primary/10 rounded">
                                                        <TargetIcon className="w-3 h-3 text-primary" />
                                                    </div>
                                                )}
                                                {activity.type === 'ad' && (
                                                    <div className="p-1.5 bg-blue-500/10 rounded">
                                                        <Play className="w-3 h-3 text-blue-500" />
                                                    </div>
                                                )}
                                                {activity.type === 'performance' && (
                                                    <div className="p-1.5 bg-green-500/10 rounded">
                                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                                    </div>
                                                )}
                                                {activity.type === 'analytics' && (
                                                    <div className="p-1.5 bg-purple-500/10 rounded">
                                                        <BarChart2 className="w-3 h-3 text-purple-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm">{activity.action}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {activity.time}
                                                    <span className="text-primary">•</span>
                                                    {activity.user}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Eye className="w-4 h-4" />
                                        View Analytics Dashboard
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        Check Campaign Reviews
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Download className="w-4 h-4" />
                                        Download Reports
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Bell className="w-4 h-4" />
                                        Set Up Alerts
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* ROI Card */}
                        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                    </div>
                                    <Badge className="bg-green-500">
                                        +{((overviewStats.returnOnAdSpend - 1) * 100).toFixed(1)}%
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{overviewStats.returnOnAdSpend}x</h3>
                                    <p className="text-sm text-muted-foreground">Return on Ad Spend</p>
                                    <p className="text-xs text-muted-foreground">
                                        Every $1 spent generates ${overviewStats.returnOnAdSpend.toFixed(2)} in revenue
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Engagement Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Users className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <Badge variant="outline">{overviewStats.engagementRate}%</Badge>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{formatNumber(overviewStats.audienceReach)}</h3>
                                    <p className="text-sm text-muted-foreground">Audience Reach</p>
                                    <p className="text-xs text-muted-foreground">
                                        Engaged with {overviewStats.engagementRate}% of your audience
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Efficiency Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Award className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <Badge variant="outline" className="text-purple-600">
                                        Efficient
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">${overviewStats.averageOrderValue.toFixed(2)}</h3>
                                    <p className="text-sm text-muted-foreground">Average Order Value</p>
                                    <p className="text-xs text-muted-foreground">
                                        ${(overviewStats.totalSpend / overviewStats.totalConversions).toFixed(2)} cost per conversion
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tips & Recommendations */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Recommendations</CardTitle>
                            <CardDescription>
                                Tips to improve your campaign performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-3 p-4 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <TargetIcon className="w-5 h-5 text-primary" />
                                        <h4 className="font-semibold">Optimize Targeting</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Refine your audience targeting based on recent performance data
                                    </p>
                                    <Button size="sm" variant="outline" className="w-full">
                                        Apply Now
                                    </Button>
                                </div>

                                <div className="space-y-3 p-4 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <h4 className="font-semibold">Schedule Posts</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Post during peak engagement hours (2 PM - 4 PM EST)
                                    </p>
                                    <Button size="sm" variant="outline" className="w-full">
                                        Set Schedule
                                    </Button>
                                </div>

                                <div className="space-y-3 p-4 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-green-500" />
                                        <h4 className="font-semibold">Increase Budget</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Top performing campaigns have room for 25% budget increase
                                    </p>
                                    <Button size="sm" variant="outline" className="w-full">
                                        Adjust Budget
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}