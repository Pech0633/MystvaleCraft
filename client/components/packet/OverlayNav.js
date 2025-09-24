'use client';

import { useState } from 'react';
import Link from 'next/link';

const OverlayNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <div className='md:hidden'>
        <button onClick={openNav} className='rounded bg-[#FAE9E9]/80 w-12 h-10 flex flex-col items-center justify-center border-4 border-[#DF7272]'>
            <div className='w-[16px] h-[2px] bg-black my-[2px]'></div>
            <div className='w-[16px] h-[2px] bg-black my-[2px]'></div>
            <div className='w-[16px] h-[2px] bg-black my-[2px]'></div>
        </button>

      <div
        className={`fixed inset-0 bg-[#FFBEBE] bg-opacity-90 transition-all duration-500 ${isOpen ? 'w-full' : 'w-0'} overflow-hidden z-100`}
      >
        <a href="javascript:void(0)" className="absolute top-5 right-10 text-5xl text-white" onClick={closeNav}>
          &times;
        </a>

        <div className="flex flex-col items-center justify-center h-full">
          <Link href="/test" className="text-2xl text-black hover:text-white py-2">หน้าแรก</Link>
          <Link href="#" className="text-2xl text-black hover:text-white py-2">ข่าวสาร</Link>
          <Link href="#" className="text-2xl text-black hover:text-white py-2">คู่มือ</Link>
          <Link href="#" className="text-2xl text-black  hover:text-white py-2">ร้านค้า</Link>
          <Link href="#" className="text-2xl text-black hover:text-white py-2">อันดับ</Link>
        </div>
      </div>
    </div>
  );
};

export default OverlayNav;
