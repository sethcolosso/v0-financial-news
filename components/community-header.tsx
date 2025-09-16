"use client"
import { Users, MessageCircle, TrendingUp } from "lucide-react"

export function CommunityHeader() {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-card-foreground">Community Hub</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow traders and investors. Share insights, discuss market trends, and learn from the
            community.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <MessageCircle className="h-5 w-5" />
                <span className="text-2xl font-bold">5.2K</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Discussions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Users className="h-5 w-5" />
                <span className="text-2xl font-bold">12.8K</span>
              </div>
              <p className="text-sm text-muted-foreground">Community Members</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <TrendingUp className="h-5 w-5" />
                <span className="text-2xl font-bold">98%</span>
              </div>
              <p className="text-sm text-muted-foreground">Positive Sentiment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
