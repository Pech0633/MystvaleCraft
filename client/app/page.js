'use client';

import React, { useEffect, useState } from 'react';
import Slideshow from '@/components/Slideshow';
import News from '@/components/news';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

const SERVER_IP = 'play.rebirthmc.online';
const DISCORD_URL = 'https://discord.gg/YOUR_INVITE_CODE'; // 👈 เปลี่ยนเป็นลิงก์ดิสคอร์ดของคุณ

const menuItems = [
  {
    title: 'ร้านค้า',
    subtitle: 'ดูสินค้าทั้งหมด',
    image: '/shop.png',
    href: '/shop',
    alt: 'ร้านค้า',
  },
  {
    title: 'เติมเงิน',
    subtitle: 'สนับสนุนเซิร์ฟเวอร์เราได้ที่นี่',
    image: '/topup.png',
    href: '/topup',
    alt: 'เติมเงิน',
  },
];

const CopyIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.191.328-.403.77-.552 1.121a18.27 18.27 0 0 0-5.487 0A12.64 12.64 0 0 0 9.29 3a19.74 19.74 0 0 0-4.433 1.369C2.056 8.52 1.294 12.566 1.675 16.555a19.9 19.9 0 0 0 5.993 3.03 14.6 14.6 0 0 0 1.284-2.087 12.9 12.9 0 0 1-2.02-.97c.17-.124.335-.253.495-.386 3.9 1.8 8.13 1.8 11.985 0 .162.133.327.262.495.386-.645.38-1.32.705-2.023.971.37.73.8 1.43 1.284 2.086a19.84 19.84 0 0 0 5.996-3.03c.447-4.62-.763-8.63-3.047-12.186ZM8.52 14.09c-1.182 0-2.157-1.085-2.157-2.42 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.335-.955 2.42-2.157 2.42Zm7.96 0c-1.182 0-2.157-1.085-2.157-2.42 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.335-.946 2.42-2.157 2.42Z" />
  </svg>
);

const Page = () => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(null);

  // ดึงสถานะเซิร์ฟเวอร์
  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
        const data = await res.json();
        if (!cancelled) setStatus(data);
      } catch (e) {
        if (!cancelled) setStatus({ online: false });
      }
    };
    fetchStatus();
    const timer = setInterval(fetchStatus, 60000); // รีเฟรชทุก 1 นาที
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // คัดลอก IP
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
    } catch (e) {
      // fallback สำหรับเบราว์เซอร์เก่า / ไม่ใช่ https
      const el = document.createElement('textarea');
      el.value = SERVER_IP;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-start space-y-4 p-4'>
      <div className="w-[300px] md:w-[400px] lg:w-[500px]">
        <img
          src="/logo2.png"
          alt="Logo"
          className="max-w-full h-auto mt-4"
        />
      </div>

      {/* ส่วน IP + Discord */}
      <div className="w-full max-w-md flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="glass-white w-full rounded-2xl px-5 py-4 flex items-center justify-between gap-3 text-white hover:border-white/40 hover:bg-white/10 active:scale-[0.98] transition-all duration-200 outline-none"
          title="กดเพื่อคัดลอก IP"
        >
          <div className="text-left">
            <div className="text-white/70 text-xs">IP เซิร์ฟเวอร์ (กดเพื่อคัดลอก)</div>
            <div className="font-extrabold text-lg">{SERVER_IP}</div>
          </div>
          <span
            className={`flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
              copied ? 'text-green-300' : 'text-white'
            }`}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
          </span>
        </button>

        {/* สถานะเซิร์ฟเวอร์ */}
        <div className="glass-white rounded-full px-4 py-2 text-white text-sm font-semibold flex items-center gap-2 drop-shadow-md">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${
              status === null
                ? 'bg-gray-400 animate-pulse'
                : status.online
                ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]'
                : 'bg-red-500'
            }`}
          />
          {status === null && <span>กำลังตรวจสอบสถานะ...</span>}
          {status && status.online && (
            <span>
              ออนไลน์ • {status.players?.online ?? 0}/{status.players?.max ?? 0} คน • เวอร์ชัน {status.version}
            </span>
          )}
          {status && !status.online && <span>เซิร์ฟเวอร์ออฟไลน์</span>}
        </div>

        {/* ปุ่ม Discord สไตล์ใหม่ */}
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-white group relative w-full overflow-hidden rounded-2xl px-4 py-3.5 flex items-center gap-4 text-white border border-white/10 hover:border-[#5865F2]/70 hover:shadow-[0_0_25px_rgba(88,101,242,0.45)] active:scale-[0.98] transition-all duration-200 outline-none"
        >
          {/* แสงม่วงไล่เฉดตอน hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/0 via-[#5865F2]/20 to-[#5865F2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* กล่องไอคอน */}
          <div className="relative shrink-0 w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center shadow-lg shadow-[#5865F2]/40 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-200">
            <DiscordIcon />
          </div>

          {/* ข้อความ */}
          <div className="relative flex-1 text-left">
            <div className="font-extrabold text-lg leading-tight">เข้าร่วม Discord</div>
            <div className="text-white/70 text-xs mt-0.5">คุยกับชาวเซิร์ฟเวอร์ได้ที่นี่</div>
          </div>

          {/* ลูกศร */}
          <span className="relative text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
            <ArrowIcon />
          </span>
        </a>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-center gap-6 mt-8">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="glass-white outline-none group rounded-2xl p-7 flex-1 max-w-md flex flex-col justify-between hover:border-white/40 transition-all duration-200 relative overflow-hidden"
            style={{ minHeight: 200 }}
          >
            <div>
              <div className="text-white font-extrabold text-xl drop-shadow-sm group-hover:underline">{item.title}</div>
              <div className="text-white/90 text-base mt-2">{item.subtitle}</div>
            </div>
            <img
              src={item.image}
              alt={item.alt}
              className="w-28 h-28 self-end mt-4 transition-transform duration-200 group-hover:scale-110 drop-shadow-lg"
            />
            {/* เพิ่ม effect แสง */}
            <div className="absolute inset-0 pointer-events-none group-hover:bg-white/10 transition-colors duration-200 rounded-2xl" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;