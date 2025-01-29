"use client"

import { Row } from "@tanstack/react-table"
import { Copy, MoreHorizontal, View } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PQRS } from "./columns"

interface DataTableRowActionsProps {
  row: Row<PQRS>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const router = useRouter()
  const pqrs = row.original

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(pqrs.tracking_number)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => router.push(`/pqrs/${pqrs.id}`)}>
        <View className="mr-2 h-4 w-4" />
          View PQRS
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyTrackingNumber}>
          <Copy className="mr-2 h-4 w-4" />
          Copy ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}