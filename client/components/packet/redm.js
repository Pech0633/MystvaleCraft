"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hiderederm } from "@/redux/storage/rederm";
import { motion, AnimatePresence } from "framer-motion";

const Redm = () => {
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const rederm = useSelector((state) => state.rederm.rederm);
  const [isAnimating, setIsAnimating] = useState(false);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (rederm) setIsAnimating(true);
    else setIsAnimating(false);
  }, [rederm]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleRedeem = async () => {
    if (!code.trim()) {
      showToast("⚠️ กรุณากรอกโค้ด", "error");
      return;
    }

    if (!user?.id) {
      showToast("❌ ไม่พบข้อมูลผู้ใช้", "error");
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL + "/code";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          equal: code.trim(),
        }),
      });

      const data = await response.json();

      if (data.status) {
        showToast( data.message, "success");
        setCode("");
        handleClose();
      } else {
        showToast(data.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์", "error");
      }
    } catch (error) {
      console.error("Redeem error:", error);
      showToast("🚨 เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setLoading(false);
    }
  };
    
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => dispatch(hiderederm()), 300);
  };

  if (!rederm) return null;

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        z-[9999] px-6 py-4 rounded-xl shadow-lg font-semibold text-center
                        text-sm w-72 flex items-center justify-center gap-3 ${
                          toast.type === "success"
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        }`}
          >
            <span className="text-lg">
              {toast.type === "success" ? "✓" : "✕"}
            </span>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redeem Popup */}
      <div
        className={`min-h-screen fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <div
          className={`relative max-w-md w-full p-6 transition-all duration-500 ${
            isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
          }`}
        >
          <div className="bg-white/30 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-6 space-y-6 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                กรอกโค้ด
              </h2>
              <p className="text-gray-200 text-sm">
                กรุณากรอกโค้ดที่คุณได้รับ
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-200"
              >
                โค้ด
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="กรอกโค้ดที่นี่"
                className="w-full px-4 py-3 bg-white/40 border border-white/30 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleRedeem}
              disabled={!code.trim() || loading}
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                code.trim() && !loading
                  ? "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm"
                  : "bg-gray-400/30 text-gray-300 cursor-not-allowed"
              }`}
            >
              {loading ? "กำลังส่ง..." : "ใช้โค้ด"}
            </button>

            <div className="pt-4 border-t border-white/20">
              <div className="flex items-start gap-3 p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                <div className="text-blue-300 text-xl">ℹ️</div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">คำแนะนำ</p>
                  <p className="text-xs text-gray-200 mt-1">
                    กรอกโค้ดที่ได้รับจากอีเวนต์หรือโปรโมชั่นเพื่อแลกรับรางวัลพิเศษ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Redm;
