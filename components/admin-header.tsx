"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Users, FileText, BarChart3, Bell, Home } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-card-foreground">Admin Dashboard</h1>
              <Badge variant="secondary" className="ml-2">
                Beta
              </Badge>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </Link>
              <Link
                href="/admin/articles"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                Articles
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">2</Badge>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Site
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
