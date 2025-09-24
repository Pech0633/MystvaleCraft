'use client';

import React from 'react';
import Slideshow from '@/components/Slideshow';
import News from '@/components/news'; 
import { useDispatch } from 'react-redux';
import Link from 'next/link';

const menuItems = [
  {
    title: 'ร้านค้า',
    subtitle: 'ดูสินค้าทั้งหมด',
    image: '/shop.png',
    href: '/shop',
    alt: 'ร้านค้า',
  },
  {
    title: 'เติมเงิน',
    subtitle: 'สนับสนุนเซิร์ฟเวอร์เราได้ที่นี่',
    image: '/topup.png',
    href: '/topup',
    alt: 'เติมเงิน',
  },
];

const Page = () => {
  const dispatch = useDispatch();

  return (
    <div className='min-h-screen flex flex-col items-center justify-start space-y-4 p-4'>
      <div className="w-[300px] md:w-[400px] lg:w-[500px]">
        <img
          src="/logo2.png"
          alt="Logo"
          className="max-w-full h-auto mt-4"
        />
      </div>
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-center gap-6 mt-8">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="bg-white outline-none group bg-gradient-to-br  rounded-2xl p-7 flex-1 max-w-md flex flex-col justify-between shadow-xl border border-[#232323] hover:border-white/30 hover:shadow-blue-400/30 transition-all duration-200 relative overflow-hidden"
            style={{ minHeight: 200 }}
          >
            <div>
              <div className="text-blue-400 font-extrabold text-xl drop-shadow-sm group-hover:underline">{item.title}</div>
              <div className="text-black text-base mt-2">{item.subtitle}</div>
            </div>
            <img
              src={item.image}
              alt={item.alt}
              className="w-28 h-28 self-end mt-4 transition-transform duration-200 group-hover:scale-110 drop-shadow-lg"
            />
            {/* เพิ่ม effect แสง */}
            <div className="absolute inset-0 pointer-events-none group-hover:bg-blue-400/5 transition-colors duration-200 rounded-2xl" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
