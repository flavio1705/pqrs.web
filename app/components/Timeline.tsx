import React from 'react'
import { Circle } from 'lucide-react'

interface TimelineItem {
  date: string
  title: string
  description: string
}

interface TimelineProps {
  items: TimelineItem[]
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {items.map((item, index) => (
        <div key={index} className="mb-8 flex justify-between items-center w-full">
          <div className="order-1 w-5/12"></div>
          <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
            <Circle className="w-4 h-4 mx-auto text-white" />
          </div>
          <div className="order-1 bg-gray-100 rounded-lg shadow-xl w-5/12 px-6 py-4">
            <h3 className="mb-3 font-bold text-gray-800 text-xl">{item.title}</h3>
            <p className="text-sm leading-snug tracking-wide text-gray-600 text-opacity-100">{item.description}</p>
            <p className="mt-2 text-xs text-gray-500">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}