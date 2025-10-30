'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt, FaKey } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { logout } from '@/redux/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Gift } from 'lucide-react';
import { showrederm, hiderederm } from '@/redux/storage/rederm';

const Kl = () => {
  const user = useSelector((state) => state.user);
  const [menuVisible, setMenuVisible] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword1, setOldPassword1] = useState('');
  const [oldPassword2, setOldPassword2] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState({ old1: false, old2: false, newP: false });
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();

  // ✅ เช็กว่ามือถือหรือไม่
  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640;

  const handleLogout = () => {
    Cookies.remove('token');
    dispatch(logout());
  };

  const togglePassword = (field) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChangePassword = async () => {
    if (oldPassword1 !== oldPassword2) {
      showToast('error', 'รหัสผ่านเก่าไม่ตรงกัน');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/editpassworld`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          oldPassword: oldPassword1,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('success', 'เปลี่ยนรหัสผ่านสำเร็จ');
        setOldPassword1('');
        setOldPassword2('');
        setNewPassword('');
        setShowChangePassword(false);
      } else {
        showToast('error', data.message || 'เกิดข้อผิดพลาด');
      }
    } catch {
      showToast('error', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  if (!menuVisible || user.id === -1) return null;

  return (
    <>
      {/* Toast */}
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
            <span className="text-lg">{toast.type === 'success' ? '✓' : '✕'}</span>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Menu */}
      <div
        className={`fixed sm:top-[60px] max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:mb-16 mx-auto sm:mx-0 sm:right-8 md:right-[10%] lg:right-[30%]
        w-80 max-sm:w-full max-sm:rounded-t-2xl max-sm:rounded-b-none
        bg-white/20 backdrop-blur-xl text-black rounded-xl shadow-2xl border border-white/30 text-sm p-4 z-50`}
      >
        <div className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-lg cursor-pointer">
          <img
            src={`https://minotar.net/avatar/${user.username}/50`}
            alt="Avatar"
            className="w-12 h-12 rounded-md border border-white/40"
          />
          <div className="ml-3">
            <div className="font-semibold text-base">{user.username}</div>
            <div className="text-sm text-gray-800 mt-1">พอยท์: {user.point}</div>
            <div className="text-sm text-gray-800">RP: {user.RP}</div>
          </div>
        </div>

        <hr className="my-3 border-white/40" />

        <ul className="space-y-2">
          <MenuItem icon={<FaKey />} label="เปลี่ยนรหัสผ่าน" onClick={() => setShowChangePassword(true)} />
          <MenuItem icon={<FaSignOutAlt />} label="ออกจากระบบ" onClick={handleLogout} />
          <MenuItem icon={<Gift />} label="กรอกโค้ด" onClick={() => dispatch(showrederm(true))} />
        </ul>
      </div>

      {/* Popup Modal */}
      <div
        className={`fixed inset-0 bg-black/40 flex items-center justify-center z-[9998] transition-opacity duration-300
        ${showChangePassword ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className={`bg-white/20 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/30 w-[90%] max-w-md space-y-4 relative p-6 
          transform transition-all duration-300 ease-out
          ${
            showChangePassword
              ? 'translate-y-0 opacity-100'
              : isMobile()
              ? 'translate-y-10 opacity-0' // 📱 มือถือ: เลื่อนขึ้น
              : '-translate-y-10 opacity-0' // 💻 คอม: เลื่อนลง
          }`}
        >
          <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-lg">เปลี่ยนรหัสผ่าน</h2>

          <PasswordInput
            placeholder="รหัสผ่านเก่า (ครั้งที่ 1)"
            value={oldPassword1}
            onChange={setOldPassword1}
            visible={showPass.old1}
            toggle={() => togglePassword('old1')}
          />
          <PasswordInput
            placeholder="รหัสผ่านเก่า (ครั้งที่ 2)"
            value={oldPassword2}
            onChange={setOldPassword2}
            visible={showPass.old2}
            toggle={() => togglePassword('old2')}
          />
          <PasswordInput
            placeholder="รหัสผ่านใหม่"
            value={newPassword}
            onChange={setNewPassword}
            visible={showPass.newP}
            toggle={() => togglePassword('newP')}
          />

          <div className="flex gap-2">
            <button
              onClick={handleChangePassword}
              className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 py-2 rounded-2xl transition-all duration-200 font-semibold"
            >
              ยืนยัน
            </button>
            <button
              onClick={() => setShowChangePassword(false)}
              className="flex-1 bg-transparent border border-white/30 text-white hover:bg-white/30 py-2 rounded-2xl transition-all duration-200 font-semibold"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// 🔐 ช่องกรอกพาสเวิร์ดพร้อมปุ่มเปิด-ปิด
const PasswordInput = ({ placeholder, value, onChange, visible, toggle }) => (
  <div className="relative mb-3">
    <input
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-white/40 rounded-3xl px-4 py-2 bg-white/20 text-white
                 placeholder-white/70 focus:ring-2 focus:ring-white outline-none pr-12"
    />
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center
                 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30
                 text-white hover:bg-white/30 transition"
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

// 📋 รายการเมนู
const MenuItem = ({ icon, label, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-lg transition text-black w-full font-semibold"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  </li>
);

export default Kl;
