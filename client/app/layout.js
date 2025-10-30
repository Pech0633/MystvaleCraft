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
          <main className=" pt-15">
          {children}
        </main>
        </Provider>
      </body>
    </html>
  );
}