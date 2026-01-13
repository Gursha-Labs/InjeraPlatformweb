import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Package, Truck, CheckCircle, Clock, AlertCircle,
    XCircle, Filter, Search, MoreVertical, Download,
    Eye, MessageCircle, DollarSign, Calendar, MapPin,
    User, Phone, Mail, ShoppingBag, BarChart2,
    ChevronRight, ChevronLeft, RefreshCw, Printer,
    Share2, Archive, Tag, Award, Star, TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Static data
const orderStats = {
    totalOrders: 156,
    pending: 12,
    processing: 8,
    delivered: 124,
    cancelled: 12,
    totalRevenue: 45250.75,
    avgOrderValue: 290.07,
    conversionRate: 3.2,
    thisMonthOrders: 42,
    thisMonthRevenue: 12850.25,
}

const orders = [
    {
        id: 'ORD-2024-001',
        customer: {
            name: 'John Smith',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            avatar: '',
        },
        date: '2024-01-15',
        items: 3,
        total: 450.99,
        status: 'delivered',
        paymentStatus: 'paid',
        shipping: {
            method: 'Express',
            tracking: '1Z999AA1234567890',
            estimated: '2024-01-18',
            delivered: '2024-01-17',
        },
        products: [
            { name: 'Wireless Earbuds Pro', quantity: 1, price: 199.99 },
            { name: 'Phone Case', quantity: 2, price: 125.50 },
        ],
        location: 'New York, NY',
        notes: 'Gift wrapping requested',
    },
    {
        id: 'ORD-2024-002',
        customer: {
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 (555) 987-6543',
            avatar: '',
        },
        date: '2024-01-14',
        items: 1,
        total: 129.99,
        status: 'processing',
        paymentStatus: 'paid',
        shipping: {
            method: 'Standard',
            tracking: '1Z999BB1234567890',
            estimated: '2024-01-21',
        },
        products: [
            { name: 'Smart Watch', quantity: 1, price: 129.99 },
        ],
        location: 'Los Angeles, CA',
        notes: 'Customer requested early delivery',
    },
    {
        id: 'ORD-2024-003',
        customer: {
            name: 'Mike Chen',
            email: 'mike@example.com',
            phone: '+1 (555) 456-7890',
            avatar: '',
        },
        date: '2024-01-14',
        items: 2,
        total: 75.50,
        status: 'pending',
        paymentStatus: 'pending',
        shipping: {
            method: 'Standard',
            tracking: '',
            estimated: '2024-01-22',
        },
        products: [
            { name: 'USB-C Cable', quantity: 2, price: 25.25 },
            { name: 'Screen Protector', quantity: 1, price: 25.00 },
        ],
        location: 'Chicago, IL',
    },
    {
        id: 'ORD-2024-004',
        customer: {
            name: 'Emma Davis',
            email: 'emma@example.com',
            phone: '+1 (555) 321-0987',
            avatar: '',
        },
        date: '2024-01-13',
        items: 5,
        total: 625.00,
        status: 'delivered',
        paymentStatus: 'paid',
        shipping: {
            method: 'Express',
            tracking: '1Z999CC1234567890',
            estimated: '2024-01-16',
            delivered: '2024-01-15',
        },
        products: [
            { name: 'Laptop Stand', quantity: 1, price: 89.99 },
            { name: 'Wireless Mouse', quantity: 2, price: 120.00 },
            { name: 'Keyboard', quantity: 1, price: 79.99 },
            { name: 'Webcam', quantity: 1, price: 135.02 },
        ],
        location: 'Miami, FL',
        notes: 'Business purchase',
    },
    {
        id: 'ORD-2024-005',
        customer: {
            name: 'Robert Wilson',
            email: 'robert@example.com',
            phone: '+1 (555) 654-3210',
            avatar: '',
        },
        date: '2024-01-12',
        items: 1,
        total: 299.99,
        status: 'cancelled',
        paymentStatus: 'refunded',
        shipping: {
            method: 'Express',
            tracking: '',
            estimated: '2024-01-15',
        },
        products: [
            { name: 'Tablet', quantity: 1, price: 299.99 },
        ],
        location: 'Seattle, WA',
        notes: 'Customer changed mind',
    },
    {
        id: 'ORD-2024-006',
        customer: {
            name: 'Lisa Wong',
            email: 'lisa@example.com',
            phone: '+1 (555) 789-0123',
            avatar: '',
        },
        date: '2024-01-11',
        items: 2,
        total: 150.00,
        status: 'processing',
        paymentStatus: 'paid',
        shipping: {
            method: 'Standard',
            tracking: '1Z999DD1234567890',
            estimated: '2024-01-18',
        },
        products: [
            { name: 'Power Bank', quantity: 1, price: 79.99 },
            { name: 'Charging Dock', quantity: 1, price: 70.01 },
        ],
        location: 'Austin, TX',
    },
    {
        id: 'ORD-2024-007',
        customer: {
            name: 'David Miller',
            email: 'david@example.com',
            phone: '+1 (555) 234-5678',
            avatar: '',
        },
        date: '2024-01-10',
        items: 1,
        total: 899.99,
        status: 'delivered',
        paymentStatus: 'paid',
        shipping: {
            method: 'Express',
            tracking: '1Z999EE1234567890',
            estimated: '2024-01-13',
            delivered: '2024-01-12',
        },
        products: [
            { name: 'Gaming Console', quantity: 1, price: 899.99 },
        ],
        location: 'Denver, CO',
        notes: 'Signature required',
    },
    {
        id: 'ORD-2024-008',
        customer: {
            name: 'Maria Garcia',
            email: 'maria@example.com',
            phone: '+1 (555) 876-5432',
            avatar: '',
        },
        date: '2024-01-09',
        items: 4,
        total: 220.50,
        status: 'pending',
        paymentStatus: 'pending',
        shipping: {
            method: 'Standard',
            tracking: '',
            estimated: '2024-01-17',
        },
        products: [
            { name: 'Headphones', quantity: 1, price: 129.99 },
            { name: 'Earbuds', quantity: 2, price: 60.00 },
            { name: 'Audio Cable', quantity: 1, price: 30.51 },
        ],
        location: 'Phoenix, AZ',
    },
]

