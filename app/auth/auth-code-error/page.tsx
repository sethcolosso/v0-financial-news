import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, TrendingUp } from "lucide-react"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">FinanceHub</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>There was a problem confirming your email address</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>The confirmation link may have expired or been used already.</p>
              <p>Please try signing up again or contact support if the problem persists.</p>
            </div>

            <div className="pt-4 space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/signup">Try Again</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/auth/login">Sign In Instead</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
