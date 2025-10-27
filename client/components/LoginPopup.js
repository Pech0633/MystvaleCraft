'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showlogin } from '@/redux/storage/LoginSlice';
import { login } from '@/redux/userSlice';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPopup({ isOpen }) {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }
  const dispatch = useDispatch();

  const toggleLogin = () => dispatch(showlogin(false));

  // ฟังก์ชันแสดง toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000); // หายเอง 3 วินาที
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (data.status) {
        // ตั้งค่า Cookie แบบปลอดภัยสำหรับ HTTPS
        Cookies.set('token', data.data, { 
          expires: 1,
          secure: true,      // ส่งผ่าน HTTPS เท่านั้น
          sameSite: 'strict' // ป้องกัน CSRF
        });
        dispatch(login(data.user));
        showToast('success', 'เข้าสู่ระบบสำเร็จ');
        toggleLogin();
      } else {
        showToast('error', data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Toast กลางหน้าจอ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        z-[9999] px-6 py-4 rounded-xl shadow-lg font-semibold text-center
                        text-sm w-72 flex items-center justify-center gap-3 ${
                          toast.type === 'success'
                            ? 'bg-white text-black'
                            : 'bg-black text-white'
                        }`}
          >
            <span className="text-lg">
              {toast.type === 'success' ? '✓' : '✕'}
            </span>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        className="fixed inset-0 flex items-center justify-center z-40 bg-black/40 backdrop-blur-sm p-4"
      >
        <div className="relative w-full max-w-md p-6 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* ปุ่มปิด */}
          <button
            className="absolute top-3 right-3 text-white hover:text-gray-200"
            onClick={toggleLogin}
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">
            เข้าสู่ระบบ
          </h2>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white drop-shadow">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                className="w-full border border-white/30 rounded-lg px-3 py-2 bg-white/20 text-white
                           placeholder-white/70 focus:ring-2 focus:ring-white outline-none"
                placeholder="กรอกชื่อผู้ใช้..."
                required
              />
            </div>

            {/* Password */}
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="flex-1 border border-white/30 rounded-lg px-3 py-2 bg-white/20 text-white
                           placeholder-white/70 focus:ring-2 focus:ring-white outline-none"
                placeholder="กรอกรหัสผ่าน..."
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 w-10 h-10 flex items-center justify-center
                           rounded-full bg-white/20 backdrop-blur-md border border-white/30
                           text-white hover:bg-white/30 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full rounded-lg py-2 font-medium transition
                         ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-white/40 hover:bg-white/60 text-black'}`}
              disabled={isLoading}
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
