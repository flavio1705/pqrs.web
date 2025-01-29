import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusProps {
  status: 'pending' | 'in-progress' | 'resolved' | 'closed'
}

const statusConfig = {
  'pending': { label: 'Pending', class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  'in-progress': { label: 'In Progress', class: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  'resolved': { label: 'Resolved', class: 'bg-green-100 text-green-800 hover:bg-green-100' },
  'closed': { label: 'Closed', class: 'bg-gray-100 text-gray-800 hover:bg-gray-100' }
}

export function Status({ status }: StatusProps) {
  const config = statusConfig[status] || statusConfig['pending'] // Fallback to 'pending' if status is not recognized

  return (
    <Badge variant="secondary" className={cn("text-xs font-semibold", config.class)}>
      {config.label}
    </Badge>
  )
}