import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Bell, Settings, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">PQRS System</Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

