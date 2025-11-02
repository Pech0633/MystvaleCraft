"use client";

import "./globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store"; 
import { Navbar } from "@/components/Navbar";
import Redm from "@/components/packet/redm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(true);

  const handleClickImage = () => {
    setShowPopup(false);
    router.push("https://www.limitrack.com/index.html"); 
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <html lang="en">
      <body className="min-h-screen">
        <Provider store={store}>
          <Navbar />
          <Redm />

          {/* ริบบิ้น */}
          <img 
            src="https://github.com/KongNontawatDev/Black-Mourning-Ribbon/blob/2150640c0e623c7fbcca07024287b597f7999a84/ribbon_top_left.png?raw=true" 
            alt="Black mourning ribbon"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '80px',
              opacity: 0.9,
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          />

          {/* Popup */}
{showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div className="relative w-[90vw] h-[50vh] sm:w-[600px] sm:h-[338px] max-w-full rounded-lg overflow-hidden shadow-2xl">
      
      {/* คลิกที่ภาพได้ทั้งภาพ */}
      <img
        src="r.png"
        alt="load limitrack"
        className="w-full h-full object-contain cursor-pointer transition-transform duration-700 hover:scale-105"
        onClick={handleClickImage}
      />

      {/* ชั้นมืดเบา ๆ */}
      <div className="absolute inset-0  pointer-events-none" />

      {/* ปุ่ม ✖️ ปิด popup */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-4 text-white text-4xl font-bold hover:text-red-400 transition-all z-10"
      >
        ✖️
      </button>
    </div>
  </div>
)}


          <main className="pt-15">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
