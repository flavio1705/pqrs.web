'use client'

import React from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Status } from './Status'
import { QuickStats } from './QuickStats'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface PQRS {
  id: number
  type: string
  status: 'pending' | 'in-progress' | 'resolved' | 'closed'
  created_at: string
  updated_at: string
  identifier: string
  is_anonymous: number
  // Add other fields as necessary
}
interface DashboardProps {
  data: PQRS[];
}

export function Dashboard({ data }: DashboardProps) {
  const statusCounts = data.reduce((acc, pqrs) => {
    acc[pqrs.type] = (acc[pqrs.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const typeCounts = data.reduce((acc, pqrs) => {
    acc[pqrs.type] = (acc[pqrs.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const monthlyData = data.reduce((acc, pqrs) => {
    const date = new Date(pqrs.created_at)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
    acc[monthYear] = (acc[monthYear] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  console.log('statusCounts',statusCounts,data)
  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ['#FFA500', '#4169E1', '#32CD32', '#A9A9A9'],
      },
    ],
  }

  const typeChartData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: 'PQRS by Type',
        data: Object.values(typeCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }
  console.log('monthlyData',monthlyData)

  const monthlyChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'PQRS per Month',
        data: Object.values(monthlyData),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  const totalPQRS = data.length
  const anonymousPQRS = data.filter(pqrs => pqrs.is_anonymous === 1).length
  const identifierPQRS = data.filter(pqrs => pqrs.is_anonymous === 0).length

  // Calculate the actual percentage increase from last month
  const currentDate = new Date()
  const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  const thisMonthPQRS = data.filter(pqrs => new Date(pqrs.created_at || pqrs.updated_at) >= lastMonthDate).length
  const previousMonthPQRS = totalPQRS - thisMonthPQRS
  const percentageIncrease = previousMonthPQRS > 0 
    ? ((thisMonthPQRS - previousMonthPQRS) / previousMonthPQRS) * 100 
    : 100 // If there were no PQRS last month, we consider it a 100% increase

  // Calculate average response time
  const currentDate2 = new Date();
  const avgResponseTime = data.reduce((sum, pqrs) => {
    const createdDate = new Date(pqrs.created_at || pqrs.updated_at);
    const updatedDate = new Date(pqrs.updated_at || pqrs.created_at);

    // If the PQRS hasn't been updated, use the current date
    const lastDate = updatedDate > createdDate ? updatedDate : currentDate2;

    // Calculate the difference in days
    const diffTime = Math.abs(lastDate.getTime() - createdDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return sum + diffDays;
  }, 0) / totalPQRS;


  // Calculate active users (assuming unique identifiers represent users)
  const activeUsers = new Set(data.map(pqrs => pqrs.identifier)).size
  const lastMonthActiveUsers = new Set(
    data
      .filter(pqrs => new Date(pqrs.created_at) < lastMonthDate)
      .map(pqrs => pqrs.identifier)
  ).size
  const activeUsersChange = lastMonthActiveUsers > 0
    ? ((activeUsers - lastMonthActiveUsers) / lastMonthActiveUsers) * 100
    : (activeUsers > 0 ? 100 : 0) // If there were no users last month, we consider it a 100% increase if there are users now, or 0% if there are still no users

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">PQRS Dashboard</h1>
      
      <QuickStats
        totalPQRS={totalPQRS}
        anonymousPQRS={anonymousPQRS}
        identifierPQRS={identifierPQRS}
        // averageResponseTime={avgResponseTime}
        activeUsers={activeUsers}
        percentageIncrease={percentageIncrease}
        activeUsersChange={activeUsersChange}
      />

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PQRS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{status}</CardTitle>
              <Status status={status as 'pending' | 'in-progress' | 'resolved' | 'closed'} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>PQRS by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={statusChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PQRS by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={typeChartData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PQRS Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={monthlyChartData} />
        </CardContent>
      </Card>
    </div>
  )
}

