import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Wallet, CreditCard, Banknote, TrendingUp, TrendingDown,
    Download, Upload, Plus, MoreVertical, CheckCircle,
    Clock, XCircle, Filter, Search, ArrowUpRight,
    ArrowDownRight, DollarSign, Shield, Lock, History,
    Receipt, QrCode, Calendar, ExternalLink
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

// Static data
const walletData = {
    balance: 12500.75,
    availableBalance: 10500.50,
    pendingAmount: 2000.25,
    currency: 'USD',
    totalSpentThisMonth: 3250.00,
    monthlyBudget: 5000.00,
    adsRunning: 3,
}

const paymentMethods = [
    {
        id: 1,
        type: 'card',
        name: 'Visa ending in 4242',
        lastFour: '4242',
        expiry: '12/25',
        isDefault: true,
        icon: CreditCard,
        color: 'bg-blue-500'
    },
    {
        id: 2,
        type: 'card',
        name: 'Mastercard ending in 8888',
        lastFour: '8888',
        expiry: '08/24',
        isDefault: false,
        icon: CreditCard,
        color: 'bg-red-500'
    },
    {
        id: 3,
        type: 'bank',
        name: 'Bank Transfer',
        lastFour: '8888',
        expiry: '',
        isDefault: false,
        icon: Banknote,
        color: 'bg-green-500'
    },
]

const transactions = [
    {
        id: 1,
        type: 'debit',
        amount: 1500.00,
        description: 'Ad Campaign - Summer Sale',
        date: '2024-01-15',
        status: 'completed',
        category: 'ad_spend',
        campaignName: 'Summer Sale 2024',
        invoiceId: 'INV-2024-001'
    },
    {
        id: 2,
        type: 'credit',
        amount: 5000.00,
        description: 'Wallet Top-up',
        date: '2024-01-14',
        status: 'completed',
        category: 'topup',
        method: 'Credit Card',
        invoiceId: 'TOP-2024-001'
    },
    {
        id: 3,
        type: 'debit',
        amount: 750.50,
        description: 'Ad Campaign - New Product Launch',
        date: '2024-01-13',
        status: 'completed',
        category: 'ad_spend',
        campaignName: 'Product Launch',
        invoiceId: 'INV-2024-002'
    },
    {
        id: 4,
        type: 'debit',
        amount: 1000.00,
        description: 'Monthly Subscription',
        date: '2024-01-10',
        status: 'completed',
        category: 'subscription',
        plan: 'Pro Plan',
        invoiceId: 'SUB-2024-001'
    },
    {
        id: 5,
        type: 'debit',
        amount: 250.25,
        description: 'Ad Campaign - Brand Awareness',
        date: '2024-01-08',
        status: 'pending',
        category: 'ad_spend',
        campaignName: 'Brand Awareness',
        invoiceId: 'INV-2024-003'
    },
    {
        id: 6,
        type: 'credit',
        amount: 2000.00,
        description: 'Refund - Campaign Adjustment',
        date: '2024-01-05',
        status: 'completed',
        category: 'refund',
        reason: 'Campaign Budget Adjustment',
        invoiceId: 'REF-2024-001'
    },
    {
        id: 7,
        type: 'debit',
        amount: 450.00,
        description: 'Ad Campaign - Weekend Promo',
        date: '2024-01-03',
        status: 'completed',
        category: 'ad_spend',
        campaignName: 'Weekend Promo',
        invoiceId: 'INV-2024-004'
    },
    {
        id: 8,
        type: 'credit',
        amount: 3000.00,
        description: 'Wallet Top-up',
        date: '2024-01-01',
        status: 'completed',
        category: 'topup',
        method: 'Bank Transfer',
        invoiceId: 'TOP-2024-002'
    },
]

const spendingCategories = [
    { name: 'Ad Campaigns', amount: 3250.00, percentage: 65, color: 'bg-primary' },
    { name: 'Subscriptions', amount: 1000.00, percentage: 20, color: 'bg-blue-500' },
    { name: 'Platform Fees', amount: 500.00, percentage: 10, color: 'bg-purple-500' },
    { name: 'Other', amount: 250.00, percentage: 5, color: 'bg-gray-500' },
]

