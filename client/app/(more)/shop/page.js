'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Page = () => {
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/get`)
        const data = await res.json()
        setMenuItems(data)
      } catch (error) {
        console.error('Error fetching menu items:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="py-12 px-4"> 
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {menuItems.map((item, index) => {
          const imageSrc =
            item.image && item.image.startsWith('http')
              ? item.image
              : '/placeholder.png'

          return (
            <Link
              key={index}
              href={`/product/${item.href}`}
              className="glass-white rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.05] p-6 flex flex-col items-center text-center hover:border-white/50"
            >
              <div className="w-32 h-32 mb-4">
                <Image
                  src={imageSrc}
                  alt={item.name || 'no-name'}
                  width={128}
                  height={128}
                  className="rounded-md"
                  unoptimized // ป้องกัน error จาก external URL
                />
              </div>
              <div className="text-2xl font-extrabold text-white drop-shadow-lg">{item.name}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Page
