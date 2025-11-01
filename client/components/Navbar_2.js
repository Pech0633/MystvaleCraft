'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/userSlice';
import { showlogin } from '@/redux/storage/LoginSlice';
import Cookies from 'js-cookie';
import Link from 'next/link';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function Navbar() {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.login.isLogin);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setActivePage(pathname); // เก็บ path ทั้งหมดตรงๆ
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    fetch(`${apiUrl}/user/${token}`)
      .then(res => res.json())
      .then(data => {
        dispatch(login(data.data));
      })
      .catch(err => console.error('Failed to fetch user info:', err));
  }, [dispatch]);

  const navItems = [
    { href: '/backend', name: 'backend' },
    { href: '/backend/promotions', name: 'promotions' },
    { href: '/backend/user', name: 'user' },
    { href: '/backend/code', name: 'code' }
  ];

  const toggleProfileMenu = () => {
    dispatch(showlogin(!isLogin));
  };

  return (
    <>
    <div className="" />  {/* Spacer for fixed navbar */}
      {/* Desktop Navbar */}
      <nav className="hidden sm:flex relative top-2 left-1/2 transform -translate-x-1/2 p-1 flex-row space-x-2 border border-[#444] rounded-2xl overflow-hidden max-w-fit ">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition rounded-2xl whitespace-nowrap
              ${activePage === item.href
                ? 'bg-[#3b3b3b] text-white ring-2 ring-[#777]'
                : 'text-black hover:bg-[#2d2d2d] hover:ring-2 hover:ring-[#777]'}`}
          >
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Navbar */}
      <div className="sm:hidden fixed top-4 left-4 right-4 z-50 px-4">
        <div className="flex justify-between bg-[#222] p-2 rounded-2xl shadow-md border border-[#444]">
          <button
            className="p-2 rounded-full text-white hover:bg-[#333]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden fixed top-0 left-0 w-full h-full bg-[#111] z-40 flex flex-col items-center justify-center space-y-6">
          {/* หน้าแรก */}
          <Link
            href="/"
            className={`flex items-center gap-3 text-white text-xl px-4 py-3 rounded 
              ${activePage === '/' ? 'bg-[#3b3b3b] ring-2 ring-[#777]' : 'hover:bg-[#2d2d2d]'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home size={24} />
            <span>หน้าแรก</span>
          </Link>

          {/* ลิงก์อื่นๆ */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 text-white text-xl px-4 py-3 rounded 
                ${activePage === item.href
                  ? 'bg-[#3b3b3b] ring-2 ring-[#777]'
                  : 'hover:bg-[#2d2d2d]'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
