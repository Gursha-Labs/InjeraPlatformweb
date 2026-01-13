import { fetchadvertiserownprofile } from '@/api/profile'
import { updateadveriserprofile } from '@/api/profile'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
    Edit, Save, X, Camera, Mail, Phone, Globe,
    MapPin, Building, Briefcase, DollarSign, Bell,
    Eye, Calendar, CheckCircle, Clock, TrendingUp,
    Users, Award, Shield, CreditCard, Settings,
    Upload, Image as ImageIcon, Link, Facebook,
    Twitter, Instagram, Linkedin, Youtube, Globe as WebIcon,
    EyeOff, BellOff, Mail as MailIcon, ExternalLink,
    Trash2, User
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function AdvertiserProfile() {
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState<any>({})
    const [activeTab, setActiveTab] = useState('overview')
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>('')
    const [profilePicturePreview, setProfilePicturePreview] = useState<string>('')
    const [coverImagePreview, setCoverImagePreview] = useState<string>('')

    const logoInputRef = useRef<HTMLInputElement>(null)
    const profilePictureInputRef = useRef<HTMLInputElement>(null)
    const coverImageInputRef = useRef<HTMLInputElement>(null)

    // Fetch profile data
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["fetchadvertiserownprofile"],
        queryFn: fetchadvertiserownprofile,
    })

    // Update profile mutation
    const updateMutation = useMutation({
        mutationFn: updateadveriserprofile,
        onSuccess: (response) => {
            toast.success('Profile Updated Successfully!')
            queryClient.invalidateQueries({ queryKey: ["fetchadvertiserownprofile"] })
            setIsEditing(false)
            // Clear file states
            setLogoFile(null)
            setProfilePictureFile(null)
            setCoverImageFile(null)
            setLogoPreview('')
            setProfilePicturePreview('')
            setCoverImagePreview('')
        },
        onError: (error: any) => {
            toast.error('Failed to Update Profile', {
                description: error?.message || 'Please try again',
            })
        }
    })

    // Initialize edit data when data loads
    useEffect(() => {
        if (data) {
            setEditData(data)
        }
    }, [data])

    // Handle input changes
    const handleInputChange = (field: string, value: any) => {
        setEditData((prev: any) => ({
            ...prev,
            [field]: value
        }))
    }

    // Handle file selection
    const handleFileSelect = (type: 'logo' | 'profile_picture' | 'cover_image', file: File) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            const preview = reader.result as string

            switch (type) {
                case 'logo':
                    setLogoFile(file)
                    setLogoPreview(preview)
                    break
                case 'profile_picture':
                    setProfilePictureFile(file)
                    setProfilePicturePreview(preview)
                    break
                case 'cover_image':
                    setCoverImageFile(file)
                    setCoverImagePreview(preview)
                    break
            }
        }
        reader.readAsDataURL(file)
    }

    // Remove image
    const removeImage = (type: 'logo' | 'profile_picture' | 'cover_image') => {
        switch (type) {
            case 'logo':
                setLogoFile(null)
                setLogoPreview('')
                if (logoInputRef.current) logoInputRef.current.value = ''
                break
            case 'profile_picture':
                setProfilePictureFile(null)
                setProfilePicturePreview('')
                if (profilePictureInputRef.current) profilePictureInputRef.current.value = ''
                break
            case 'cover_image':
                setCoverImageFile(null)
                setCoverImagePreview('')
                if (coverImageInputRef.current) coverImageInputRef.current.value = ''
                break
        }
    }

    // Handle save
    const handleSave = async () => {
        try {
            // Create FormData for file uploads
            const formData = new FormData()

            // Append all text fields
            Object.entries(editData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    // Skip image fields that will be handled as files
                    if (!['logo', 'profile_picture', 'cover_image'].includes(key)) {
                        formData.append(key, value.toString())
                    }
                }
            })

            // Append files if selected
            if (logoFile) formData.append('logo', logoFile)
            if (profilePictureFile) formData.append('profile_picture', profilePictureFile)
            if (coverImageFile) formData.append('cover_image', coverImageFile)

            await updateMutation.mutateAsync({ data: formData })
        } catch (error) {
            console.error('Error saving profile:', error)
        }
    }

    // Handle cancel
    const handleCancel = () => {
        if (data) {
            setEditData(data)
        }
        // Clear all file selections
        setLogoFile(null)
        setProfilePictureFile(null)
        setCoverImageFile(null)
        setLogoPreview('')
        setProfilePicturePreview('')
        setCoverImagePreview('')
        if (logoInputRef.current) logoInputRef.current.value = ''
        if (profilePictureInputRef.current) profilePictureInputRef.current.value = ''
        if (coverImageInputRef.current) coverImageInputRef.current.value = ''
        setIsEditing(false)
    }

    // Format currency
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(parseFloat(amount))
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(date)
    }

    // Calculate profile completion percentage
    const calculateProfileCompletion = () => {
        if (!data) return 0

        const fields = [
            data.company_name !== 'Pending',
            data.business_email,
            data.phone_number !== 'Pending',
            data.website,
            data.logo,
            data.profile_picture,
            data.cover_image,
            data.description,
            data.country !== 'Pending',
            data.city !== 'Pending',
            data.address,
        ]

        const completed = fields.filter(Boolean).length
        return Math.round((completed / fields.length) * 100)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-background/50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Header Skeleton */}
                        <div className="mb-8">
                            <Skeleton className="h-10 w-64 mb-2" />
                            <Skeleton className="h-4 w-96" />
                        </div>

                        {/* Profile Card Skeleton */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Skeleton className="h-64 w-full rounded-xl" />
                                <Skeleton className="h-32 w-full rounded-xl" />
                            </div>
                            <div className="space-y-6">
                                <Skeleton className="h-64 w-full rounded-xl" />
                                <Skeleton className="h-48 w-full rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-background/50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <Alert variant="destructive" className="mb-6">
                            <AlertTitle>Failed to Load Profile</AlertTitle>
                            <AlertDescription>
                                {error?.message || 'Unable to load your profile information'}
                            </AlertDescription>
                        </Alert>
                        <Button onClick={() => refetch()} className="gap-2">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const profileCompletion = calculateProfileCompletion()
    const isPremium = data.subscription_plan !== 'free'
    const isActive = data.is_active

    // Get image URLs
    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return ''
        if (imagePath.startsWith('http')) return imagePath
        return `http://localhost:8000/${imagePath}`
    }

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
                                <h1 className="text-3xl font-bold mb-2">Advertiser Profile</h1>
                                <p className="text-muted-foreground">
                                    Manage your advertising account and settings
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge variant={isActive ? "default" : "secondary"} className="gap-2">
                                    {isActive ? (
                                        <>
                                            <CheckCircle className="w-3 h-3" />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="w-3 h-3" />
                                            Inactive
                                        </>
                                    )}
                                </Badge>

                                {!isEditing && (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Profile Completion */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold">Profile Completion</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Complete your profile to unlock all features
                                        </p>
                                    </div>
                                    <Badge variant={profileCompletion === 100 ? "default" : "outline"}>
                                        {profileCompletion}%
                                    </Badge>
                                </div>
                                <Progress value={profileCompletion} className="h-2" />
                                {profileCompletion < 100 && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Add missing information to improve your profile visibility
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="business">Business</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                            <TabsTrigger value="subscription">Subscription</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Left Column - Stats */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Total Ads</p>
                                                        <p className="text-2xl font-bold">{data.total_ads_uploaded || 0}</p>
                                                    </div>
                                                    <div className="p-3 bg-blue-500/10 rounded-lg">
                                                        <Briefcase className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Total Views</p>
                                                        <p className="text-2xl font-bold">
                                                            {(data.total_ad_views || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-green-500/10 rounded-lg">
                                                        <Eye className="w-5 h-5 text-green-500" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Total Spent</p>
                                                        <p className="text-2xl font-bold">
                                                            {formatCurrency(data.total_spent || '0')}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-purple-500/10 rounded-lg">
                                                        <DollarSign className="w-5 h-5 text-purple-500" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Account Status */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Account Status</CardTitle>
                                            <CardDescription>Your current account information</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Plan</h4>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={isPremium ? "default" : "outline"}>
                                                            {data.subscription_plan || 'Free'}
                                                        </Badge>
                                                        {!data.subscription_active && (
                                                            <Badge variant="outline" className="text-amber-600">
                                                                Inactive
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Email Status</h4>
                                                    <div className="flex items-center gap-2">
                                                        {data.email_verified_at ? (
                                                            <Badge className="bg-green-500">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-amber-600">
                                                                Pending
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h4>
                                                    <p className="font-medium">
                                                        {formatDate(data.user_created_at)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                                                    <p className="font-medium">
                                                        {formatDate(data.user_updated_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right Column - Quick Actions */}
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Quick Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                <Settings className="w-4 h-4" />
                                                Account Settings
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                Upgrade Plan
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                <TrendingUp className="w-4 h-4" />
                                                View Analytics
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                <Users className="w-4 h-4" />
                                                Invite Team Members
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Subscription Status */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Subscription</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">Current Plan</span>
                                                    <Badge variant={isPremium ? "default" : "outline"}>
                                                        {data.subscription_plan}
                                                    </Badge>
                                                </div>

                                                {!data.subscription_active && (
                                                    <Alert>
                                                        <AlertTitle>Subscription Inactive</AlertTitle>
                                                        <AlertDescription>
                                                            Your subscription is not active. Please upgrade to access premium features.
                                                        </AlertDescription>
                                                    </Alert>
                                                )}

                                                <Button className="w-full gap-2" disabled={data.subscription_active}>
                                                    <CreditCard className="w-4 h-4" />
                                                    {data.subscription_active ? 'Active' : 'Upgrade Now'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Personal Information</CardTitle>
                                            <CardDescription>
                                                Update your personal details and contact information
                                            </CardDescription>
                                        </div>
                                        {!isEditing && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Profile Images */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {/* Profile Picture */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Profile Picture</Label>
                                                <div className="flex flex-col items-center gap-4">
                                                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                                        <AvatarImage
                                                            src={profilePicturePreview || getImageUrl(data.profile_picture)}
                                                            alt="Profile"
                                                        />
                                                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl font-bold">
                                                            <User className="w-8 h-8" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {isEditing && (
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="file"
                                                                ref={profilePictureInputRef}
                                                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (file) handleFileSelect('profile_picture', file)
                                                                }}
                                                                className="hidden"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2"
                                                                onClick={() => profilePictureInputRef.current?.click()}
                                                            >
                                                                <Camera className="w-4 h-4" />
                                                                Change Photo
                                                            </Button>
                                                            {(profilePicturePreview || data.profile_picture) && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={() => removeImage('profile_picture')}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Logo */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Company Logo</Label>
                                                <div className="flex flex-col items-center gap-4">
                                                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                                        <AvatarImage
                                                            src={logoPreview || getImageUrl(data.logo)}
                                                            alt="Logo"
                                                        />
                                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-2xl font-bold">
                                                            {data.company_name?.charAt(0) || 'C'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {isEditing && (
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="file"
                                                                ref={logoInputRef}
                                                                accept="image/jpeg,image/png,image/jpg,image/gif,image/svg"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (file) handleFileSelect('logo', file)
                                                                }}
                                                                className="hidden"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2"
                                                                onClick={() => logoInputRef.current?.click()}
                                                            >
                                                                <Camera className="w-4 h-4" />
                                                                Change Logo
                                                            </Button>
                                                            {(logoPreview || data.logo) && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={() => removeImage('logo')}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cover Image */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Cover Image</Label>
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                                                        <img
                                                            src={coverImagePreview || getImageUrl(data.cover_image)}
                                                            alt="Cover"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    {isEditing && (
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="file"
                                                                ref={coverImageInputRef}
                                                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (file) handleFileSelect('cover_image', file)
                                                                }}
                                                                className="hidden"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2"
                                                                onClick={() => coverImageInputRef.current?.click()}
                                                            >
                                                                <Camera className="w-4 h-4" />
                                                                Change Cover
                                                            </Button>
                                                            {(coverImagePreview || data.cover_image) && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={() => removeImage('cover_image')}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Basic Information */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="username">Username</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="username"
                                                        value={editData.username || ''}
                                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 p-2 px-3 rounded-lg border bg-muted/50">
                                                        <span className="font-medium">{data.username}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={editData.email || ''}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 p-2 px-3 rounded-lg border bg-muted/50">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{data.email}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone_number">Phone Number</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="phone_number"
                                                        value={editData.phone_number || ''}
                                                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 p-2 px-3 rounded-lg border bg-muted/50">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{data.phone_number}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="company_name">Company Name</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="company_name"
                                                        value={editData.company_name || ''}
                                                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 p-2 px-3 rounded-lg border bg-muted/50">
                                                        <Building className="w-4 h-4" />
                                                        <span className="font-medium">{data.company_name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="business_email">Business Email</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="business_email"
                                                        type="email"
                                                        value={editData.business_email || ''}
                                                        onChange={(e) => handleInputChange('business_email', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 p-2 px-3 rounded-lg border bg-muted/50">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{data.business_email || 'Not set'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Company Description</Label>
                                        {isEditing ? (
                                            <Textarea
                                                id="description"
                                                value={editData.description || ''}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                placeholder="Describe your company, services, and mission..."
                                                className="min-h-[120px]"
                                            />
                                        ) : (
                                            <div className="p-4 rounded-lg border bg-muted/50">
                                                <p className="whitespace-pre-line">
                                                    {data.description || 'No description provided'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Edit Mode Actions */}
                                    {isEditing && (
                                        <div className="flex justify-end gap-3 pt-6 border-t">
                                            <Button
                                                variant="outline"
                                                onClick={handleCancel}
                                                className="gap-2"
                                                disabled={updateMutation.isPending}
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                className="gap-2"
                                                disabled={updateMutation.isPending}
                                            >
                                                {updateMutation.isPending ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Business Tab */}
                        <TabsContent value="business" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Business Information</CardTitle>
                                    <CardDescription>
                                        Update your business location and contact details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="country">Country</Label>
                                                {isEditing ? (
                                                    <Select
                                                        value={editData.country || ''}
                                                        onValueChange={(value) => handleInputChange('country', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select country" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                                                            <SelectItem value="Kenya">Kenya</SelectItem>
                                                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                                                            <SelectItem value="South Africa">South Africa</SelectItem>
                                                            <SelectItem value="United States">United States</SelectItem>
                                                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="flex items-center gap-2 p-2 px-3 rounded-lg border bg-muted/50">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{data.country}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="city"
                                                        value={editData.city || ''}
                                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="p-2 px-3 rounded-lg border bg-muted/50">
                                                        <span>{data.city}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="address">Address</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="address"
                                                        value={editData.address || ''}
                                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="p-2 px-3 rounded-lg border bg-muted/50">
                                                        <span>{data.address || 'Not specified'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="website">Website</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="website"
                                                        type="url"
                                                        value={editData.website || ''}
                                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                                        placeholder="https://example.com"
                                                    />
                                                ) : data.website ? (
                                                    <a
                                                        href={data.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 p-2 px-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                                                    >
                                                        <Globe className="w-4 h-4" />
                                                        <span className="text-primary hover:underline">
                                                            {data.website.replace(/^https?:\/\//, '')}
                                                        </span>
                                                        <ExternalLink className="w-3 h-3 ml-auto" />
                                                    </a>
                                                ) : (
                                                    <div className="p-2 px-3 rounded-lg border bg-muted/50">
                                                        <span className="text-muted-foreground">Not set</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit Mode Actions for Business Tab */}
                                    {isEditing && activeTab === 'business' && (
                                        <div className="flex justify-end gap-3 pt-6 border-t">
                                            <Button
                                                variant="outline"
                                                onClick={handleCancel}
                                                className="gap-2"
                                                disabled={updateMutation.isPending}
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                className="gap-2"
                                                disabled={updateMutation.isPending}
                                            >
                                                {updateMutation.isPending ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Preferences Tab */}
                        <TabsContent value="preferences" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>
                                        Control how and when you receive notifications
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label htmlFor="notifications_enabled">Enable Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive notifications about your ads and account activity
                                                </p>
                                            </div>
                                            {isEditing ? (
                                                <Switch
                                                    id="notifications_enabled"
                                                    checked={editData.notifications_enabled}
                                                    onCheckedChange={(checked) => handleInputChange('notifications_enabled', checked)}
                                                />
                                            ) : (
                                                <Badge variant={data.notifications_enabled ? "default" : "outline"}>
                                                    {data.notifications_enabled ? (
                                                        <>
                                                            <Bell className="w-3 h-3 mr-1" />
                                                            Enabled
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BellOff className="w-3 h-3 mr-1" />
                                                            Disabled
                                                        </>
                                                    )}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label htmlFor="email_notifications">Email Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive email updates about your account
                                                </p>
                                            </div>
                                            {isEditing ? (
                                                <Switch
                                                    id="email_notifications"
                                                    checked={editData.email_notifications}
                                                    onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                                                />
                                            ) : (
                                                <Badge variant={data.email_notifications ? "default" : "outline"}>
                                                    {data.email_notifications ? (
                                                        <>
                                                            <MailIcon className="w-3 h-3 mr-1" />
                                                            Enabled
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Mail className="w-3 h-3 mr-1" />
                                                            Disabled
                                                        </>
                                                    )}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Edit Mode Actions for Preferences Tab */}
                                    {isEditing && activeTab === 'preferences' && (
                                        <div className="flex justify-end gap-3 pt-6 border-t">
                                            <Button
                                                variant="outline"
                                                onClick={handleCancel}
                                                className="gap-2"
                                                disabled={updateMutation.isPending}
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                className="gap-2"
                                                disabled={updateMutation.isPending}
                                            >
                                                {updateMutation.isPending ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Subscription Tab */}
                        <TabsContent value="subscription" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Subscription Details</CardTitle>
                                    <CardDescription>
                                        Manage your subscription plan and billing information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Plan</h4>
                                                <Badge variant={isPremium ? "default" : "outline"} className="text-lg px-4 py-2">
                                                    {data.subscription_plan}
                                                </Badge>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                                                <Badge variant={data.subscription_active ? "default" : "outline"}>
                                                    {data.subscription_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Spent</h4>
                                                <p className="text-2xl font-bold">{formatCurrency(data.total_spent)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Security</CardTitle>
                                    <CardDescription>
                                        Manage your account security settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label>Two-Factor Authentication</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Add an extra layer of security to your account
                                                </p>
                                            </div>
                                            <Badge variant="outline">Not Enabled</Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label>Last Active</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    {data.last_active_at ? formatDate(data.last_active_at) : 'Never'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label>Account Status</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    {data.is_active ? 'Active' : 'Suspended'}
                                                </p>
                                            </div>
                                            <Badge variant={data.is_active ? "default" : "destructive"}>
                                                {data.is_active ? 'Active' : 'Suspended'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}