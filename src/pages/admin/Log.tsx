import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Trash2,
    Edit,
    UserPlus,
    UserMinus,
    Shield,
    Database,
    Video,
    ShoppingBag,
    AlertCircle,
    CheckCircle,
    Clock,
    Search,
    Filter,
    Download,
    RefreshCw,
    Eye,
    User,
    FileText,
    Server
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from "@/components/ui/progress"
// Dummy log data
const systemLogs = [
    {
        id: 'LOG-001',
        timestamp: '2024-01-15 14:32:15',
        user: 'admin123',
        action: 'DELETE_USER',
        target: 'User: "test_user_001"',
        ip: '192.168.1.100',
        status: 'success',
        details: 'User account permanently deleted from system',
        severity: 'high',
    },
    {
        id: 'LOG-002',
        timestamp: '2024-01-15 14:25:42',
        user: 'advertiser_456',
        action: 'UPDATE_VIDEO',
        target: 'Video: "Ethiopian Coffee Ceremony"',
        ip: '102.88.34.12',
        status: 'success',
        details: 'Updated video description and tags',
        severity: 'low',
    },
    {
        id: 'LOG-003',
        timestamp: '2024-01-15 14:18:05',
        user: 'system',
        action: 'DATABASE_BACKUP',
        target: 'Database: injera_platform',
        ip: '127.0.0.1',
        status: 'success',
        details: 'Daily automatic database backup completed',
        severity: 'medium',
    },
    {
        id: 'LOG-004',
        timestamp: '2024-01-15 13:45:22',
        user: 'admin123',
        action: 'BLOCK_USER',
        target: 'User: "spammer_001"',
        ip: '192.168.1.100',
        status: 'success',
        details: 'User blocked for violating terms of service',
        severity: 'high',
    },
    {
        id: 'LOG-005',
        timestamp: '2024-01-15 13:32:11',
        user: 'system',
        action: 'SERVER_RESTART',
        target: 'API Server',
        ip: '127.0.0.1',
        status: 'success',
        details: 'Scheduled server maintenance restart',
        severity: 'medium',
    },
    {
        id: 'LOG-006',
        timestamp: '2024-01-15 12:56:34',
        user: 'peragoo',
        action: 'DELETE_VIDEO',
        target: 'Video: "Old Promotion Campaign"',
        ip: '102.88.34.56',
        status: 'success',
        details: 'Advertiser deleted their own video content',
        severity: 'medium',
    },
    {
        id: 'LOG-007',
        timestamp: '2024-01-15 12:45:18',
        user: 'admin123',
        action: 'UPDATE_USER_ROLE',
        target: 'User: "moderator_001"',
        ip: '192.168.1.100',
        status: 'failed',
        details: 'Failed to update user role: insufficient permissions',
        severity: 'high',
    },
    {
        id: 'LOG-008',
        timestamp: '2024-01-15 12:30:55',
        user: 'system',
        action: 'CLEANUP_TEMP_FILES',
        target: 'Storage System',
        ip: '127.0.0.1',
        status: 'success',
        details: 'Cleaned up temporary files (2.3GB reclaimed)',
        severity: 'low',
    },
    {
        id: 'LOG-009',
        timestamp: '2024-01-15 12:15:42',
        user: 'ethio_crafts',
        action: 'UPDATE_ORDER_STATUS',
        target: 'Order: #ETH-8923',
        ip: '102.88.34.78',
        status: 'success',
        details: 'Updated order status from "Pending" to "Shipped"',
        severity: 'low',
    },
    {
        id: 'LOG-010',
        timestamp: '2024-01-15 11:58:27',
        user: 'admin123',
        action: 'DELETE_VIDEO',
        target: 'Video: "Violating Content #123"',
        ip: '192.168.1.100',
        status: 'success',
        details: 'Admin removed video for content policy violation',
        severity: 'critical',
    },
    {
        id: 'LOG-011',
        timestamp: '2024-01-15 11:42:13',
        user: 'system',
        action: 'SECURITY_SCAN',
        target: 'API Endpoints',
        ip: '127.0.0.1',
        status: 'warning',
        details: 'Security scan detected 2 potential vulnerabilities',
        severity: 'high',
    },
    {
        id: 'LOG-012',
        timestamp: '2024-01-15 11:25:06',
        user: 'addis_fashion',
        action: 'UPDATE_WALLET_BALANCE',
        target: 'Wallet: addis_fashion',
        ip: '102.88.34.90',
        status: 'success',
        details: 'Added ₦15,000 to wallet balance via TeleBirr',
        severity: 'low',
    },
    {
        id: 'LOG-013',
        timestamp: '2024-01-15 11:12:34',
        user: 'system',
        action: 'EMAIL_QUEUE_PROCESS',
        target: 'Email Service',
        ip: '127.0.0.1',
        status: 'success',
        details: 'Processed 145 pending emails from queue',
        severity: 'low',
    },
    {
        id: 'LOG-014',
        timestamp: '2024-01-15 10:58:22',
        user: 'admin123',
        action: 'CREATE_USER',
        target: 'User: "new_moderator"',
        ip: '192.168.1.100',
        status: 'success',
        details: 'Created new moderator account with limited permissions',
        severity: 'medium',
    },
    {
        id: 'LOG-015',
        timestamp: '2024-01-15 10:45:17',
        user: 'system',
        action: 'CACHE_CLEAR',
        target: 'Redis Cache',
        ip: '127.0.0.1',
        status: 'success',
        details: 'Cleared expired cache entries (1,234 items)',
        severity: 'low',
    },
]

