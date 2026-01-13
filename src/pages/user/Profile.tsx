import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAdvertiserProfile } from '@/api/profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Play, Pause, Share2, MessageCircle, Heart, Eye, MapPin, Globe, Building, ChevronLeft, MoreVertical } from 'lucide-react'

interface Video {
    id: string
    title: string
    thumbnail_url: string | null
    video_url: string
    views: number
}

interface AdvertiserProfile {
    company_name: string
    logo: string | null
    cover_image: string | null
    description: string | null
    website: string | null
    city: string
    address: string | null
    country: string
    total_ads: number
    total_views: number
    videos_count: number
    videos: Video[]
}

export default function Profile() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [currentPlayingVideo, setCurrentPlayingVideo] = useState<string | null>(null)
    const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set())
    const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())

    const { data: profileData, error, isLoading } = useQuery<AdvertiserProfile>({
        queryKey: ["fetchAdvertiserProfile", id],
        queryFn: () => fetchAdvertiserProfile({ id: id! }),
        enabled: !!id,
    })

    const videos = profileData?.videos || []

    // Handle video playback
    const handleVideoPlay = (videoId: string) => {
        // Stop any currently playing video
        if (currentPlayingVideo && currentPlayingVideo !== videoId) {
            const prevVideo = videoRefs.current.get(currentPlayingVideo)
            if (prevVideo) {
                prevVideo.pause()
            }
        }

        const video = videoRefs.current.get(videoId)
        if (video) {
            if (video.paused) {
                video.play().catch(console.error)
                setCurrentPlayingVideo(videoId)
            } else {
                video.pause()
                setCurrentPlayingVideo(null)
            }
        }
    }

    const handleLike = (videoId: string) => {
        setLikedVideos(prev => {
            const newSet = new Set(prev)
            if (newSet.has(videoId)) {
                newSet.delete(videoId)
                toast.success("Unliked video")
            } else {
                newSet.add(videoId)
                toast.success("Liked video")
            }
            return newSet
        })
    }

    const handleShare = (videoId: string) => {
        const shareUrl = `${window.location.origin}/video/${videoId}`
        navigator.clipboard.writeText(shareUrl).then(() => {
            toast.success("Link copied to clipboard")
        })
    }

    const formatViews = (views: number) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
        return views.toString()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Advertiser not found</h1>
                <p className="text-muted-foreground mb-6">The advertiser profile you're looking for doesn't exist.</p>
                <Button onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Fixed Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="hover:bg-accent"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold">{profileData.company_name}</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="space-y-6">
                    {/* Cover Image & Logo */}
                    <div className="relative rounded-2xl overflow-hidden">
                        {profileData.cover_image ? (
                            <img
                                src={profileData.cover_image}
                                alt="Cover"
                                className="w-full h-48 object-cover"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
                        )}
                        <div className="absolute -bottom-8 left-6">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                                <AvatarImage src={profileData.logo || ''} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl font-bold">
                                    {profileData.company_name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-12 space-y-4">
                        {/* Company Name & Stats */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold">{profileData.company_name}</h1>
                                <p className="text-muted-foreground text-sm">Advertising Company</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <Card className="bg-card">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-xl font-bold">{profileData.total_ads}</div>
                                        <div className="text-xs text-muted-foreground">Total Ads</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-xl font-bold">{formatViews(profileData.total_views)}</div>
                                        <div className="text-xs text-muted-foreground">Total Views</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-xl font-bold">{profileData.videos_count}</div>
                                        <div className="text-xs text-muted-foreground">Videos</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Description */}
                        {profileData.description && (
                            <Card className="bg-card">
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-2">About</h3>
                                    <p className="text-sm text-muted-foreground">{profileData.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Location & Website */}
                        <div className="space-y-3">
                            {(profileData.city !== 'Pending' || profileData.country !== 'Pending') && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-accent">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Location</div>
                                        <div className="text-sm text-muted-foreground">
                                            {profileData.city !== 'Pending' && profileData.country !== 'Pending'
                                                ? `${profileData.city}, ${profileData.country}`
                                                : 'Location not specified'
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}

                            {profileData.website && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-accent">
                                        <Globe className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Website</div>
                                        <a
                                            href={profileData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {profileData.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Videos Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Videos ({videos.length})</h2>
                        <Badge variant="outline" className="text-sm">
                            <Eye className="h-3 w-3 mr-1" />
                            {formatViews(profileData.total_views)} total views
                        </Badge>
                    </div>

                    {videos.length === 0 ? (
                        <Card className="bg-card">
                            <CardContent className="p-8 text-center">
                                <div className="inline-flex p-4 rounded-full bg-accent mb-4">
                                    <Building className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
                                <p className="text-muted-foreground text-sm">
                                    This advertiser hasn't uploaded any videos yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <Card
                                    key={video.id}
                                    className="group relative overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300"
                                >
                                    {/* Video Thumbnail/Player */}
                                    <div className="relative aspect-[9/16] overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-14 w-14 rounded-full bg-background/80 backdrop-blur hover:bg-background/90 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                onClick={() => handleVideoPlay(video.id)}
                                            >
                                                {currentPlayingVideo === video.id ? (
                                                    <Pause className="h-6 w-6" />
                                                ) : (
                                                    <Play className="h-6 w-6" />
                                                )}
                                            </Button>
                                        </div>

                                        {/* Video */}
                                        <video
                                            ref={el => {
                                                if (el) {
                                                    videoRefs.current.set(video.id, el)
                                                } else {
                                                    videoRefs.current.delete(video.id)
                                                }
                                            }}
                                            src={`https://pub-7fa68a27c9094c06b1a9403bec80db5a.r2.dev/${video.video_url}`}
                                            className="w-full h-full object-cover"
                                            loop
                                            playsInline
                                            onClick={() => handleVideoPlay(video.id)}
                                            onPlay={() => setCurrentPlayingVideo(video.id)}
                                            onPause={() => {
                                                if (currentPlayingVideo === video.id) {
                                                    setCurrentPlayingVideo(null)
                                                }
                                            }}
                                        />

                                        {/* View Count Badge */}
                                        <Badge
                                            variant="secondary"
                                            className="absolute top-3 right-3 bg-background/90 backdrop-blur text-xs font-medium"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            {formatViews(video.views)}
                                        </Badge>
                                    </div>

                                    {/* Video Info */}
                                    <CardContent className="p-4 space-y-3">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold line-clamp-2 leading-tight">
                                                {video.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                Published by {profileData.company_name}
                                            </p>
                                        </div>

                                        {/* Video Actions */}
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleLike(video.id)}
                                                >
                                                    <Heart
                                                        className={`h-4 w-4 ${likedVideos.has(video.id) ? 'fill-red-500 text-red-500' : ''}`}
                                                    />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => toast.info("Comments coming soon")}
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-3"
                                                onClick={() => handleShare(video.id)}
                                            >
                                                <Share2 className="h-4 w-4 mr-1" />
                                                Share
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}