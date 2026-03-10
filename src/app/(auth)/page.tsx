import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Building2, Users, FileBadge, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your compliance metrics.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Legal Entities
            </CardTitle>
            <Building2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">+2 since last month</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Filings
            </CardTitle>
            <FileBadge className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-muted-foreground text-xs">4 due this week</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-muted-foreground text-xs">+12 new users</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tax Credits Active
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124.5k</div>
            <p className="text-muted-foreground text-xs">+19% from last year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 transition-shadow duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              You have 12 notifications and updates today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Placeholder for activity feeding */}
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm leading-none font-medium">
                    Filing Appoved for Legal Entity A
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Tax filing #12345 approved by admin.
                  </p>
                </div>
                <div className="text-muted-foreground ml-auto text-sm font-medium">
                  Just now
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm leading-none font-medium">
                    New User Added
                  </p>
                  <p className="text-muted-foreground text-sm">
                    John Doe joined as DSTax Preparer.
                  </p>
                </div>
                <div className="text-muted-foreground ml-auto text-sm font-medium">
                  1h ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 transition-shadow duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Items requiring attention this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Q3 Tax Return</p>
                  <p className="text-muted-foreground text-sm">
                    Entity B - Overdue
                  </p>
                </div>
                <div className="text-sm font-medium text-red-500">Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
