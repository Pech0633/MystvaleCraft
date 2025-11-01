"use client"; 

import "./globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store"; 
import { Navbar } from "@/components/Navbar";
import Redm  from "@/components/packet/redm";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Provider store={store}>
          <Navbar />
          <Redm />
            <img 
              src="https://github.com/KongNontawatDev/Black-Mourning-Ribbon/blob/2150640c0e623c7fbcca07024287b597f7999a84/ribbon_top_left.png?raw=true" 
              alt="Black mourning ribbon for websites, top left corner, ริบบิ้นไว้ทุกข์สีดำ มุมบนซ้าย สำหรับแสดงความอาลัยบนเว็บไซต์" 
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
          <main className=" pt-15">
          {children}
        </main>
        </Provider>
      </body>
    </html>
  );
}