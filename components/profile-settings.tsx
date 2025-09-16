"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Bell, Shield, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ProfileSettingsProps {
  user: any
  profile: any
}

export function ProfileSettings({ user, profile }: ProfileSettingsProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Notifications</Label>
          </div>
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm">
                Email notifications
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="comment-notifications" className="text-sm">
                Comment replies
              </Label>
              <Switch id="comment-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="like-notifications" className="text-sm">
                Article likes
              </Label>
              <Switch id="like-notifications" />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Privacy</Label>
          </div>
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="public-profile" className="text-sm">
                Public profile
              </Label>
              <Switch id="public-profile" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-activity" className="text-sm">
                Show activity
              </Label>
              <Switch id="show-activity" defaultChecked />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-4 border-t space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
