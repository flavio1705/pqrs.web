import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface MetadataItem {
  label: string
  value: string | number | React.ReactNode
}

interface MetadataCardProps {
  title: string
  description?: string
  items: MetadataItem[]
}

export function MetadataCard({ title, description, items }: MetadataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.label}>
              {index > 0 && <Separator className="my-2" />}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

