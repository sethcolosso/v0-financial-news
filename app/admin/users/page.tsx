import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { UsersTable } from "@/components/users-table"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Fetch all users with their profiles and points
  const { data: users, error } = await supabase
    .from("profiles")
    .select(`
      *,
      user_points (
        points,
        level,
        streak_days
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("Error fetching users:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-card-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        <UsersTable users={users || []} />
      </div>
    </div>
  )
}
