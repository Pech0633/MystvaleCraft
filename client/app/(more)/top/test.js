"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(apiUrl + "/")
      .then((res) => {
        const sorted = res.data.sort((a, b) => b.point - a.point).slice(0, 100);
        setUsers(sorted);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white border-b-2 border-gray-300 pb-2 flex items-center gap-3">
          SUPPORTERSUPPORTER
        </h2>
      </div>
      {users.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center w-full max-w-full">
          {users.map((user, index) => (
            <div
              key={index}
              className={`w-full sm:w-80 md:w-96 lg:w-1/4 xl:w-1/5 text-white flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 transform ${
                index === 0
                  ? "border-yellow-600 shadow-xl hover:scale-105"
                  : "border-gray-300 shadow-md hover:scale-105"
              }`}
            >
              <img
                src={`https://mineskin.eu/armor/bust/${user.username}/100.png`}
                alt={user.username}
                className="w-24 h-24 sm:w-32 sm:h-32 shadow-lg mb-4"
              />
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">อันดับ {index + 1}</p>
                <p className="text-lg font-medium">ชื่อ: {user.username}</p>
                <p className="text-lg font-medium text-gray-300">พอยท์: {user.point}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default Page;
