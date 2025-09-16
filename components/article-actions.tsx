"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Bookmark, Share2, MessageCircle, Flag } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ArticleActionsProps {
  article: any
  user: any
  initialLiked: boolean
  initialBookmarked: boolean
}

export function ArticleActions({ article, user, initialLiked, initialBookmarked }: ArticleActionsProps) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100) + 10)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase.from("user_likes").delete().eq("user_id", user.id).eq("article_id", article.id)

        if (error) throw error
        setIsLiked(false)
        setLikeCount((prev) => prev - 1)
        toast.success("Like removed")
      } else {
        // Add like
        const { error } = await supabase.from("user_likes").insert({
          user_id: user.id,
          article_id: article.id,
        })

        if (error) throw error
        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
        toast.success("Article liked!")
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update like")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("user_bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", article.id)

        if (error) throw error
        setIsBookmarked(false)
        toast.success("Bookmark removed")
      } else {
        // Add bookmark
        const { error } = await supabase.from("user_bookmarks").insert({
          user_id: user.id,
          article_id: article.id,
        })

        if (error) throw error
        setIsBookmarked(true)
        toast.success("Article bookmarked!")
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast.error("Failed to update bookmark")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const scrollToComments = () => {
    const commentsSection = document.getElementById("comments-section")
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Card className="my-8">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              disabled={isLoading}
              className={isLiked ? "text-red-500 border-red-500" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
              {likeCount}
            </Button>

            <Button variant="outline" size="sm" onClick={scrollToComments}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Comments
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
              disabled={isLoading}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>

            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