const activitySummary = {
    today: {
        total: 156,
        success: 142,
        failed: 8,
        warning: 6,
        users: 45,
        admins: 3,
    },
    week: {
        total: 1056,
        success: 987,
        failed: 45,
        warning: 24,
        users: 245,
        admins: 5,
    },
    month: {
        total: 4256,
        success: 3987,
        failed: 156,
        warning: 113,
        users: 1256,
        admins: 8,
    },
}

const topUsers = [
    { user: 'admin123', actions: 456, lastActive: '2 minutes ago', role: 'Admin' },
    { user: 'system', actions: 398, lastActive: '5 minutes ago', role: 'System' },
    { user: 'peragoo', actions: 156, lastActive: '15 minutes ago', role: 'Advertiser' },
    { user: 'ethio_crafts', actions: 134, lastActive: '30 minutes ago', role: 'Advertiser' },
    { user: 'addis_fashion', actions: 112, lastActive: '45 minutes ago', role: 'Advertiser' },
]

const actionTypes = [
    { action: 'DELETE', count: 234, icon: Trash2, color: 'bg-red-500' },
    { action: 'UPDATE', count: 1567, icon: Edit, color: 'bg-blue-500' },
    { action: 'CREATE', count: 456, icon: UserPlus, color: 'bg-green-500' },
    { action: 'SECURITY', count: 89, icon: Shield, color: 'bg-amber-500' },
    { action: 'SYSTEM', count: 876, icon: Server, color: 'bg-purple-500' },
]

const getActionIcon = (action: string) => {
    if (action.includes('DELETE')) return <Trash2 className="h-4 w-4" />
    if (action.includes('UPDATE')) return <Edit className="h-4 w-4" />
    if (action.includes('CREATE')) return <UserPlus className="h-4 w-4" />
    if (action.includes('USER')) return <User className="h-4 w-4" />
    if (action.includes('VIDEO')) return <Video className="h-4 w-4" />
    if (action.includes('ORDER')) return <ShoppingBag className="h-4 w-4" />
    if (action.includes('DATABASE')) return <Database className="h-4 w-4" />
    if (action.includes('SECURITY')) return <Shield className="h-4 w-4" />
    if (action.includes('SERVER')) return <Server className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
}

const getSeverityBadge = (severity: string) => {
    switch (severity) {
        case 'critical':
            return <Badge variant="destructive">Critical</Badge>
        case 'high':
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>
        case 'medium':
            return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>
        case 'low':
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>
        default:
            return <Badge variant="outline">{severity}</Badge>
    }
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'success':
            return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" /> Success</Badge>
        case 'failed':
            return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>
        case 'warning':
            return <Badge variant="default" className="bg-amber-100 text-amber-800 hover:bg-amber-100"><AlertCircle className="h-3 w-3 mr-1" /> Warning</Badge>
        default:
            return <Badge variant="outline">{status}</Badge>
    }
}

const getActionColor = (action: string) => {
    if (action.includes('DELETE')) return 'text-red-600 bg-red-50'
    if (action.includes('UPDATE')) return 'text-blue-600 bg-blue-50'
    if (action.includes('CREATE')) return 'text-green-600 bg-green-50'
    if (action.includes('SECURITY')) return 'text-amber-600 bg-amber-50'
    return 'text-gray-600 bg-gray-50'
}

