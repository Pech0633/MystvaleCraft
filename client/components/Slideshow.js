'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSlides } from '@/redux/storage/promotion';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react'; // ไอคอนจาก lucide-react

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Slideshow() {
  const [slideIndex, setSlideIndex] = useState(0);
  const dispatch = useDispatch();
  const slides = useSelector((state) => state.slides.slides);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (slides.length === 0) {
      const fetchSlides = async () => {
        try {
          const res = await fetch(`${apiUrl}/promotions`);
          const data = await res.json();
          dispatch(setSlides(data));
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      };
      fetchSlides();
    }
  }, [dispatch, slides.length]);

  useEffect(() => {
    const startAutoChange = () => {
      const autoChange = setInterval(() => {
        setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 10000);
      setTimer(autoChange);
    };

    if (slides.length > 1) {
      startAutoChange();
    }

    return () => clearInterval(timer);
  }, [slides]);

  const goToNextSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    resetTimer();
  };

  const goToPreviousSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    resetTimer();
  };

  const resetTimer = () => {
    if (timer) clearInterval(timer);
    setTimer(null);
    const autoChange = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 30000);
    setTimer(autoChange);
  };

  if (slides.length === 0) return null;

  return (
    <div className='p-4'>
      <div className='flex items-center justify-center mb-6'>
        <h2 className='text-3xl font-bold text-white border-b-2 border-gray-300 pb-2 flex items-center gap-2'>
          <Tag className='w-7 h-7 text-white' />
          โปรโมชั่นเติมเงิน
        </h2>
      </div>

      <div className='relative border border-gray-300 max-sm:rounded-2xl sm:rounded-4xl overflow-hidden shadow-md'>
        <img
          src={slides[slideIndex]?.src}
          alt={slides[slideIndex]?.caption}
          className='w-full h-auto object-cover'
        />

        {slides.length > 1 && (
          <>
            <button
              onClick={goToPreviousSlide}
              className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-12 h-12 rounded-full flex items-center justify-center shadow hover:bg-red-500 transition-all duration-300'
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={goToNextSlide}
              className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-red-400 w-12 h-12 rounded-full flex items-center justify-center shadow hover:bg-red-500 transition-all duration-300'
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
