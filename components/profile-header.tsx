"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Globe, Twitter, Linkedin, Calendar, Edit } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ProfileHeaderProps {
  user: any
  profile: any
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getExperienceColor = (level: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      expert: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    }
    return colors[level as keyof typeof colors] || colors.beginner
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.display_name || user.email} />
              <AvatarFallback className="text-lg">
                {getInitials(profile?.display_name || user.email.split("@")[0])}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">
                  {profile?.display_name || user.email.split("@")[0]}
                </h1>
                <p className="text-muted-foreground">@{profile?.username || user.email.split("@")[0]}</p>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {profile?.bio && <p className="text-card-foreground">{profile.bio}</p>}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              )}
              {profile?.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Website
                  </a>
                </div>
              )}
              {profile?.twitter_handle && (
                <div className="flex items-center gap-1">
                  <Twitter className="h-4 w-4" />
                  <a
                    href={`https://twitter.com/${profile.twitter_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    @{profile.twitter_handle}
                  </a>
                </div>
              )}
              {profile?.linkedin_url && (
                <div className="flex items-center gap-1">
                  <Linkedin className="h-4 w-4" />
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {formatDistanceToNow(new Date(profile?.created_at || user.created_at), { addSuffix: true })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile?.experience_level && (
                <Badge className={getExperienceColor(profile.experience_level)}>
                  {profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1)}
                </Badge>
              )}
              {profile?.interests?.map((interest: string) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
