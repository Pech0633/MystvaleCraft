"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Avatar = ({ username, type = "helm", className = "" }) => {
  return (
    <img
      src={`https://tabavatars.net/avatar/?username=${encodeURIComponent(
        username
      )}&type=${type}`}
      alt={username}
      loading="lazy"
      className={className}
      onError={(e) => {
        e.currentTarget.style.opacity = "0.4";
      }}
    />
  );
};

const Page = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(apiUrl + "/")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];

        const sorted = [...data]
          .sort((a, b) => Number(b.RP || 0) - Number(a.RP || 0))
          .slice(0, 100);

        setUsers(sorted);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ค้นหา
  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) =>
      String(user.username || "")
        .toLowerCase()
        .includes(keyword)
    );
  }, [users, search]);

  // Top 3
  const first = users[0];
  const second = users[1];
  const third = users[2];

  // รายการอันดับ 4 เป็นต้นไป
  const otherUsers = filteredUsers.filter((user) => {
    const originalIndex = users.findIndex(
      (item) => item.username === user.username
    );

    return originalIndex >= 3;
  });

  return (
    <main className="min-h-screen w-full bg-[#070707] text-white relative overflow-hidden">
      {/* =====================================================
          BACKGROUND GRID
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* =====================================================
          GLOW
      ====================================================== */}
      <div className="pointer-events-none absolute top-[100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/[0.04] blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-7">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-8">

          {/* Logo / Title */}
          <div className="flex items-center gap-4">
            <div
              className="
                w-14 h-14
                rounded-2xl
                flex items-center justify-center
                bg-yellow-500/[0.08]
                border border-yellow-500/30
                shadow-[0_0_30px_rgba(234,179,8,0.08)]
              "
            >
              <span className="text-2xl">📊</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                เลเวล
              </h1>

              <p className="text-sm text-white/40 mt-0.5">
                อันดับสูงสุด 50 คน
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-[240px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              🔍
            </span>

            <input
              type="text"
              placeholder="ค้นหาชื่อ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-12
                rounded-xl
                pl-11 pr-4
                bg-white/[0.035]
                border border-white/[0.08]
                text-white
                placeholder:text-white/30
                outline-none
                transition
                focus:border-yellow-500/40
                focus:bg-white/[0.05]
              "
            />
          </div>
        </div>

        {/* =====================================================
            TITLE
        ====================================================== */}
        <div className="flex items-center justify-center mb-5">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black tracking-wide">
              SUPPORTER
            </h2>

            <div className="w-16 h-[2px] bg-yellow-500/70 mx-auto mt-2 rounded-full" />
          </div>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div
              className="
                w-10 h-10
                border-2
                border-white/10
                border-t-yellow-400
                rounded-full
                animate-spin
              "
            />

            <p className="text-white/40 mt-5">
              กำลังโหลดข้อมูล...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-32 text-white/40">
            ไม่พบข้อมูล
          </div>
        ) : (
          <>
            {/* =================================================
                TOP 3
            ================================================== */}
            {!search && (
              <section
                className="
                  relative
                  w-full
                  min-h-[490px]
                  rounded-[32px]
                  overflow-hidden
                  border border-white/[0.06]
                  bg-white/[0.018]
                  backdrop-blur-xl
                "
              >
                {/* Top glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[200px] bg-yellow-500/[0.08] blur-[90px]" />

                <div className="relative min-h-[490px] flex items-end justify-center">

                  {/* ==========================================
                      SECOND
                  =========================================== */}
                  {second && (
                    <div
                      className="
                        absolute
                        left-[5%]
                        sm:left-[18%]
                        bottom-0
                        w-[30%]
                        max-w-[260px]
                        min-w-[120px]
                        h-[300px]
                        flex flex-col items-center justify-end
                      "
                    >
                      <div className="relative h-[205px] flex items-end justify-center">

                        <Avatar
                          username={second.username}
                          type="body-iso"
                          className="
                            w-[100px]
                            sm:w-[125px]
                            h-[205px]
                            object-contain
                            drop-shadow-[0_0_25px_rgba(255,255,255,0.18)]
                          "
                        />
                      </div>

                      <p className="text-sm sm:text-base font-bold mt-2 truncate max-w-full">
                        {second.username}
                      </p>

                      <p className="text-lg font-black text-white/75">
                        {Number(second.RP || 0).toLocaleString()}
                      </p>

                      <div
                        className="
                          mt-2
                          w-full
                          h-[105px]
                          rounded-t-[22px]
                          bg-gradient-to-b
                          from-white/20
                          via-white/[0.07]
                          to-white/[0.02]
                          border border-white/10
                          border-b-0
                          flex items-center justify-center
                        "
                      >
                        <span className="text-4xl sm:text-5xl font-black text-white/80">
                          2
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      FIRST
                  =========================================== */}
                  {first && (
                    <div
                      className="
                        absolute
                        left-1/2
                        -translate-x-1/2
                        bottom-0
                        w-[34%]
                        max-w-[300px]
                        min-w-[150px]
                        h-[420px]
                        flex flex-col items-center justify-end
                      "
                    >
                      {/* Crown */}
                      <div
                        className="
                          absolute
                          top-0
                          text-4xl
                          text-yellow-400
                          drop-shadow-[0_0_15px_rgba(250,204,21,0.7)]
                        "
                      >
                        ♕
                      </div>

                      <div className="relative h-[235px] flex items-end justify-center pt-10">

                        <div className="absolute inset-0 bg-yellow-400/[0.06] blur-[45px]" />

                        <Avatar
                          username={first.username}
                          type="body-iso"
                          className="
                            relative
                            w-[130px]
                            sm:w-[160px]
                            h-[235px]
                            object-contain
                            drop-shadow-[0_0_30px_rgba(250,204,21,0.28)]
                          "
                        />
                      </div>

                      <p className="text-base sm:text-lg font-black mt-2">
                        {first.username}
                      </p>

                      <p className="text-xl font-black text-yellow-400">
                        {Number(first.RP || 0).toLocaleString()}
                      </p>

                      <div
                        className="
                          mt-2
                          w-full
                          h-[130px]
                          rounded-t-[24px]
                          bg-gradient-to-b
                          from-yellow-400/70
                          via-yellow-500/20
                          to-yellow-500/[0.05]
                          border border-yellow-400/40
                          border-b-0
                          flex items-center justify-center
                          shadow-[0_-10px_50px_rgba(234,179,8,0.10)]
                        "
                      >
                        <span className="text-5xl sm:text-6xl font-black text-white">
                          1
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      THIRD
                  =========================================== */}
                  {third && (
                    <div
                      className="
                        absolute
                        right-[5%]
                        sm:right-[18%]
                        bottom-0
                        w-[30%]
                        max-w-[260px]
                        min-w-[120px]
                        h-[280px]
                        flex flex-col items-center justify-end
                      "
                    >
                      <div className="relative h-[185px] flex items-end justify-center">

                        <Avatar
                          username={third.username}
                          type="body-iso"
                          className="
                            w-[90px]
                            sm:w-[115px]
                            h-[185px]
                            object-contain
                            drop-shadow-[0_0_25px_rgba(255,165,0,0.18)]
                          "
                        />
                      </div>

                      <p className="text-sm sm:text-base font-bold mt-2 truncate max-w-full">
                        {third.username}
                      </p>

                      <p className="text-lg font-black text-orange-400">
                        {Number(third.RP || 0).toLocaleString()}
                      </p>

                      <div
                        className="
                          mt-2
                          w-full
                          h-[85px]
                          rounded-t-[22px]
                          bg-gradient-to-b
                          from-orange-500/40
                          via-orange-500/10
                          to-orange-500/[0.03]
                          border border-orange-500/25
                          border-b-0
                          flex items-center justify-center
                        "
                      >
                        <span className="text-4xl sm:text-5xl font-black text-white/85">
                          3
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </section>
            )}

            {/* =================================================
                SEARCH RESULT
            ================================================== */}
            {search && (
              <div className="mb-5 text-sm text-white/40">
                ผลการค้นหา:{" "}
                <span className="text-white/80">
                  {filteredUsers.length}
                </span>{" "}
                คน
              </div>
            )}

            {/* =================================================
                RANK LIST
            ================================================== */}
            <section className="mt-5">

              {/* ถ้าไม่ได้ค้นหา ให้เริ่มจากอันดับ 4 */}
              {!search && otherUsers.length === 0 && (
                <div className="text-center py-10 text-white/30">
                  ยังไม่มีผู้สนับสนุนเพิ่มเติม
                </div>
              )}

              <div className="space-y-2">

                {(search ? filteredUsers : otherUsers).map((user) => {
                  const originalIndex = users.findIndex(
                    (item) => item.username === user.username
                  );

                  const rank = originalIndex + 1;

                  return (
                    <div
                      key={user.username}
                      className="
                        group
                        relative
                        w-full
                        min-h-[82px]
                        flex items-center
                        px-4 sm:px-6
                        rounded-2xl
                        bg-white/[0.035]
                        border border-white/[0.07]
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        hover:bg-white/[0.06]
                        hover:border-white/[0.13]
                        hover:-translate-y-[1px]
                      "
                    >

                      {/* Left */}
                      <div className="flex items-center gap-4 sm:gap-5 min-w-0">

                        {/* Rank */}
                        <div
                          className="
                            w-8 sm:w-10
                            text-center
                            text-base sm:text-lg
                            font-black
                            text-white/35
                            shrink-0
                          "
                        >
                          {rank}
                        </div>

                        {/* Avatar */}
                        <div
                          className="
                            w-12
                            h-12
                            rounded-xl
                            overflow-hidden
                            flex items-center justify-center
                            bg-black/20
                            border border-white/[0.06]
                            shrink-0
                          "
                        >
                          <Avatar
                            username={user.username}
                            type="helm"
                            className="
                              w-12
                              h-12
                              object-contain
                            "
                          />
                        </div>

                        {/* Username */}
                        <div className="min-w-0">
                          <p
                            className="
                              font-bold
                              text-sm sm:text-base
                              truncate
                              max-w-[180px]
                              sm:max-w-[400px]
                            "
                          >
                            {user.username}
                          </p>

                          <p className="text-xs text-white/30 mt-0.5">
                            อันดับ {rank}
                          </p>
                        </div>
                      </div>

                      {/* RP */}
                      <div className="ml-auto text-right shrink-0">
                        <p className="font-black text-yellow-400 text-sm sm:text-base">
                          {Number(user.RP || 0).toLocaleString()}
                        </p>

                        <p className="text-[10px] sm:text-xs text-white/25">
                          RP
                        </p>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* ไม่พบค้นหา */}
              {search && filteredUsers.length === 0 && (
                <div className="text-center py-20 text-white/30">
                  ไม่พบผู้เล่นที่ค้นหา
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default Page;