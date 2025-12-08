import type { Comment } from "@/types/models/adVideo";
import type { AdVideo } from "@/types/models/adVideo";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replytoComment } from "@/api/feed";

export default function CommentItem({ c }: { c: Comment }) {
    const queryClient = useQueryClient();
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    const mutation = useMutation<Comment, Error, { reply: string; videoid: string; commentid: string }>({
        mutationKey: ["replytoComment"],
        mutationFn: replytoComment,
        onSuccess: (newReply: Comment) => {
            // newReply is fully typed as Comment

            queryClient.setQueryData<AdVideo[]>(["videos"], (oldVideos) => {
                if (!oldVideos) return oldVideos;

                return oldVideos.map((video) => {
                    if (video.id !== c.ad_id) return video;

                    return {
                        ...video,
                        comments: video.comments.map((comment) => {
                            if (comment.id !== c.id) return comment;

                            return {
                                ...comment,
                                replies: [...(comment.replies || []), newReply],
                            };
                        }),
                    };
                });
            });
        },
        onError: (err) => {
            console.error("Reply failed", err);
        }
    });

    const handleReply = () => {
        if (!replyText.trim()) return;

        mutation.mutate({
            reply: replyText,
            videoid: c.ad_id,
            commentid: c.id,
        });

        setReplyText("");
        setIsReplying(false);
    };

    return (
        <div className="flex gap-3 mb-5">
            <Avatar className="w-10 h-10">
                <AvatarImage src={c.user.avatar} alt={c.user.username} />
                <AvatarFallback>
                    {c.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{c.user.username}</p>
                    <p className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleString()}
                    </p>
                </div>

                <p className="text-sm mt-1">{c.comment}</p>

                <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 text-xs text-muted-foreground w-fit"
                    onClick={() => setIsReplying((prev) => !prev)}
                    disabled={mutation.isPending}
                >
                    Reply
                </Button>

                {isReplying && (
                    <div className="mt-3 flex gap-2">
                        <Textarea
                            placeholder="Write a reply..."
                            className="h-16"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />

                        <Button
                            size="icon"
                            className="h-10 w-10 mt-auto"
                            onClick={handleReply}
                        >
                            <SendHorizonal size={18} />
                        </Button>
                    </div>
                )}

                {c.replies && c.replies.length > 0 && (
                    <div className="mt-3 ml-6 border-l pl-4 space-y-4">
                        {c.replies.map((reply) => (
                            <CommentItem key={reply.id} c={reply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
