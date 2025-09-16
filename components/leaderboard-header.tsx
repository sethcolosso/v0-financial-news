"use client"

import { Trophy, Medal, Crown } from "lucide-react"

interface LeaderboardHeaderProps {
  userRanking: any
}

export function LeaderboardHeader({ userRanking }: LeaderboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-card-foreground">Leaderboard</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how you rank against other members of the FinanceHub community. Compete for the top spots!
          </p>

          {userRanking && (
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Medal className="h-6 w-6" />
                  <span className="text-3xl font-bold">#{userRanking.rank}</span>
                </div>
                <p className="text-sm text-muted-foreground">Your Rank</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Trophy className="h-6 w-6" />
                  <span className="text-3xl font-bold">{userRanking.points.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">Your Points</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Crown className="h-6 w-6" />
                  <span className="text-3xl font-bold">{userRanking.level}</span>
                </div>
                <p className="text-sm text-muted-foreground">Your Level</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
