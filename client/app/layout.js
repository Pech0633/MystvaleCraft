"use client"; 

import "./globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store"; 
import { Navbar } from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Optional: ใส่ background overlay หากต้องการ */}
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed -z-10">
          {/* แบบรูปภาพ - uncomment เมื่อมีรูปภาพ */}
          {/* style={{ backgroundImage: 'url(/images/background.jpg)' }} */}
        </div>
        
        <Provider store={store}>
          <Navbar />
          <main className=" pt-15">
          {children}
        </main>
        </Provider>
        
      </body>
    </html>
  );
}