export default function Log() {
    const [searchTerm, setSearchTerm] = useState('')
    const [actionFilter, setActionFilter] = useState('all')
    const [severityFilter, setSeverityFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedLog, setSelectedLog] = useState<any>(null)
    const [logDialogOpen, setLogDialogOpen] = useState(false)

    const filteredLogs = systemLogs.filter(log => {
        const matchesSearch =
            log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesAction = actionFilter === 'all' ||
            (actionFilter === 'delete' && log.action.includes('DELETE')) ||
            (actionFilter === 'update' && log.action.includes('UPDATE')) ||
            (actionFilter === 'create' && log.action.includes('CREATE')) ||
            (actionFilter === 'security' && (log.action.includes('SECURITY') || log.action.includes('BLOCK'))) ||
            (actionFilter === 'system' && log.user === 'system')

        const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter
        const matchesStatus = statusFilter === 'all' || log.status === statusFilter

        return matchesSearch && matchesAction && matchesSeverity && matchesStatus
    })

    const handleViewLogDetails = (log: any) => {
        setSelectedLog(log)
        setLogDialogOpen(true)
    }

    const clearAllLogs = () => {
        if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            // API call to clear logs would go here
            console.log('Clearing all logs...')
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
                        <p className="text-muted-foreground">
                            Monitor all system activities, deletions, updates, and security events
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={clearAllLogs}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All Logs
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Logs
                        </Button>
                        <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Activity Summary */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Activities</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activitySummary.today.total}</div>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="default" className="bg-green-100 text-green-800">
                                {activitySummary.today.success} Success
                            </Badge>
                            <Badge variant="destructive">{activitySummary.today.failed} Failed</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activitySummary.today.users}</div>
                        <div className="text-sm text-muted-foreground mt-2">
                            Including {activitySummary.today.admins} administrators
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">3</div>
                        <div className="text-sm text-muted-foreground mt-2">
                            High severity events today
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">245ms</div>
                        <div className="text-sm text-muted-foreground mt-2">
                            System operation latency
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Action Types */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Filters and Search */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Log Filters</CardTitle>
                            <CardDescription>Filter system logs by various criteria</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search logs by ID, user, action, or details..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Advanced Filters
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Select value={actionFilter} onValueChange={setActionFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Action Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Actions</SelectItem>
                                        <SelectItem value="delete">Delete Actions</SelectItem>
                                        <SelectItem value="update">Update Actions</SelectItem>
                                        <SelectItem value="create">Create Actions</SelectItem>
                                        <SelectItem value="security">Security Actions</SelectItem>
                                        <SelectItem value="system">System Actions</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Severity</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="success">Success</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Logs Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>System Activity Log</CardTitle>
                                    <CardDescription>
                                        Showing {filteredLogs.length} of {systemLogs.length} logs
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        Real-time
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">ID</TableHead>
                                            <TableHead className="w-[180px]">Timestamp</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Target</TableHead>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLogs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                    No logs found matching your filters
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredLogs.map((log) => (
                                                <TableRow key={log.id} className="hover:bg-muted/50">
                                                    <TableCell className="font-mono text-xs">{log.id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{log.timestamp.split(' ')[0]}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {log.timestamp.split(' ')[1]}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                {log.user === 'system' ? (
                                                                    <Server className="h-4 w-4" />
                                                                ) : (
                                                                    <User className="h-4 w-4" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">{log.user}</div>
                                                                <div className="text-xs text-muted-foreground">{log.ip}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getActionColor(log.action)}`}>
                                                            {getActionIcon(log.action)}
                                                            <span className="font-medium">{log.action}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate">
                                                        {log.target}
                                                    </TableCell>
                                                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                                                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewLogDetails(log)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Stats & Details */}
                <div className="space-y-6">
                    {/* Action Type Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Action Type Breakdown</CardTitle>
                            <CardDescription>Distribution of system actions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {actionTypes.map((action) => {
                                const Icon = action.icon
                                return (
                                    <div key={action.action} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-full ${action.color} bg-opacity-10`}>
                                                    <Icon className={`h-4 w-4 ${action.color.replace('bg-', 'text-')}`} />
                                                </div>
                                                <span className="font-medium">{action.action}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">{action.count}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {((action.count / activitySummary.month.total) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                        <Progress
                                            value={(action.count / activitySummary.month.total) * 100}
                                            className="h-2"
                                        />
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>

                    {/* Most Active Users */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Most Active Users</CardTitle>
                            <CardDescription>Users with most system actions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topUsers.map((user, index) => (
                                <div key={user.user} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <span className="text-xs font-bold">{index + 1}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.user}</div>
                                                <div className="text-xs text-muted-foreground">{user.role}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{user.actions}</div>
                                            <div className="text-xs text-muted-foreground">{user.lastActive}</div>
                                        </div>
                                    </div>
                                    {index < topUsers.length - 1 && <Separator />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Log Statistics</CardTitle>
                            <CardDescription>System log metrics overview</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium">This Week</div>
                                    <div className="text-2xl font-bold">{activitySummary.week.total}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {activitySummary.week.success} successful
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium">This Month</div>
                                    <div className="text-2xl font-bold">{activitySummary.month.total}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {activitySummary.month.success} successful
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Failed Actions</span>
                                    <Badge variant="destructive">{activitySummary.month.failed}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Warning Events</span>
                                    <Badge className="bg-amber-100 text-amber-800">{activitySummary.month.warning}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Critical Events</span>
                                    <Badge variant="destructive">12</Badge>
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
                            <Button variant="outline" className="w-full justify-start">
                                <Download className="h-4 w-4 mr-2" />
                                Export Selected Logs
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                View Error Logs Only
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Shield className="h-4 w-4 mr-2" />
                                Security Audit Logs
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Database className="h-4 w-4 mr-2" />
                                Database Operation Logs
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Log Details Dialog */}
            <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Log Details: {selectedLog?.id}
                        </DialogTitle>
                        <DialogDescription>
                            Complete details of the selected system log entry
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <ScrollArea className="max-h-[400px] pr-4">
                            <div className="space-y-6">
                                {/* Header Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Timestamp</div>
                                        <div className="font-mono bg-muted p-2 rounded">
                                            {selectedLog.timestamp}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">User</div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                {selectedLog.user === 'system' ? (
                                                    <Server className="h-4 w-4" />
                                                ) : (
                                                    <User className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">{selectedLog.user}</div>
                                                <div className="text-xs text-muted-foreground">{selectedLog.ip}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Details */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Action</div>
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded ${getActionColor(selectedLog.action)}`}>
                                        {getActionIcon(selectedLog.action)}
                                        <span className="font-medium">{selectedLog.action}</span>
                                        <div className="ml-auto flex items-center gap-2">
                                            {getSeverityBadge(selectedLog.severity)}
                                            {getStatusBadge(selectedLog.status)}
                                        </div>
                                    </div>
                                </div>

                                {/* Target */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Target</div>
                                    <div className="bg-muted p-3 rounded">
                                        {selectedLog.target}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Details</div>
                                    <div className="bg-muted p-3 rounded whitespace-pre-wrap">
                                        {selectedLog.details}
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Metadata</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-muted p-2 rounded">
                                            <div className="text-xs text-muted-foreground">Log ID</div>
                                            <div className="font-mono text-sm">{selectedLog.id}</div>
                                        </div>
                                        <div className="bg-muted p-2 rounded">
                                            <div className="text-xs text-muted-foreground">Severity</div>
                                            <div className="font-medium">{selectedLog.severity.toUpperCase()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLogDialogOpen(false)}>
                            Close
                        </Button>
                        <Button variant="default">
                            <Download className="h-4 w-4 mr-2" />
                            Export This Log
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Log Analysis Tabs */}
            <Tabs defaultValue="security" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="security">
                        <Shield className="h-4 w-4 mr-2" />
                        Security Logs
                    </TabsTrigger>
                    <TabsTrigger value="database">
                        <Database className="h-4 w-4 mr-2" />
                        Database Logs
                    </TabsTrigger>
                    <TabsTrigger value="user">
                        <User className="h-4 w-4 mr-2" />
                        User Activity
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Event Analysis</CardTitle>
                            <CardDescription>Monitoring and analysis of security-related events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Failed Login Attempts</div>
                                        <div className="text-2xl font-bold text-red-600">23</div>
                                        <div className="text-xs text-muted-foreground">
                                            In the last 24 hours
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">IP Blocks</div>
                                        <div className="text-2xl font-bold">5</div>
                                        <div className="text-xs text-muted-foreground">
                                            Suspicious IP addresses blocked
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Recent Security Events</div>
                                    <div className="space-y-2">
                                        {systemLogs
                                            .filter(log => log.severity === 'critical' || log.severity === 'high')
                                            .slice(0, 3)
                                            .map(log => (
                                                <div key={log.id} className="flex items-center justify-between p-2 bg-muted rounded">
                                                    <div className="flex items-center gap-2">
                                                        {getActionIcon(log.action)}
                                                        <span className="text-sm">{log.action}</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{log.timestamp.split(' ')[1]}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="database">
                    <Card>
                        <CardHeader>
                            <CardTitle>Database Operation Logs</CardTitle>
                            <CardDescription>CRUD operations and database maintenance events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Database Queries</div>
                                        <div className="text-2xl font-bold">12,456</div>
                                        <div className="text-xs text-muted-foreground">
                                            Executed in last 24 hours
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Backup Size</div>
                                        <div className="text-2xl font-bold">2.3 GB</div>
                                        <div className="text-xs text-muted-foreground">
                                            Latest database backup
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="user">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Activity Patterns</CardTitle>
                            <CardDescription>Analysis of user behavior and activity trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Peak Activity Time</div>
                                        <div className="text-2xl font-bold">10:00 AM</div>
                                        <div className="text-xs text-muted-foreground">
                                            Most user activity occurs
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Avg. Actions/User</div>
                                        <div className="text-2xl font-bold">3.4</div>
                                        <div className="text-xs text-muted-foreground">
                                            Daily average per user
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}