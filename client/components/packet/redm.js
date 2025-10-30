"use client"
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { hiderederm } from '@/redux/storage/rederm';
const redm = () => {
  const [code, setCode] = useState('')
  const dispatch = useDispatch();
  const rederm = useSelector((state) => state.rederm.rederm);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (rederm) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [rederm]);

  const handleRedeem = () => {
    if (!code.trim()) {     
      alert('กรุณากรอกโค้ด')
      return
    }
    // Handle redeem logic here
    console.log('Redeeming code:', code)
  }

  // Handle close animation before removing from DOM
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      dispatch(hiderederm());
    }, 300);
  };

  // Don't render if rederm is false
  if (!rederm) return null;

  return (
    <div className={`min-h-screen fixed inset-0 z-50 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      {/* Full-screen blurred background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
      
      {/* Center content */}  
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`max-w-md w-full transition-all duration-500 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
          {/* iOS-style Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">กรอกโค้ด</h2>
              <p className="text-gray-600 text-sm">กรุณากรอกโค้ดที่คุณได้รับ</p>
            </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              โค้ด
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="กรอกโค้ดที่นี่"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Redeem Button */}
          <button
            onClick={handleRedeem}
            disabled={!code.trim()}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              code.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            ใช้โค้ด
          </button>

          {/* Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="text-blue-500 text-xl">ℹ️</div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium">คำแนะนำ</p>
                <p className="text-xs text-gray-600 mt-1">
                  กรอกโค้ดที่ได้รับจากอีเวนต์หรือโปรโมชั่นเพื่อแลกรับรางวัลพิเศษ
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default redm