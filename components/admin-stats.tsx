"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, MessageCircle, Heart, TrendingUp, TrendingDown } from "lucide-react"

interface AdminStatsProps {
  totalUsers: number
  totalArticles: number
  totalComments: number
  totalLikes: number
}

export function AdminStats({ totalUsers, totalArticles, totalComments, totalLikes }: AdminStatsProps) {
  // Mock growth data - in real app, calculate from historical data
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Total Articles",
      value: totalArticles.toLocaleString(),
      change: "+8%",
      trend: "up",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Total Comments",
      value: totalComments.toLocaleString(),
      change: "+24%",
      trend: "up",
      icon: MessageCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Total Likes",
      value: totalLikes.toLocaleString(),
      change: "-3%",
      trend: "down",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
        const trendColor = stat.trend === "up" ? "text-green-600" : "text-red-600"

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                <span className={`text-xs ${trendColor}`}>{stat.change}</span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
