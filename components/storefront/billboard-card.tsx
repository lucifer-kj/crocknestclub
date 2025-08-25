"use client"

import Image from 'next/image'
import { Billboard } from '@prisma/client'

interface BillboardCardProps {
  billboard: Billboard
}

export function BillboardCard({ billboard }: BillboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={billboard.imageUrl}
          alt={billboard.label}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h3 className="text-white text-2xl font-bold text-center px-4">
            {billboard.label}
          </h3>
        </div>
      </div>
    </div>
  )
}
