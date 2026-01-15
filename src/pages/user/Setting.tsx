import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useAppDispatch } from '@/store/hook'
import { logout } from '@/store/slices/authSlice'
import { fetchuserprofile, updateUserProfile } from '@/api/profile'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Mail, Phone, Calendar, MapPin, Edit2, Save, X, Globe, Wallet, Trophy, Eye, MessageSquare, Share2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function Setting() {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()

    const [isEditing, setIsEditing] = useState(false)
    const [editedData, setEditedData] = useState<any>({})

    // Fetch user profile
    const { data: profileData, isLoading, error } = useQuery({
        queryKey: ["fetchuserprofile"],
        queryFn: fetchuserprofile,
    })

    // Update user profile mutation
    // Update the mutation to handle file upload errors
    const updateProfileMutation = useMutation({
        mutationFn: updateUserProfile,
        onMutate: async (newData) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["fetchuserprofile"] });

            // Snapshot the previous value
            const previousData = queryClient.getQueryData(["fetchuserprofile"]);

            // Optimistically update to the new value
            // For files, use the preview URL temporarily
            queryClient.setQueryData(["fetchuserprofile"], (old: any) => ({
                ...old,
                profile: {
                    ...old?.profile,
                    ...newData,
                    // If there's a file, use the preview URL temporarily
                    profile_picture: newData.profile_picture instanceof File
                        ? editedData.profile_picture_preview
                        : newData.profile_picture
                }
            }));

            return { previousData };
        },
        onError: (err, newData, context) => {
            // Rollback on error
            queryClient.setQueryData(["fetchuserprofile"], context?.previousData);

            const errorMessage = err instanceof Error
                ? err.message
                : "Failed to update profile. Please try again.";

            toast.error("Update failed", {
                description: errorMessage,
            });
        },
        onSuccess: (data) => {
            toast.success("Profile updated", {
                description: "Your profile has been updated successfully.",
            });
            setIsEditing(false);

            // Force refetch to get the actual image URL from backend
            queryClient.invalidateQueries({ queryKey: ["fetchuserprofile"] });
        },
        onSettled: () => {
            // Refetch to ensure we have fresh data
            queryClient.invalidateQueries({ queryKey: ["fetchuserprofile"] });
        },
    });
    // Add cleanup effect for object URLs
    useEffect(() => {
        return () => {
            // Cleanup any object URLs to prevent memory leaks
            if (editedData.profile_picture_preview) {
                URL.revokeObjectURL(editedData.profile_picture_preview);
            }
        };
    }, [editedData.profile_picture_preview]);

    // Initialize edited data when profile data loads
    useEffect(() => {
        if (profileData?.profile) {
            setEditedData(profileData.profile)
        }
    }, [profileData])

    const handleInputChange = (field: string, value: string) => {
        setEditedData((prev: any) => ({
            ...prev,
            [field]: value
        }))
    }
    const handleSave = () => {
        // Prepare data for update
        const updatePayload: Record<string, any> = {};

        Object.entries(editedData).forEach(([key, value]) => {
            // Skip preview fields and unchanged values
            if (['profile_picture_preview'].includes(key)) {
                return;
            }

            // Skip system fields
            if (['id', 'user_id', 'created_at', 'updated_at', 'last_active_at'].includes(key)) {
                return;
            }

            // For file uploads, always send the file
            if (key === 'profile_picture' && value instanceof File) {
                updatePayload[key] = value;
                return;
            }

            // For other fields, only send if changed
            const originalValue = profileData?.profile?.[key];
            if (value !== originalValue) {
                updatePayload[key] = value;
            }
        });

        // Don't send if nothing changed
        if (Object.keys(updatePayload).length === 0) {
            toast.info("No changes detected", {
                description: "Make some changes before saving."
            });
            return;
        }

        // Show loading toast
        const toastId = toast.loading("Updating profile...");

        updateProfileMutation.mutate(updatePayload, {
            onSettled: () => {
                toast.dismiss(toastId);
            },
            onSuccess: () => {
                // Clear the preview URL after successful upload
                setEditedData(prev => {
                    const newData = { ...prev };
                    delete newData.profile_picture_preview;
                    return newData;
                });
            }
        });
    };

    const handleCancel = () => {
        setEditedData(profileData?.profile || {})
        setIsEditing(false)
    }

    const handleLogout = () => {
        toast.info("Logging out...", {
            description: "You will be redirected to the login page.",
        })
        dispatch(logout())
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not set'
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch {
            return 'Invalid date'
        }
    }

    const getInitials = () => {
        const firstName = editedData?.first_name || ''
        const lastName = editedData?.last_name || ''
        if (firstName || lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
        }
        return 'U'
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-20 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center space-y-4">
                    <div className="text-destructive text-lg font-semibold">
                        Failed to load profile
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toast.info("Reloading profile...")
                            window.location.reload()
                        }}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    const profile = profileData?.profile || {}

    return (
        <div className="min-h-screen bg-background">
            {/* TikTok-like Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
                            <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={updateProfileMutation.isPending}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={updateProfileMutation.isPending}
                                    >
                                        {updateProfileMutation.isPending ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setIsEditing(true)
                                        toast.info("Edit mode enabled", {
                                            description: "You can now edit your profile information.",
                                        })
                                    }}
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Overview */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Overview</CardTitle>
                                <CardDescription>
                                    Member since {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar */}
                                <div className="flex flex-col items-center space-y-4">
                                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                        <AvatarImage
                                            src={editedData.profile_picture_preview || `${import.meta.env.VITE_PHOTO_BASE}${profile.profile_picture}` || ''}
                                        />
                                        <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <h2 className="text-xl font-semibold">
                                            {editedData.first_name || editedData.last_name
                                                ? `${editedData.first_name || ''} ${editedData.last_name || ''}`.trim()
                                                : 'Anonymous User'
                                            }
                                        </h2>
                                        <p className="text-muted-foreground text-sm">User ID: {profile.user_id?.slice(0, 8)}...</p>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Eye className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">Ads Watched</span>
                                        </div>
                                        <div className="text-2xl font-bold">{profile.total_ads_watched}</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <MessageSquare className="h-4 w-4 text-secondary" />
                                            <span className="text-sm font-medium">Comments</span>
                                        </div>
                                        <div className="text-2xl font-bold">{profile.total_comments}</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Trophy className="h-4 w-4 text-amber-500" />
                                            <span className="text-sm font-medium">Games Played</span>
                                        </div>
                                        <div className="text-2xl font-bold">{profile.total_games_played}</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Share2 className="h-4 w-4 text-green-500" />
                                            <span className="text-sm font-medium">Shares</span>
                                        </div>
                                        <div className="text-2xl font-bold">{profile.total_shares}</div>
                                    </div>
                                </div>

                                {/* Account Status */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Account Status</span>
                                        <Badge variant={profile.is_active ? "success" : "secondary"}>
                                            {profile.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Email Notifications</span>
                                        <Badge variant={profile.email_notifications ? "default" : "secondary"}>
                                            {profile.email_notifications ? "Enabled" : "Disabled"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Balance Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Balance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Wallet className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">Money Balance</p>
                                            <p className="text-muted-foreground text-xs">Available to withdraw</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold">${parseFloat(profile.money_balance || '0').toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="h-5 w-5 text-amber-500" />
                                        <div>
                                            <p className="text-sm font-medium">Points Balance</p>
                                            <p className="text-muted-foreground text-xs">Reward points</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold">{parseFloat(profile.points_balance || '0').toFixed(0)} pts</span>
                                </div>
                                <div className="pt-3 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Total Earned</span>
                                        <span className="font-bold">${parseFloat(profile.total_earned || '0').toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Editable Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid grid-cols-3 mb-6">
                                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                <TabsTrigger value="account">Account Settings</TabsTrigger>
                                <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
                            </TabsList>

                            {/* Personal Info Tab */}
                            <TabsContent value="personal" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                        <CardDescription>
                                            Update your personal details and contact information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        First Name
                                                    </div>
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    value={editedData.first_name || ''}
                                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="Enter your first name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={editedData.last_name || ''}
                                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="Enter your last name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">
                                                <div className="flex items-center gap-2">
                                                    <Edit2 className="h-4 w-4" />
                                                    Bio
                                                </div>
                                            </Label>
                                            <Textarea
                                                id="bio"
                                                value={editedData.bio || ''}
                                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="Tell others about yourself..."
                                                rows={3}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Brief description for your profile
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        Phone Number
                                                    </div>
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={editedData.phone_number || ''}
                                                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="+1 (555) 123-4567"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dob">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        Date of Birth
                                                    </div>
                                                </Label>
                                                <Input
                                                    id="dob"
                                                    type="date"
                                                    value={editedData.date_of_birth || ''}
                                                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="gender">Gender</Label>
                                                <Input
                                                    id="gender"
                                                    value={editedData.gender || ''}
                                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="Male/Female/Other"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="profilePicture">Profile Picture</Label>
                                                <div className="flex items-center gap-3">
                                                    <Input
                                                        id="profilePicture"
                                                        type="file"
                                                        accept="image/*"
                                                        // In the Profile Picture input section, change:
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                // Check file size (limit to 5MB)
                                                                if (file.size > 5 * 1024 * 1024) {
                                                                    toast.error("File too large", {
                                                                        description: "Profile picture must be less than 5MB.",
                                                                    });
                                                                    return;
                                                                }

                                                                // Check file type
                                                                if (!file.type.startsWith('image/')) {
                                                                    toast.error("Invalid file type", {
                                                                        description: "Please upload an image file.",
                                                                    });
                                                                    return;
                                                                }

                                                                // Store the file with the correct field name for backend
                                                                handleInputChange('profile_picture', file);

                                                                // Create preview for immediate display
                                                                const previewUrl = URL.createObjectURL(file);
                                                                // Store preview separately
                                                                setEditedData(prev => ({
                                                                    ...prev,
                                                                    profile_picture_preview: previewUrl
                                                                }));
                                                            }
                                                        }}
                                                        disabled={!isEditing}
                                                        className="cursor-pointer"
                                                    />
                                                    {editedData.profile_picture_preview && (
                                                        <div className="h-16 w-16 rounded-full overflow-hidden border">
                                                            <img
                                                                src={editedData.profile_picture_preview}
                                                                alt="Profile preview"
                                                                className="h-full w-full object-cover"
                                                                onLoad={(e) => {
                                                                    // Revoke the object URL after the image loads to free memory
                                                                    if (editedData.profile_picture instanceof File) {
                                                                        URL.revokeObjectURL(e.currentTarget.src);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Location</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="country">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" />
                                                        Country
                                                    </div>
                                                </Label>
                                                <Input
                                                    id="country"
                                                    value={editedData.country || ''}
                                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="Enter your country"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        City
                                                    </div>
                                                </Label>
                                                <Input
                                                    id="city"
                                                    value={editedData.city || ''}
                                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="Enter your city"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                value={editedData.address || ''}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="Enter your full address"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Account Settings Tab */}
                            <TabsContent value="account" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notification Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="notifications">Push Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive push notifications for updates
                                                </p>
                                            </div>
                                            <Button
                                                variant={editedData.notifications_enabled ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleInputChange('notifications_enabled', !editedData.notifications_enabled)}
                                                disabled={!isEditing}
                                            >
                                                {editedData.notifications_enabled ? 'Enabled' : 'Disabled'}
                                            </Button>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="emailNotifications">Email Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive notifications via email
                                                </p>
                                            </div>
                                            <Button
                                                variant={editedData.email_notifications ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleInputChange('email_notifications', !editedData.email_notifications)}
                                                disabled={!isEditing}
                                            >
                                                {editedData.email_notifications ? 'Enabled' : 'Disabled'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Preferences</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="favoriteCategories">Favorite Categories</Label>
                                            <Input
                                                id="favoriteCategories"
                                                value={editedData.favorite_categories || ''}
                                                onChange={(e) => handleInputChange('favorite_categories', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="Enter your favorite categories (comma separated)"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Used to personalize your experience
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="paymentMethods">Payment Methods</Label>
                                            <Input
                                                id="paymentMethods"
                                                value={editedData.payment_methods || ''}
                                                onChange={(e) => handleInputChange('payment_methods', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="Enter your payment methods"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Privacy & Security Tab */}
                            <TabsContent value="privacy" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Account Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-destructive">Danger Zone</Label>
                                            <p className="text-sm text-muted-foreground">
                                                These actions are irreversible. Please proceed with caution.
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-destructive/50 p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <p className="font-medium">Logout</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Sign out from your account on this device
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm("Are you sure you want to logout?")) {
                                                            handleLogout()
                                                        }
                                                    }}
                                                >
                                                    Logout
                                                </Button>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <p className="font-medium">Delete Account</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Permanently delete your account and all data
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        toast.error("Account deletion not available", {
                                                            description: "Please contact support to delete your account.",
                                                        })
                                                    }}
                                                >
                                                    Delete Account
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Data & Privacy</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Account Created</span>
                                                <span className="text-sm">{formatDate(profile.created_at)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Last Updated</span>
                                                <span className="text-sm">{formatDate(profile.updated_at)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Last Active</span>
                                                <span className="text-sm">{profile.last_active_at ? formatDate(profile.last_active_at) : 'Never'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}