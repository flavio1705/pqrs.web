import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, UserX } from 'lucide-react'

interface QuickStatsProps {
  totalPQRS: number
  anonymousPQRS: number
  identifierPQRS:number
  // averageResponseTime: number
  activeUsers: number
  percentageIncrease: number
  activeUsersChange: number
}

export function QuickStats({ 
  totalPQRS, 
  anonymousPQRS, 
  identifierPQRS,
  // averageResponseTime, 
  activeUsers, 
  percentageIncrease,
  activeUsersChange
}: QuickStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total PQRS</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPQRS}</div>
          <p className="text-xs text-muted-foreground">
            {percentageIncrease >= 0 ? '+' : '-'}
            {Math.abs(percentageIncrease).toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Identifier PQRS</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{identifierPQRS}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((identifierPQRS / totalPQRS) * 100)}% of total PQRS
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Anonymous PQRS</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{anonymousPQRS}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((anonymousPQRS / totalPQRS) * 100)}% of total PQRS
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {activeUsersChange === Infinity
              ? "New users this month"
              : activeUsersChange === 0 && activeUsers === 0
              ? "No users yet"
              : `${activeUsersChange >= 0 ? '+' : '-'}${Math.abs(activeUsersChange).toFixed(1)}% from last month`
            }
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

