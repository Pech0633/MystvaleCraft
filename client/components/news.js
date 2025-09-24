'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';

const News = () => {
  const items = useSelector(state => state.news.news); 

  return (
    (items.length !== 0 && (
      <div>
        <div className='flex items-center justify-center mb-6'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white border-b-2 border-gray-300 pb-2 flex items-center gap-3'>
            <Newspaper className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white' />
            ข่าว
          </h2>
        </div>

        <ul className="relative border border-gray-300 rounded-4xl overflow-hidden shadow-md">
          {items
            .filter(item => item.id === 1)
            .map(item => (
              <li key={item.id}>
                <img
                  src={item.Image}
                  alt={item.title}
                  className="object-cover rounded-2xl mb-4"
                />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                  {item.title}
                </h2>
                <p className="text-base sm:text-lg text-white/50 text-center">
                  {item.text}
                </p>
                <div className="flex">
                  <Link
                    href='/news'
                    className="ml-auto mr-10 flex border border-gray-300 px-4 py-2 rounded-2xl text-white text-center text-sm sm:text-base hover:scale-[1.05]"
                  >
                    อ่านเพิ่มเติม
                  </Link>
                </div>
              </li>
            ))}
        </ul>
      </div>
    ))
  );
};

export default News;