const orderStatuses = [
    { value: 'all', label: 'All Orders', count: orderStats.totalOrders },
    { value: 'pending', label: 'Pending', count: orderStats.pending },
    { value: 'processing', label: 'Processing', count: orderStats.processing },
    { value: 'delivered', label: 'Delivered', count: orderStats.delivered },
    { value: 'cancelled', label: 'Cancelled', count: orderStats.cancelled },
]

const recentCustomers = [
    { name: 'John Smith', orders: 3, total: 1250.99, lastOrder: '2024-01-15' },
    { name: 'Emma Davis', orders: 5, total: 2450.75, lastOrder: '2024-01-13' },
    { name: 'Mike Chen', orders: 2, total: 350.50, lastOrder: '2024-01-14' },
    { name: 'Sarah Johnson', orders: 1, total: 129.99, lastOrder: '2024-01-14' },
]

export default function AdvertiserOrders() {
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [dateRange, setDateRange] = useState('30days')
    const [selectedOrders, setSelectedOrders] = useState<string[]>([])

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount)
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date)
    }

    // Format date with time
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
                return (
                    <Badge className="bg-green-500 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Delivered
                    </Badge>
                )
            case 'processing':
                return (
                    <Badge className="bg-blue-500 gap-1">
                        <Truck className="w-3 h-3" />
                        Processing
                    </Badge>
                )
            case 'pending':
                return (
                    <Badge variant="outline" className="text-amber-600 border-amber-600 gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                    </Badge>
                )
            case 'cancelled':
                return (
                    <Badge variant="outline" className="text-red-600 border-red-600 gap-1">
                        <XCircle className="w-3 h-3" />
                        Cancelled
                    </Badge>
                )
            default:
                return null
        }
    }

    // Get payment status badge
    const getPaymentBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-500">Paid</Badge>
            case 'pending':
                return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>
            case 'refunded':
                return <Badge variant="outline" className="text-purple-600 border-purple-600">Refunded</Badge>
            default:
                return null
        }
    }

    // Filter orders
    const filteredOrders = orders.filter(order => {
        if (selectedStatus !== 'all' && selectedStatus !== order.status) {
            return false
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                order.id.toLowerCase().includes(query) ||
                order.customer.name.toLowerCase().includes(query) ||
                order.customer.email.toLowerCase().includes(query) ||
                order.location.toLowerCase().includes(query)
            )
        }
        return true
    })

    // Calculate stats
    const calculateStats = () => {
        const today = new Date()
        const last7Days = new Date(today.setDate(today.getDate() - 7))
        const last30Days = new Date(today.setDate(today.getDate() - 30))

        return {
            today: orders.filter(o => new Date(o.date) >= new Date().setHours(0, 0, 0, 0)).length,
            last7Days: orders.filter(o => new Date(o.date) >= last7Days).length,
            last30Days: orders.filter(o => new Date(o.date) >= last30Days).length,
        }
    }

    const stats = calculateStats()

    // Toggle order selection
    const toggleOrderSelection = (orderId: string) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        )
    }

    // Select all orders
    const selectAllOrders = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([])
        } else {
            setSelectedOrders(filteredOrders.map(order => order.id))
        }
    }

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
                                <h1 className="text-3xl font-bold mb-2">Order Management</h1>
                                <p className="text-muted-foreground">
                                    Manage and track customer orders from your ads
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Export Orders
                                </Button>
                                <Button className="gap-2">
                                    <Package className="w-4 h-4" />
                                    Create Order
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground">Total Orders</p>
                                    <Package className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold">{orderStats.totalOrders}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    +12% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold">{formatCurrency(orderStats.totalRevenue)}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Avg: {formatCurrency(orderStats.avgOrderValue)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                    <Clock className="w-4 h-4 text-amber-500" />
                                </div>
                                <h3 className="text-2xl font-bold">{orderStats.pending}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Needs attention
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground">Processing</p>
                                    <Truck className="w-4 h-4 text-blue-500" />
                                </div>
                                <h3 className="text-2xl font-bold">{orderStats.processing}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    In progress
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground">Delivered</p>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold">{orderStats.delivered}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    89% success rate
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground">Conversion</p>
                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                </div>
                                <h3 className="text-2xl font-bold">{orderStats.conversionRate}%</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Ad to order rate
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Orders List */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Orders Tabs & Filters */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            {orderStatuses.map((status) => (
                                                <Button
                                                    key={status.value}
                                                    variant={selectedStatus === status.value ? "default" : "ghost"}
                                                    size="sm"
                                                    onClick={() => setSelectedStatus(status.value)}
                                                    className="relative"
                                                >
                                                    {status.label}
                                                    {status.count > 0 && (
                                                        <span className={cn(
                                                            "ml-2 px-1.5 py-0.5 rounded-full text-xs",
                                                            selectedStatus === status.value
                                                                ? "bg-white/20"
                                                                : "bg-muted"
                                                        )}>
                                                            {status.count}
                                                        </span>
                                                    )}
                                                </Button>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search orders..."
                                                    className="pl-9 w-full sm:w-64"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <Select value={dateRange} onValueChange={setDateRange}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="today">Today</SelectItem>
                                                    <SelectItem value="7days">Last 7 days</SelectItem>
                                                    <SelectItem value="30days">Last 30 days</SelectItem>
                                                    <SelectItem value="all">All time</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Bulk Actions */}
                                    {selectedOrders.length > 0 && (
                                        <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium">
                                                    {selectedOrders.length} order(s) selected
                                                </span>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Truck className="w-3 h-3" />
                                                    Process
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Printer className="w-3 h-3" />
                                                    Print Labels
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2 text-red-600">
                                                    <Archive className="w-3 h-3" />
                                                    Archive
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedOrders([])}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    )}

                                    {/* Orders List */}
                                    <div className="space-y-4">
                                        {filteredOrders.map((order) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <Card className="group hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between">
                                                            {/* Order Info */}
                                                            <div className="flex-1">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedOrders.includes(order.id)}
                                                                            onChange={() => toggleOrderSelection(order.id)}
                                                                            className="h-4 w-4 rounded border-gray-300"
                                                                        />
                                                                        <div className="p-2 bg-muted rounded-lg">
                                                                            <Package className="w-4 h-4" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex-1 space-y-3">
                                                                        {/* Order Header */}
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <h4 className="font-semibold">{order.id}</h4>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {formatDateTime(order.date)}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                {getStatusBadge(order.status)}
                                                                                {getPaymentBadge(order.paymentStatus)}
                                                                            </div>
                                                                        </div>

                                                                        {/* Customer & Products */}
                                                                        <div className="grid md:grid-cols-2 gap-4">
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Avatar className="h-6 w-6">
                                                                                        <AvatarFallback>
                                                                                            {order.customer.name.charAt(0)}
                                                                                        </AvatarFallback>
                                                                                    </Avatar>
                                                                                    <div>
                                                                                        <p className="text-sm font-medium">{order.customer.name}</p>
                                                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                                            <Mail className="w-3 h-3" />
                                                                                            {order.customer.email}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-2 text-sm">
                                                                                    <MapPin className="w-3 h-3" />
                                                                                    {order.location}
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-sm text-muted-foreground">Items</span>
                                                                                    <span className="font-medium">{order.items} products</span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-sm text-muted-foreground">Total</span>
                                                                                    <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Products */}
                                                                        <div className="space-y-2">
                                                                            <p className="text-sm font-medium">Products:</p>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {order.products.map((product, idx) => (
                                                                                    <Badge key={idx} variant="outline" className="gap-1">
                                                                                        {product.name}
                                                                                        <span className="text-muted-foreground">×{product.quantity}</span>
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>

                                                                        {/* Shipping & Notes */}
                                                                        <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center gap-2 text-sm">
                                                                                    <Truck className="w-3 h-3" />
                                                                                    <span>{order.shipping.method} Shipping</span>
                                                                                </div>
                                                                                {order.shipping.tracking && (
                                                                                    <div className="text-sm">
                                                                                        <span className="text-muted-foreground">Tracking: </span>
                                                                                        <code className="bg-muted px-2 py-1 rounded text-xs">
                                                                                            {order.shipping.tracking}
                                                                                        </code>
                                                                                    </div>
                                                                                )}
                                                                                <div className="text-sm">
                                                                                    <span className="text-muted-foreground">Est. Delivery: </span>
                                                                                    {formatDate(order.shipping.estimated)}
                                                                                </div>
                                                                            </div>

                                                                            {order.notes && (
                                                                                <div className="text-sm">
                                                                                    <span className="text-muted-foreground">Notes: </span>
                                                                                    {order.notes}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="ml-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon">
                                                                            <MoreVertical className="w-4 h-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem>
                                                                            <Eye className="w-4 h-4 mr-2" />
                                                                            View Details
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <Truck className="w-4 h-4 mr-2" />
                                                                            Update Shipping
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <MessageCircle className="w-4 h-4 mr-2" />
                                                                            Contact Customer
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <Printer className="w-4 h-4 mr-2" />
                                                                            Print Invoice
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-red-600">
                                                                            <XCircle className="w-4 h-4 mr-2" />
                                                                            Cancel Order
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}

                                        {filteredOrders.length === 0 && (
                                            <Card>
                                                <CardContent className="p-8 text-center">
                                                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-muted-foreground" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold mb-2">No Orders Found</h4>
                                                    <p className="text-muted-foreground mb-4">
                                                        {searchQuery ? 'Try a different search term' : 'No orders match your filters'}
                                                    </p>
                                                    <Button onClick={() => {
                                                        setSearchQuery('')
                                                        setSelectedStatus('all')
                                                    }}>
                                                        Clear Filters
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex items-center justify-between border-t pt-6">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {filteredOrders.length} of {orders.length} orders
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" disabled>
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-8 h-8 p-0" disabled>
                                            1
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Right Column - Analytics & Quick Actions */}
                        <div className="space-y-6">
                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>
                                        Latest order updates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500/10 rounded-full">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Order #ORD-2024-001 delivered</p>
                                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-full">
                                                <Truck className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Order #ORD-2024-002 shipped</p>
                                                <p className="text-xs text-muted-foreground">4 hours ago</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-500/10 rounded-full">
                                                <Clock className="w-4 h-4 text-amber-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Payment pending for #ORD-2024-003</p>
                                                <p className="text-xs text-muted-foreground">1 day ago</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded-full">
                                                <ShoppingBag className="w-4 h-4 text-purple-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">New order #ORD-2024-008 received</p>
                                                <p className="text-xs text-muted-foreground">2 days ago</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full">
                                        View All Activity
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Top Customers */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Customers</CardTitle>
                                    <CardDescription>
                                        Most valuable customers
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recentCustomers.map((customer, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60">
                                                        {customer.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{customer.name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <ShoppingBag className="w-3 h-3" />
                                                        {customer.orders} orders
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatCurrency(customer.total)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Last: {formatDate(customer.lastOrder)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" className="w-full">
                                        View All Customers
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Order Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Timeline</CardTitle>
                                    <CardDescription>
                                        Orders by time period
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Today</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{stats.today} orders</span>
                                                <Badge className="bg-green-500">+2</Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Last 7 Days</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{stats.last7Days} orders</span>
                                                <Badge className="bg-green-500">+15%</Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Last 30 Days</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{stats.last30Days} orders</span>
                                                <Badge className="bg-green-500">+28%</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Best Selling Product</span>
                                            <Badge variant="outline">Wireless Earbuds Pro</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Avg. Delivery Time</span>
                                            <span className="text-sm">3.2 days</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Customer Satisfaction</span>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                ))}
                                                <span className="text-xs ml-1">4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Truck className="w-4 h-4" />
                                        Bulk Shipping
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Printer className="w-4 h-4" />
                                        Print All Labels
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Download className="w-4 h-4" />
                                        Export Reports
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <RefreshCw className="w-4 h-4" />
                                        Sync Inventory
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Metrics</CardTitle>
                                <CardDescription>
                                    Key performance indicators for your orders
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-primary/10 rounded-lg">
                                                <BarChart2 className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Order Fulfillment Rate</p>
                                                <p className="text-2xl font-bold">94.2%</p>
                                            </div>
                                        </div>
                                        <Progress value={94.2} className="h-2" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-green-500/10 rounded-lg">
                                                <DollarSign className="w-6 h-6 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Revenue Growth</p>
                                                <p className="text-2xl font-bold">+18.5%</p>
                                            </div>
                                        </div>
                                        <Progress value={65} className="h-2" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                                <Clock className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
                                                <p className="text-2xl font-bold">6.4h</p>
                                            </div>
                                        </div>
                                        <Progress value={75} className="h-2" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                                <Award className="w-6 h-6 text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Customer Rating</p>
                                                <p className="text-2xl font-bold">4.8/5</p>
                                            </div>
                                        </div>
                                        <Progress value={96} className="h-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}