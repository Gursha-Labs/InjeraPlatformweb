import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart3,
  Calendar,
  Download,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

// Dummy data for traffic analytics
const dailyTraffic = [
  { hour: '00:00', visitors: 120, pageviews: 450, engagement: 68 },
  { hour: '02:00', visitors: 80, pageviews: 320, engagement: 45 },
  { hour: '04:00', visitors: 65, pageviews: 280, engagement: 38 },
  { hour: '06:00', visitors: 150, pageviews: 520, engagement: 72 },
  { hour: '08:00', visitors: 320, pageviews: 890, engagement: 85 },
  { hour: '10:00', visitors: 450, pageviews: 1250, engagement: 92 },
  { hour: '12:00', visitors: 520, pageviews: 1450, engagement: 88 },
  { hour: '14:00', visitors: 480, pageviews: 1380, engagement: 84 },
  { hour: '16:00', visitors: 420, pageviews: 1150, engagement: 79 },
  { hour: '18:00', visitors: 380, pageviews: 980, engagement: 82 },
  { hour: '20:00', visitors: 280, pageviews: 750, engagement: 76 },
  { hour: '22:00', visitors: 180, pageviews: 580, engagement: 68 },
]

const weeklyTraffic = [
  { day: 'Mon', users: 2450, sessions: 3120, bounce: 32, avgDuration: '4:12' },
  { day: 'Tue', users: 2670, sessions: 3450, bounce: 28, avgDuration: '4:45' },
  { day: 'Wed', users: 2890, sessions: 3780, bounce: 26, avgDuration: '5:02' },
  { day: 'Thu', users: 3050, sessions: 4120, bounce: 24, avgDuration: '5:18' },
  { day: 'Fri', users: 3450, sessions: 4560, bounce: 22, avgDuration: '5:45' },
  { day: 'Sat', users: 3780, sessions: 4980, bounce: 25, avgDuration: '6:12' },
  { day: 'Sun', users: 4120, sessions: 5230, bounce: 27, avgDuration: '6:45' },
]

const monthlyTraffic = [
  { month: 'Jan', users: 12500, videos: 1560, orders: 345, points: 12500 },
  { month: 'Feb', users: 13800, videos: 1780, orders: 389, points: 14500 },
  { month: 'Mar', users: 15600, videos: 1950, orders: 412, points: 16700 },
  { month: 'Apr', users: 17200, videos: 2150, orders: 456, points: 18900 },
  { month: 'May', users: 18900, videos: 2340, orders: 489, points: 21200 },
  { month: 'Jun', users: 20500, videos: 2560, orders: 523, points: 23500 },
  { month: 'Jul', users: 22300, videos: 2780, orders: 567, points: 25800 },
  { month: 'Aug', users: 24500, videos: 3050, orders: 612, points: 28500 },
]

const deviceTraffic = [
  { device: 'Mobile', value: 65, color: '#8884d8' },
  { device: 'Desktop', value: 25, color: '#82ca9d' },
  { device: 'Tablet', value: 10, color: '#ffc658' },
]

const trafficSources = [
  { source: 'Direct', visitors: 15400, percentage: 45, change: '+12.5%' },
  { source: 'Social Media', visitors: 8900, percentage: 26, change: '+18.2%' },
  { source: 'Search', visitors: 6700, percentage: 20, change: '+8.4%' },
  { source: 'Referral', visitors: 3400, percentage: 9, change: '-2.3%' },
]

const activeHours = [
  { hour: '8 AM', activeUsers: 1250, peak: true },
  { hour: '9 AM', activeUsers: 1560, peak: false },
  { hour: '10 AM', activeUsers: 1890, peak: false },
  { hour: '11 AM', activeUsers: 1780, peak: false },
  { hour: '12 PM', activeUsers: 1560, peak: false },
  { hour: '1 PM', activeUsers: 1450, peak: false },
  { hour: '2 PM', activeUsers: 1670, peak: false },
  { hour: '3 PM', activeUsers: 1890, peak: false },
  { hour: '4 PM', activeUsers: 2010, peak: false },
  { hour: '5 PM', activeUsers: 1950, peak: false },
  { hour: '6 PM', activeUsers: 1780, peak: false },
  { hour: '7 PM', activeUsers: 1560, peak: false },
  { hour: '8 PM', activeUsers: 1340, peak: false },
  { hour: '9 PM', activeUsers: 1120, peak: false },
  { hour: '10 PM', activeUsers: 890, peak: false },
]

