import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { motion } from "framer-motion"
import { Label } from '@/components/ui/label'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getCatagory } from '@/api/catagory'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { postAdFeed } from '@/api/feed'

interface AdFormData {
    title: string
    description: string
    tag_names: string
    file: File | null
    category_id: string
}

export default function UploadAd() {
    const { data: categories, isLoading, error } = useQuery({
        queryFn: getCatagory,
        queryKey: ["getCatagory"]
    })

    const { mutate, isPending } = useMutation({
        mutationFn: postAdFeed,
        mutationKey: ["postAdFeed"]
    })

    const [formdata, setFormData] = useState<AdFormData>({
        title: "",
        description: "",
        tag_names: "",
        file: null,
        category_id: "",
    })

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setFormData(prev => ({ ...prev, file }))
    }

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category_id: value }))
    }

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const fd = new FormData()
        fd.append("title", formdata.title)
        fd.append("description", formdata.description)

        // tags: send as tag_names[]
        formdata.tag_names
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean)
            .forEach(tag => {
                fd.append("tag_names[]", tag)
            })

        fd.append("category_id", formdata.category_id)

        if (formdata.file) {
            fd.append("file", formdata.file)
        } else {
            console.warn("No video file selected")
        }

        console.log("SENDING:", [...fd.entries()])

        mutate(fd)
    }

    return (
        <div className="flex min-h-screen mt-10 justify-center px-4">
            <div className="w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                >
                    <Card className={cn(
                        "bg-card/80 backdrop-blur-md shadow-xl border border-border/40 rounded-2xl"
                    )}>
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-2xl font-semibold">Post Advertisement</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Fill the form to publish your ad on the platform
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submitForm} className="flex flex-col gap-5 mt-2">

                                {/* Title */}
                                <div className="flex flex-col gap-1">
                                    <Label>Title</Label>
                                    <Input
                                        name="title"
                                        value={formdata.title}
                                        onChange={handleChange}
                                        placeholder="Enter ad title"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-1">
                                    <Label>Description</Label>
                                    <Textarea
                                        name="description"
                                        value={formdata.description}
                                        onChange={handleChange}
                                        placeholder="Write a detailed description..."
                                        className="min-h-[120px]"
                                        required
                                    />
                                </div>

                                {/* Tags */}
                                <div className="flex flex-col gap-1">
                                    <Label>Tags</Label>
                                    <Input
                                        name="tag_names"
                                        value={formdata.tag_names}
                                        onChange={handleChange}
                                        placeholder="e.g. travel, hotel, food"
                                    />
                                </div>

                                {/* Category */}
                                <div className="flex flex-col gap-1">
                                    <Label>Category</Label>
                                    <Select
                                        value={formdata.category_id}
                                        onValueChange={handleCategoryChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {isLoading && <div className="p-2">Loading...</div>}
                                            {error && (
                                                <div className="p-2 text-red-500">
                                                    Failed to load categories
                                                </div>
                                            )}

                                            {!isLoading && !error &&
                                                categories?.map(cat => (
                                                    <SelectItem
                                                        key={cat.id}
                                                        value={String(cat.id)}
                                                    >
                                                        {cat.name}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Video Upload */}
                                <div className="flex flex-col gap-1">
                                    <Label>Upload Video</Label>
                                    <Input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideo}
                                        required
                                    />
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    className="w-full py-3 text-md font-medium"
                                    disabled={isPending}
                                >
                                    {isPending ? "Uploading..." : "Upload Ad"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
