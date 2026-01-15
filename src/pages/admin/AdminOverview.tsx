import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Video,
  Eye,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from '@/components/ui/separator'

// Dummy data based on the project documentation
const overviewStats = [
  {
    title: "Total Users",
    value: "1,247",
    change: "+12.5%",
    icon: Users,
    description: "Registered platform users",
    color: "bg-blue-500",
  },
  {
    title: "Advertisers",
    value: "342",
    change: "+8.2%",
    icon: Shield,
    description: "Business accounts",
    color: "bg-purple-500",
  },
  {
    title: "Total Videos",
    value: "2,156",
    change: "+15.3%",
    icon: Video,
    description: "Promotional content",
    color: "bg-green-500",
  },
  {
    title: "Total Views",
    value: "45,892",
    change: "+22.7%",
    icon: Eye,
    description: "Video engagements",
    color: "bg-amber-500",
  },
  {
    title: "Total Orders",
    value: "892",
    change: "+18.4%",
    icon: ShoppingCart,
    description: "Completed transactions",
    color: "bg-indigo-500",
  },
  {
    title: "Points Distributed",
    value: "224,560",
    change: "+25.1%",
    icon: TrendingUp,
    description: "Gamification rewards",
    color: "bg-pink-500",
  },
]

const recentActivities = [
  {
    id: 1,
    user: "abebe123",
    action: "Earned 5 points",
    target: "Video: 'Injera Catering Service'",
    time: "2 minutes ago",
    type: "points",
  },
  {
    id: 2,
    user: "ethio_crafts",
    action: "Uploaded new video",
    target: "Ad: 'Handmade Coffee Sets'",
    time: "15 minutes ago",
    type: "upload",
  },
  {
    id: 3,
    user: "meseret_shop",
    action: "Received new order",
    target: "Order #ETH-8923",
    time: "30 minutes ago",
    type: "order",
  },
  {
    id: 4,
    user: "naol528",
    action: "Verified email",
    target: "Account verification",
    time: "1 hour ago",
    type: "verification",
  },
  {
    id: 5,
    user: "addis_fashion",
    action: "Added product variants",
    target: "Video: 'Traditional Dresses'",
    time: "2 hours ago",
    type: "update",
  },
]

const pendingVideos = [
  {
    id: "VID-001",
    title: "Ethiopian Coffee Ceremony",
    advertiser: "coffee_tradition",
    duration: "0:45",
    uploaded: "2024-01-15",
    status: "pending",
    category: "Food & Beverage",
  },
  {
    id: "VID-002",
    title: "Handwoven Gabi Making",
    advertiser: "ethio_weavers",
    duration: "1:20",
    uploaded: "2024-01-14",
    status: "pending",
    category: "Arts & Crafts",
  },
  {
    id: "VID-003",
    title: "Modern Ethiopian Restaurant",
    advertiser: "addis_eats",
    duration: "0:58",
    uploaded: "2024-01-14",
    status: "review",
    category: "Food & Beverage",
  },
]

const platformMetrics = [
  { label: "User Engagement Rate", value: "68%", target: "75%" },
  { label: "Ad Completion Rate", value: "42%", target: "50%" },
  { label: "Order Conversion Rate", value: "3.8%", target: "5%" },
  { label: "Advertiser Retention", value: "89%", target: "85%" },
]

const topAdvertisers = [
  { rank: 1, name: "peragoo", videos: 45, views: "12,456", orders: 234, spent: "₦12,450" },
  { rank: 2, name: "ethio_crafts", videos: 38, views: "10,234", orders: 189, spent: "₦9,870" },
  { rank: 3, name: "addis_fashion", videos: 32, views: "9,123", orders: 156, spent: "₦8,450" },
  { rank: 4, name: "coffee_tradition", videos: 28, views: "8,456", orders: 134, spent: "₦7,890" },
  { rank: 5, name: "meseret_shop", videos: 25, views: "7,234", orders: 112, spent: "₦6,540" },
]

export default function AdminOverview() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor platform performance and manage operations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Last 7 days
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {overviewStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Platform Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {platformMetrics.map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{metric.value}</span>
                      <span className="text-xs text-muted-foreground">
                        Target: {metric.target}
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={parseInt(metric.value)}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Advertisers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Performing Advertisers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Advertiser</TableHead>
                    <TableHead>Videos</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topAdvertisers.map((advertiser) => (
                    <TableRow key={advertiser.rank}>
                      <TableCell>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-xs font-bold">{advertiser.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{advertiser.name}</TableCell>
                      <TableCell>{advertiser.videos}</TableCell>
                      <TableCell>{advertiser.views}</TableCell>
                      <TableCell>{advertiser.orders}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {advertiser.spent}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {activity.type === 'points' && (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      )}
                      {activity.type === 'upload' && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                      {activity.type === 'order' && (
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                      )}
                      {activity.type === 'verification' && (
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{activity.user}</span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.target}</p>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Videos for Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Videos Pending Review
                <Badge variant="destructive" className="ml-2">
                  {pendingVideos.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingVideos.map((video) => (
                <div key={video.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{video.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {video.advertiser} • {video.category}
                      </p>
                    </div>
                    <Badge
                      variant={video.status === 'pending' ? 'outline' : 'secondary'}
                      className="text-xs"
                    >
                      {video.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Duration: {video.duration}</span>
                    <span>Uploaded: {video.uploaded}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Preview
                    </Button>
                    <Button size="sm" variant="default" className="flex-1">
                      Approve
                    </Button>
                  </div>
                  <Separator />
                </div>
              ))}
              <Button variant="ghost" className="w-full">
                View All Pending Videos
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                User Management
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Content Moderation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Financial Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                System Health
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-medium">API</span>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-medium">Database</span>
              <span className="text-sm text-green-600">Healthy</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-medium">Video Storage</span>
              <span className="text-sm text-green-600">Normal</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <span className="font-medium">Payment Gateway</span>
              <span className="text-sm text-amber-600">Maintenance</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}