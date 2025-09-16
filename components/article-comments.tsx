"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Reply, Flag, MoreHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  parent_id: string | null
  like_count: number
  profiles: {
    username: string
    display_name: string
    avatar_url: string | null
  }
}

interface ArticleCommentsProps {
  articleId: string
  user: any
}

export function ArticleComments({ articleId, user }: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq("article_id", articleId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Failed to load comments")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        user_id: user.id,
        content: newComment.trim(),
        parent_id: null,
      })

      if (error) throw error
      setNewComment("")
      await fetchComments()
      toast.success("Comment posted!")
    } catch (error) {
      console.error("Error posting comment:", error)
      toast.error("Failed to post comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!replyContent.trim()) return

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        user_id: user.id,
        content: replyContent.trim(),
        parent_id: parentId,
      })

      if (error) throw error
      setReplyContent("")
      setReplyTo(null)
      await fetchComments()
      toast.success("Reply posted!")
    } catch (error) {
      console.error("Error posting reply:", error)
      toast.error("Failed to post reply")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const supabase = createClient()
    // Implementation for liking comments would go here
    toast.success("Comment liked!")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const topLevelComments = comments.filter((comment) => !comment.parent_id)
  const getReplies = (parentId: string) => comments.filter((comment) => comment.parent_id === parentId)

  return (
    <div id="comments-section" className="mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Discussion ({comments.length})</span>
            <Badge variant="outline">{topLevelComments.length} comments</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{getInitials(user.email.split("@")[0])}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your thoughts on this article..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground mb-4">Sign in to join the discussion</p>
                <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {topLevelComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profiles?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {getInitials(comment.profiles?.display_name || comment.profiles?.username || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {comment.profiles?.display_name || comment.profiles?.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-card-foreground leading-relaxed">{comment.content}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.id)}
                          className="h-7 px-2 text-xs"
                        >
                          <Heart className="h-3 w-3 mr-1" />
                          {comment.like_count || 0}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          className="h-7 px-2 text-xs"
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Flag className="h-3 w-3 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyTo === comment.id && user && (
                    <div className="ml-11 space-y-3">
                      <div className="flex gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{getInitials(user.email.split("@")[0])}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px] resize-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyTo(null)
                            setReplyContent("")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={isSubmitting || !replyContent.trim()}
                        >
                          {isSubmitting ? "Posting..." : "Reply"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className="ml-11 flex gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.profiles?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {getInitials(reply.profiles?.display_name || reply.profiles?.username || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">
                            {reply.profiles?.display_name || reply.profiles?.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-card-foreground leading-relaxed">{reply.content}</p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeComment(reply.id)}
                            className="h-6 px-2 text-xs"
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            {reply.like_count || 0}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
