'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, DollarSign, BarChart2, User, Menu, X, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { showlogin } from '@/redux/storage/LoginSlice';
import { login as loginAction } from '@/redux/userSlice';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import LoginPopup from './LoginPopup';
import Kl from './packet/kl';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function Navbar() {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBackendUser, setIsBackendUser] = useState(false);

  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.login.isLogin);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const route = pathname.split('/')[1] || 'home';
    setActivePage(route);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;
    fetch(`${apiUrl}/user/${token}`)
      .then(res => res.json())
      .then(data => dispatch(loginAction(data.data)))
      .catch(err => console.error(err));
  }, [dispatch]);

  useEffect(() => {
    const fetchBackendAccess = async () => {
      try {
        const res = await fetch(`${apiUrl}/backend`);
        const data = await res.json();
        const found = data.find(
          entry => entry.name?.trim().toLowerCase() === user?.username?.trim().toLowerCase()
        );
        setIsBackendUser(!!found);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.username) fetchBackendAccess();
  }, [user?.username]);

  const navItems = [
    { href: '/', name: 'หน้าแรก', id: 'home', icon: <Home size={20} /> },
    { href: '/shop', name: 'ร้านค้า', id: 'shop', icon: <ShoppingCart size={20} /> },
    { href: '/topup', name: 'เติมเงิน', id: 'topup', icon: <DollarSign size={20} /> },
    { href: '/top', name: 'อันดับ', id: 'top', icon: <BarChart2 size={20} /> },
  ];

  // กดปุ่ม User เพื่อเปิด Popup
  const toggleProfileMenu = () => dispatch(showlogin(!isLogin));

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden sm:flex fixed top-4 left-1/2 transform -translate-x-1/2
        px-2 py-1 flex-row space-x-2 border border-black rounded-2xl
        bg-white/70 backdrop-blur-md shadow-xl z-50">
        {navItems.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition rounded-2xl whitespace-nowrap
              ${activePage === item.id ? 'bg-black text-white ring-2 ring-gray-400' : 'text-black hover:bg-gray-100/70'}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
        {isBackendUser && (
          <Link href="/backend" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-black hover:bg-gray-100/70 rounded-2xl">
            <Shield size={20} />
            หลังบ้าน
          </Link>
        )}
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl
            ${isLogin ? 'bg-black text-white ring-2 ring-gray-400' : 'text-black hover:bg-gray-100/70'}`}
          onClick={toggleProfileMenu}
        >
          <User size={20} />
        </button>
      </nav>

      {/* Mobile Bottom Navbar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe">
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-md border-t border-black p-2 rounded-t-2xl shadow-xl">
          <button
            className="p-2 rounded-full text-black hover:bg-gray-100/70"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button
            className={`p-2 rounded-full ${isLogin ? 'bg-black text-white ring-2 ring-gray-400' : 'text-black hover:bg-gray-100/70'}`}
            onClick={toggleProfileMenu}
          >
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobileMenuSlide"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur-md rounded-t-3xl shadow-2xl p-6"
            style={{ height: '30vh' }}
          >
            <div className="w-12 h-1.5 bg-gray-400 rounded-full mx-auto mb-4"></div>
            <div className="grid grid-cols-4 gap-4">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-col items-center justify-center text-black text-lg rounded-xl shadow hover:shadow-md transition bg-white aspect-square"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="mt-2">{item.name}</span>
                </Link>
              ))}
              {isBackendUser && (
                <Link
                  href="/backend"
                  className="flex flex-col items-center justify-center text-white text-lg rounded-xl shadow hover:shadow-md transition bg-black aspect-square"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield size={24} />
                  <span className="mt-2">หลังบ้าน</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login / Kl Popup */}
      <AnimatePresence>
        {isLogin && (
          user.id !== -1 ? (
            <Kl key="klPopup" />
          ) : (
            <LoginPopup key="loginPopup" isOpen={true} />
          )
        )}
      </AnimatePresence>
    </>
  );
}
