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


          <main className="pt-15">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