const topPages = [
  { page: 'Video Feed', views: 45620, avgTime: '5:45', bounce: '18%' },
  { page: 'User Profile', views: 23450, avgTime: '3:20', bounce: '24%' },
  { page: 'Order Page', views: 17890, avgTime: '2:45', bounce: '32%' },
  { page: 'Gamification', views: 15670, avgTime: '4:15', bounce: '22%' },
  { page: 'Advertiser Dashboard', views: 13450, avgTime: '8:30', bounce: '12%' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Traffic() {
  const [timeRange, setTimeRange] = React.useState('weekly')
  const [activeTab, setActiveTab] = React.useState('overview')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Traffic Analytics</h1>
            <p className="text-muted-foreground">
              Monitor platform traffic, user behavior, and engagement metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Last 24 Hours</SelectItem>
                <SelectItem value="weekly">Last 7 Days</SelectItem>
                <SelectItem value="monthly">Last 30 Days</SelectItem>
                <SelectItem value="quarterly">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,450</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12.5%</span> from yesterday
              </p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Real-time active sessions
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5K</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+8.2%</span> from yesterday
              </p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Total views in last 24h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5:24</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+2.1%</span> from yesterday
              </p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Average session duration
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">-3.2%</span> from yesterday
              </p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Percentage of quick exits
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Traffic Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>
                    {timeRange === 'daily' ? 'Hourly traffic for last 24 hours' :
                      timeRange === 'weekly' ? 'Weekly traffic trends' :
                        'Monthly traffic growth'}
                  </CardDescription>
                </div>
                <Tabs defaultValue="users" className="w-[300px]">
                  <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeRange === 'daily' ? dailyTraffic :
                      timeRange === 'weekly' ? weeklyTraffic : monthlyTraffic}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey={timeRange === 'daily' ? 'hour' :
                        timeRange === 'weekly' ? 'day' : 'month'}
                      stroke="#6b7280"
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey={timeRange === 'daily' ? 'visitors' :
                        timeRange === 'weekly' ? 'users' : 'users'}
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      name={timeRange === 'daily' ? 'Visitors' :
                        timeRange === 'weekly' ? 'Users' : 'Monthly Users'}
                    />
                    <Area
                      type="monotone"
                      dataKey={timeRange === 'daily' ? 'pageviews' :
                        timeRange === 'weekly' ? 'sessions' : 'videos'}
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                      name={timeRange === 'daily' ? 'Page Views' :
                        timeRange === 'weekly' ? 'Sessions' : 'Videos'}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Active Hours & Devices */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Active Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Active Hours</CardTitle>
                <CardDescription>User activity by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeHours}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="hour" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="activeUsers"
                        fill="#8884d8"
                        name="Active Users"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Device Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Traffic by device type</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-56 w-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceTraffic}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.device}: ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="device"
                      >
                        {deviceTraffic.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-4">
                  {deviceTraffic.map((device, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: device.color }}
                      />
                      <span className="text-sm">{device.device}</span>
                      <span className="text-sm font-semibold">{device.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{source.visitors.toLocaleString()}</span>
                      <Badge variant={source.change.startsWith('+') ? "default" : "destructive"}>
                        {source.change}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={source.percentage} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{page.page}</div>
                      <div className="text-sm text-muted-foreground">
                        {page.views.toLocaleString()} views
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{page.avgTime}</div>
                      <div className="text-sm text-muted-foreground">
                        Bounce: {page.bounce}
                      </div>
                    </div>
                  </div>
                  {index < topPages.length - 1 && (
                    <div className="border-t" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Real-time Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Statistics</CardTitle>
              <CardDescription>Live platform metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Mobile Users</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">2,245</div>
                  <div className="text-xs text-green-500">+45 in last 5m</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tablet className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Tablet Users</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">345</div>
                  <div className="text-xs text-green-500">+12 in last 5m</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Desktop Users</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">860</div>
                  <div className="text-xs text-green-500">+23 in last 5m</div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Active</span>
                  <div className="text-right">
                    <div className="font-bold text-xl">3,450</div>
                    <div className="text-xs text-green-500">+80 in last 5m</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daily/Weekly/Monthly Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">
            <Calendar className="h-4 w-4 mr-2" />
            Daily Traffic
          </TabsTrigger>
          <TabsTrigger value="weekly">
            <BarChart3 className="h-4 w-4 mr-2" />
            Weekly Trends
          </TabsTrigger>
          <TabsTrigger value="monthly">
            <TrendingUp className="h-4 w-4 mr-2" />
            Monthly Growth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Traffic Breakdown</CardTitle>
              <CardDescription>Hour-by-hour analysis of yesterday's traffic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Visitors"
                    />
                    <Line
                      type="monotone"
                      dataKey="pageviews"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Page Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Week-over-week comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="users"
                      fill="#8884d8"
                      name="Users"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="sessions"
                      fill="#82ca9d"
                      name="Sessions"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth Metrics</CardTitle>
              <CardDescription>Platform growth over the last 8 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="videos"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Videos"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#ff7300"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}