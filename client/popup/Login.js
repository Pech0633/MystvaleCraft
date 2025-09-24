'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { showlogin } from '@/redux/storage/LoginSlice';
import { login } from '@/redux/userSlice';
import Loader from '@/components/Loader';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/login`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.status) {
        Cookies.set('token', data.data, {
          expires: 1,
          secure: true,
          sameSite: 'strict',
        });
        dispatch(login(data.user));
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: data.message,
        });
        dispatch(showlogin(false));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: data.error,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const OffLoginClick = () => {
    dispatch(showlogin(false));
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-60">
        <form
          onSubmit={handleSubmit}
          className="relative bg-black/70 text-white border-2 border-gray-500 p-6 rounded-md shadow-lg flex flex-col gap-5 items-start justify-center"
        >
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-600 hover:text-white"
            onClick={OffLoginClick}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-white font-bold text-xl mb-4">เข้าสู่ระบบ</div>

          <input
            name="username"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[250px] h-[40px] rounded-md border-2 border-gray-400 text-white shadow-inner px-3 py-2 text-sm font-medium focus:outline-none focus:border-black"
            required
          />

          <div className="relative w-full">
            <input
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[250px] h-[40px] rounded-md border-2 border-gray-400 text-white shadow-inner px-3 py-2 text-sm font-medium focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-12 mx-auto w-[120px] h-[40px] rounded-md border-2 text-white font-semibold hover:bg-blue-700 hover:text-white transition duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
