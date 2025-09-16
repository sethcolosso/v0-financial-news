"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Flame, Crown, Medal, Award } from "lucide-react"

interface LeaderboardTabsProps {
  topByPoints: any[]
  topByLevel: any[]
  topByStreak: any[]
  currentUser: any
}

export function LeaderboardTabs({ topByPoints, topByLevel, topByStreak, currentUser }: LeaderboardTabsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Award className="h-5 w-5 text-orange-500" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
    }
  }

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case 1:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case 2:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const LeaderboardList = ({ users, metric }: { users: any[]; metric: "points" | "level" | "streak_days" }) => {
    const getMetricIcon = () => {
      switch (metric) {
        case "points":
          return <Trophy className="h-4 w-4" />
        case "level":
          return <Star className="h-4 w-4" />
        case "streak_days":
          return <Flame className="h-4 w-4" />
      }
    }

    const getMetricLabel = () => {
      switch (metric) {
        case "points":
          return "Points"
        case "level":
          return "Level"
        case "streak_days":
          return "Day Streak"
      }
    }

    return (
      <div className="space-y-4">
        {users.map((user, index) => (
          <Card
            key={user.id}
            className={`transition-all duration-200 ${
              currentUser && user.user_id === currentUser.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12">{getRankIcon(index)}</div>

                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.profiles?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {getInitials(user.profiles?.display_name || user.profiles?.username || "U")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-card-foreground truncate">
                      {user.profiles?.display_name || user.profiles?.username}
                    </h3>
                    {currentUser && user.user_id === currentUser.id && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">@{user.profiles?.username}</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary">
                    {getMetricIcon()}
                    <span className="text-xl font-bold">
                      {metric === "points" ? user[metric].toLocaleString() : user[metric]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{getMetricLabel()}</p>
                </div>

                <Badge className={getRankBadgeColor(index)}>#{index + 1}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No rankings available yet</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Community Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="points" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Points
            </TabsTrigger>
            <TabsTrigger value="level" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Level
            </TabsTrigger>
            <TabsTrigger value="streak" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Streak
            </TabsTrigger>
          </TabsList>

          <TabsContent value="points">
            <LeaderboardList users={topByPoints} metric="points" />
          </TabsContent>

          <TabsContent value="level">
            <LeaderboardList users={topByLevel} metric="level" />
          </TabsContent>

          <TabsContent value="streak">
            <LeaderboardList users={topByStreak} metric="streak_days" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
