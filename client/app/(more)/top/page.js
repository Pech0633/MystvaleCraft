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
        const sorted = res.data.sort((a, b) => b.RP - a.RP).slice(0, 100);
        setUsers(sorted);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" >
      <div className='flex items-center justify-center mb-6'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg border-b-2 border-white/50 pb-2 flex items-center gap-3'>
            SUPPORTERSUPPORTER
          </h2>
        </div>
      {users.length > 0 ? (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
          {users.map((user, index) => (
            <div
              key={index}
              className={`glass-white w-full text-white flex items-center justify-between p-6 rounded-2xl transition-all duration-300 transform ${
                index === 0
                  ? "border-yellow-400/50 shadow-xl hover:scale-105 hover:border-yellow-400"
                  : "shadow-md hover:scale-105"
              }`}
            >
              <div className="flex items-center gap-6">
                {/* <img
                  src={`https://mineskin.eu/armor/bust/${user.username}/100.png`}
                  alt={user.username}
                  className="w-24 h-24 shadow-lg"
                /> */}
                <img
                  src={`https://tabavatars.net/avatar/?username=${user.username}&type=head-iso&size=100&overlay=true`}
                  alt={user.username}
                  className="w-24 h-24 shadow-lg"
                />
                <div>
                  <p className="text-xl font-semibold">อันดับ {index + 1}</p>
                  <p>ชื่อ: {user.username}</p>
                  <p>พอยท์ {user.RP}</p>
                </div>
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