export default function AdvertiserWallet() {
    const [activeTab, setActiveTab] = useState('overview')
    const [selectedFilter, setSelectedFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [topupAmount, setTopupAmount] = useState('100')

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: walletData.currency,
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

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge className="bg-green-500 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                    </Badge>
                )
            case 'pending':
                return (
                    <Badge variant="outline" className="text-amber-600 border-amber-600 gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                    </Badge>
                )
            case 'failed':
                return (
                    <Badge variant="outline" className="text-red-600 border-red-600 gap-1">
                        <XCircle className="w-3 h-3" />
                        Failed
                    </Badge>
                )
            default:
                return null
        }
    }

    // Get category color
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'ad_spend':
                return 'text-blue-600 bg-blue-50'
            case 'topup':
                return 'text-green-600 bg-green-50'
            case 'subscription':
                return 'text-purple-600 bg-purple-50'
            case 'refund':
                return 'text-amber-600 bg-amber-50'
            default:
                return 'text-gray-600 bg-gray-50'
        }
    }

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        if (selectedFilter !== 'all' && selectedFilter !== transaction.type) {
            return false
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                transaction.description.toLowerCase().includes(query) ||
                transaction.campaignName?.toLowerCase().includes(query) ||
                transaction.invoiceId.toLowerCase().includes(query)
            )
        }
        return true
    })

    // Calculate monthly spending progress
    const spendingProgress = (walletData.totalSpentThisMonth / walletData.monthlyBudget) * 100

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Advertiser Wallet</h1>
                                <p className="text-muted-foreground">
                                    Manage your balance, transactions, and payment methods
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Export Statement
                                </Button>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Funds
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Balance & Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Balance Cards */}
                            <div className="grid md:grid-cols-3 gap-4">
                                {/* Total Balance */}
                                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Wallet className="w-5 h-5 text-primary" />
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Total
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">Total Balance</p>
                                            <h2 className="text-3xl font-bold">{formatCurrency(walletData.balance)}</h2>
                                            <p className="text-xs text-muted-foreground">
                                                {walletData.currency} • Updated just now
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Available Balance */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-green-500/10 rounded-lg">
                                                <TrendingUp className="w-5 h-5 text-green-500" />
                                            </div>
                                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600">
                                                Available
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">Available Balance</p>
                                            <h2 className="text-3xl font-bold">{formatCurrency(walletData.availableBalance)}</h2>
                                            <p className="text-xs text-muted-foreground">
                                                Ready to use
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Pending Amount */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                                <Clock className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600">
                                                Pending
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">Pending Amount</p>
                                            <h2 className="text-3xl font-bold">{formatCurrency(walletData.pendingAmount)}</h2>
                                            <p className="text-xs text-muted-foreground">
                                                Processing transactions
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Monthly Budget */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Budget</CardTitle>
                                    <CardDescription>
                                        Track your advertising spend for this month
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Spending Progress</span>
                                            <span className="text-sm font-bold">
                                                {formatCurrency(walletData.totalSpentThisMonth)} / {formatCurrency(walletData.monthlyBudget)}
                                            </span>
                                        </div>
                                        <Progress value={spendingProgress} className="h-2" />
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{Math.round(spendingProgress)}% spent</span>
                                            <span>{formatCurrency(walletData.monthlyBudget - walletData.totalSpentThisMonth)} remaining</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-medium">Spending Breakdown</h4>
                                        {spendingCategories.map((category, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("w-3 h-3 rounded-full", category.color)} />
                                                        <span className="text-sm">{category.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                                                        <span className="text-xs text-muted-foreground">{category.percentage}%</span>
                                                    </div>
                                                </div>
                                                <Progress value={category.percentage} className="h-1" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>
                                        Common wallet operations
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <Button variant="outline" className="flex-col h-24 gap-2">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <Upload className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <span className="text-sm">Add Funds</span>
                                        </Button>

                                        <Button variant="outline" className="flex-col h-24 gap-2">
                                            <div className="p-2 bg-green-500/10 rounded-lg">
                                                <Download className="w-5 h-5 text-green-500" />
                                            </div>
                                            <span className="text-sm">Withdraw</span>
                                        </Button>

                                        <Button variant="outline" className="flex-col h-24 gap-2">
                                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                                <Receipt className="w-5 h-5 text-purple-500" />
                                            </div>
                                            <span className="text-sm">Invoices</span>
                                        </Button>

                                        <Button variant="outline" className="flex-col h-24 gap-2">
                                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                                <History className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <span className="text-sm">History</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Payment Methods & Top-up */}
                        <div className="space-y-6">
                            {/* Payment Methods */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Payment Methods</CardTitle>
                                            <CardDescription>
                                                Your saved payment options
                                            </CardDescription>
                                        </div>
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Add New
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {paymentMethods.map((method) => {
                                        const Icon = method.icon
                                        return (
                                            <div
                                                key={method.id}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-lg border",
                                                    method.isDefault && "border-primary bg-primary/5"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-2 rounded-lg", method.color)}>
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{method.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Expires {method.expiry || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {method.isDefault && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Default
                                                        </Badge>
                                                    )}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                {method.isDefault ? 'Default Method' : 'Set as Default'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>

                            {/* Quick Top-up */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Top-up</CardTitle>
                                    <CardDescription>
                                        Add funds to your wallet instantly
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount ({walletData.currency})</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={topupAmount}
                                                onChange={(e) => setTopupAmount(e.target.value)}
                                                className="pl-9"
                                                min="10"
                                                step="10"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            {['50', '100', '200', '500', '1000'].map((amount) => (
                                                <Button
                                                    key={amount}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setTopupAmount(amount)}
                                                    className={cn(
                                                        "flex-1",
                                                        topupAmount === amount && "border-primary bg-primary/10"
                                                    )}
                                                >
                                                    {walletData.currency} {amount}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Payment Method</Label>
                                        <Select defaultValue={paymentMethods[0].id.toString()}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentMethods.map((method) => (
                                                    <SelectItem key={method.id} value={method.id.toString()}>
                                                        {method.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Amount</span>
                                            <span className="font-medium">{formatCurrency(parseFloat(topupAmount) || 0)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Processing Fee</span>
                                            <span className="text-sm">Free</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Total</span>
                                            <span className="text-lg font-bold">{formatCurrency(parseFloat(topupAmount) || 0)}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Add Funds Now
                                    </Button>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Shield className="w-3 h-3" />
                                        <span>Secure payment powered by Stripe</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Security Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        Security
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Wallet Protection</span>
                                        <Badge className="bg-green-500">Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Daily Limit</span>
                                        <span className="text-sm font-medium">{formatCurrency(10000)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">2FA Enabled</span>
                                        <Badge variant="outline">Not Setup</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Transaction History</CardTitle>
                                        <CardDescription>
                                            All your wallet transactions and payments
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search transactions..."
                                                className="pl-9 w-full sm:w-64"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="credit">Credits</SelectItem>
                                                <SelectItem value="debit">Debits</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {filteredTransactions.map((transaction) => (
                                        <motion.div
                                            key={transaction.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "p-3 rounded-lg",
                                                    transaction.type === 'credit'
                                                        ? "bg-green-500/10 text-green-600"
                                                        : "bg-red-500/10 text-red-600"
                                                )}>
                                                    {transaction.type === 'credit' ? (
                                                        <ArrowDownRight className="w-5 h-5" />
                                                    ) : (
                                                        <ArrowUpRight className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-medium">{transaction.description}</h4>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(transaction.date)}
                                                        </span>
                                                        {transaction.campaignName && (
                                                            <>
                                                                <span>•</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {transaction.campaignName}
                                                                </Badge>
                                                            </>
                                                        )}
                                                        <Badge variant="outline" className={cn("text-xs", getCategoryColor(transaction.category))}>
                                                            {transaction.category.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className={cn(
                                                        "text-lg font-semibold",
                                                        transaction.type === 'credit' ? "text-green-600" : "text-red-600"
                                                    )}>
                                                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {transaction.invoiceId}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(transaction.status)}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Receipt className="w-4 h-4 mr-2" />
                                                                View Receipt
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Download className="w-4 h-4 mr-2" />
                                                                Download Invoice
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {filteredTransactions.length === 0 && (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                                <Receipt className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <h4 className="text-lg font-semibold mb-2">No Transactions Found</h4>
                                            <p className="text-muted-foreground">
                                                {searchQuery ? 'Try a different search term' : 'No transactions yet'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between border-t pt-6">
                                <div className="text-sm text-muted-foreground">
                                    Showing {filteredTransactions.length} of {transactions.length} transactions
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled>
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-8 h-8 p-0" disabled>
                                        1
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Next
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Avg. Monthly Spend</p>
                                        <p className="text-lg font-bold">{formatCurrency(4500)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Successful Payments</p>
                                        <p className="text-lg font-bold">156</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Clock className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
                                        <p className="text-lg font-bold">2.3 mins</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg">
                                        <QrCode className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Wallet Health</p>
                                        <p className="text-lg font-bold">Excellent</p>
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