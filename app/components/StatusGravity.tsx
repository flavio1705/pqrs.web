import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusProps {
  status: 'Baja' | 'Media' | 'Alta'
}

const statusConfig = {
  'Baja': { label: 'Low', class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  'Media': { label: 'Medium', class: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  'Alta': { label: 'High', class: 'bg-green-100 text-green-800 hover:bg-green-100' },
}

export function StatusGravity({ status }: StatusProps) {
  const config = statusConfig[status] || statusConfig['Baja'] // Fallback to 'pending' if status is not recognized

  return (
    <Badge variant="secondary" className={cn("text-xs font-semibold", config.class)}>
      Severity level: {config.label}
    </Badge>
  )
}