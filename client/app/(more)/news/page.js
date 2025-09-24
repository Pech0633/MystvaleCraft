'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNews } from '@/redux/storage/news';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const News = () => {
  const items = useSelector(state => state.news.news);

  // เรียง id จากมาก -> น้อย เพื่อให้อันที่ id น้อยที่สุดอยู่ล่างสุด
  const sortedItems = [...items].sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen p-10">
      <ul className="space-y-10 flex flex-col items-center">
        {sortedItems.map(item => (
          <li
            key={item.id}
            className="relative border border-gray-300 rounded-4xl overflow-hidden shadow-md"
          >
            <img
              src={item.Image}
              alt={item.title}
              className="w-full object-cover"
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-2">
              {item.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/50 text-center">
              {item.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
