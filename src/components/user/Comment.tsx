import type { AdVideo } from '@/types/models/adVideo'
import React, { useState } from 'react'
import { SheetDescription, SheetFooter, SheetTitle } from '../ui/sheet'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { SendIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postComment } from '@/api/feed'
import CommentItem from './CommentItem'

export default function Comment({ v }: { v: AdVideo }) {
    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationFn: postComment,
        mutationKey: ["postComment"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["videos"] })
        }
    })

    const [comment, setComment] = useState("")

    const handleSendComment = () => {
        if (!comment.trim()) return
        mutate({ comment: comment, videoid: v.id })
        setComment("")
    }

    return (
        <>
            <SheetTitle>Comments ({v.comment_count})</SheetTitle>

            <SheetDescription className="mt-4 max-h-[400px] overflow-y-auto pr-2">
                {v.comments.length === 0 && (
                    <p className="text-muted-foreground">No comments yet</p>
                )}

                {v.comments.map((c) => (
                    <CommentItem key={c.id} c={c} />
                ))}
            </SheetDescription>

            <SheetFooter>
                <div className="flex justify-between items-center w-full">
                    <Textarea
                        placeholder="Write a comment..."
                        className="flex-grow"
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <Button
                        variant="secondary"
                        size="icon"
                        className="ml-3"
                        onClick={handleSendComment}
                        disabled={isPending}
                    >
                        <SendIcon />
                    </Button>
                </div>
            </SheetFooter>
        </>
    )
}
