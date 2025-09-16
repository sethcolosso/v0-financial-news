"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Clock, Users } from "lucide-react"
import Link from "next/link"

const trendingTopics = [
  { topic: "Federal Reserve Rate Cut", mentions: 1250, trend: "up" },
  { topic: "Tesla Earnings", mentions: 890, trend: "up" },
  { topic: "Bitcoin ATH", mentions: 2100, trend: "up" },
  { topic: "Oil Supply Crisis", mentions: 675, trend: "down" },
  { topic: "Tech Stock Rally", mentions: 445, trend: "up" },
]

const recentActivity = [
  { user: "MarketAnalyst", action: "commented on", article: "Fed Rate Decision", time: "2m ago" },
  { user: "CryptoTrader", action: "liked", article: "Bitcoin Surge Analysis", time: "5m ago" },
  { user: "InvestorPro", action: "bookmarked", article: "Tech Earnings Preview", time: "8m ago" },
  { user: "NewsJunkie", action: "shared", article: "Oil Market Update", time: "12m ago" },
]

const topContributors = [
  { name: "Sarah Johnson", points: 2450, level: 8, badge: "Expert Analyst" },
  { name: "Michael Chen", points: 1890, level: 7, badge: "Market Guru" },
  { name: "Alex Rodriguez", points: 1650, level: 6, badge: "Crypto Specialist" },
  { name: "Emma Thompson", points: 1420, level: 6, badge: "Commodities Pro" },
]

export function TrendingSidebar() {
  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <Link
                  href={`/search?q=${encodeURIComponent(item.topic)}`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.topic}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{item.mentions.toLocaleString()} mentions</span>
                  {item.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium text-primary">{activity.user}</span>
                <span className="text-muted-foreground">{activity.action}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <Link href="#" className="text-card-foreground hover:text-primary transition-colors truncate">
                  {activity.article}
                </Link>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{activity.time}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topContributors.map((contributor, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{contributor.name}</span>
                  <Badge variant="outline" className="text-xs">
                    Level {contributor.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{contributor.points.toLocaleString()} points</span>
                  <Badge variant="secondary" className="text-xs">
                    {contributor.badge}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
            View Leaderboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
