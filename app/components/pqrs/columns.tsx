"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
// import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export type PQRS = {
  id: number
  type: string
  details: string
  attachments: string
  is_anonymous: number
  identifier: string
  phone_number: string
  subject: string
  location: string
  tracking_number: string
  timestamp: string
  created_at: string
  updated_at: string
  status?: 'pending' | 'in-progress' | 'resolved' | 'closed'
}

export const columns: ColumnDef<PQRS>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tracking_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tracking Number" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("tracking_number")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("type")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
    cell: ({ row }) => <div className="max-w-[500px] truncate">{row.getValue("subject")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as PQRS["status"] || "pending"
      
      return (
        <Badge variant="secondary" className={
          status === "resolved" ? "bg-green-100 text-green-800" :
          status === "in-progress" ? "bg-blue-100 text-blue-800" :
          status === "closed" ? "bg-gray-100 text-gray-800" :
          "bg-yellow-100 text-yellow-800"
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">
        {new Date(row.getValue("created_at")).toLocaleDateString()}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

