"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Trophy, Search, WalletCards } from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/* =========================================================
   AVATAR
========================================================= */

const Avatar = ({ username, type = "helm", className = "" }) => {
  return (
    <img
      src={`https://tabavatars.net/avatar/?username=${encodeURIComponent(
        username
      )}&type=${type}`}
      alt={username}
      loading="lazy"
      className={`object-contain ${className}`}
    />
  );
};

/* =========================================================
   PAGE
========================================================= */

const Page = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* =======================================================
     GET MONEY DATA
  ======================================================= */

  useEffect(() => {
    axios
      .get(apiUrl + "/api/players")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];

        const sorted = [...data]
          .sort((a, b) => Number(b.money || 0) - Number(a.money || 0))
          .slice(0, 100);

        setUsers(sorted);
      })
      .catch((err) => {
        console.error("Error fetching money leaderboard:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((user) =>
      String(user.username || "")
        .toLowerCase()
        .includes(keyword)
    );
  }, [users, search]);

  /* =======================================================
     TOP 3
  ======================================================= */

  const first = users[0];
  const second = users[1];
  const third = users[2];

  /* =======================================================
     RANK 4+
  ======================================================= */

  const otherUsers = filteredUsers.filter((user) => {
    const index = users.findIndex(
      (item) => item.username === user.username
    );

    return index >= 3;
  });

  /* =======================================================
     MONEY FORMAT
  ======================================================= */

  const formatMoney = (money) => {
    return Number(money || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen w-full bg-transparent text-white overflow-x-hidden">

      <div className="w-full max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-5 py-3 sm:py-4">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

          {/* LEFT */}

          <div className="flex items-center gap-2.5">

            {/* ICON */}

            <div
              className="
                w-9 h-9
                sm:w-10 sm:h-10
                shrink-0
                rounded-xl
                flex items-center justify-center
                bg-green-500/[0.06]
                border border-green-500/25
              "
            >
              <WalletCards
                size={19}
                strokeWidth={2}
                className="text-green-400"
              />
            </div>

            {/* TITLE */}

            <div className="min-w-0">

              <h1 className="text-base sm:text-lg font-black leading-tight">
                เงิน
              </h1>

              <p className="text-[10px] sm:text-[11px] text-white/40">
                อันดับเงินสูงสุด 50 คน
              </p>

            </div>

            {/* =================================================
                SWITCH
            ================================================= */}

            <div
              className="
                ml-1
                flex
                items-center
                gap-1
                p-1
                rounded-xl
                bg-white/[0.035]
                border border-white/[0.07]
                backdrop-blur-md
              "
            >

              {/* RP */}

              <Link
                href="/top"
                className="
                  flex items-center gap-1.5
                  h-8
                  px-2.5
                  rounded-lg
                  text-white/45
                  hover:text-yellow-400
                  hover:bg-yellow-400/[0.08]
                  transition-all
                  text-[10px] sm:text-[11px]
                  font-black
                "
              >
                <Trophy size={13} />
                RP
              </Link>

              {/* MONEY ACTIVE */}

              <div
                className="
                  flex items-center gap-1.5
                  h-8
                  px-2.5
                  rounded-lg
                  bg-green-400/[0.12]
                  border border-green-400/20
                  text-green-400
                  text-[10px] sm:text-[11px]
                  font-black
                "
              >
                <WalletCards size={13} />
                MONEY
              </div>

            </div>

          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="relative w-full sm:w-[230px]">

            <Search
              size={17}
              strokeWidth={2}
              className="
                absolute
                left-3 top-1/2
                -translate-y-1/2
                text-white/55
                pointer-events-none
              "
            />

            <input
              type="text"
              placeholder="ค้นหาชื่อผู้เล่น..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-10
                rounded-xl
                pl-9 pr-3
                bg-white/[0.04]
                backdrop-blur-md
                border border-white/[0.08]
                text-xs sm:text-sm
                text-white
                placeholder:text-white/45
                outline-none
                transition-all duration-200
                focus:border-green-400/60
                focus:bg-white/[0.06]
                focus:shadow-[0_0_0_3px_rgba(74,222,128,0.07)]
              "
            />

          </div>

        </header>

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="flex justify-center mb-3">

          <div className="text-center">

            <h2 className="text-sm sm:text-base font-black">
              MONEY
            </h2>

            <div className="w-9 h-[2px] bg-green-400/60 mx-auto mt-1 rounded-full" />

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="flex justify-center py-16">

            <div
              className="
                w-7 h-7
                rounded-full
                border-2 border-white/10
                border-t-green-400
                animate-spin
              "
            />

          </div>

        ) : users.length === 0 ? (

          /* EMPTY */

          <div className="text-center py-16 text-white/30 text-sm">
            ไม่พบข้อมูล
          </div>

        ) : (

          <>

            {/* =================================================
                TOP 3
            ================================================= */}

            {!search && (
              <section
                className="
                  w-full
                  rounded-2xl sm:rounded-[22px]
                  overflow-hidden
                  bg-white/[0.015]
                  border border-white/[0.05]
                  backdrop-blur-md
                "
              >

                {/* =================================================
                    DESKTOP
                ================================================= */}

                <div
                  className="
                    hidden sm:flex
                    items-end
                    justify-center
                    gap-3 lg:gap-4
                    h-[325px]
                    lg:h-[345px]
                  "
                >

                  {/* =================================================
                      SECOND
                  ================================================= */}

                  {second && (
                    <div
                      className="
                        w-[140px]
                        lg:w-[150px]
                        flex flex-col
                        items-center
                        justify-end
                      "
                    >

                      <Avatar
                        username={second.username}
                        type="body-iso"
                        className="w-[65px] h-[120px]"
                      />

                      <p className="text-[11px] font-bold mt-1 max-w-[130px] truncate">
                        {second.username}
                      </p>

                      <p className="text-xs font-black text-white/70">
                        {formatMoney(second.money)}
                      </p>

                      <div
                        className="
                          mt-1
                          w-full
                          h-[68px]
                          rounded-t-[16px]
                          bg-gradient-to-b
                          from-white/20
                          to-transparent
                          border border-white/10
                          border-b-0
                          flex items-center justify-center
                        "
                      >
                        <span className="text-2xl font-black text-white/80">
                          2
                        </span>
                      </div>

                    </div>
                  )}

                  {/* =================================================
                      FIRST
                  ================================================= */}

                  {first && (
                    <div
                      className="
                        w-[180px]
                        lg:w-[195px]
                        flex flex-col
                        items-center
                        justify-end
                      "
                    >

                      <div className="text-2xl text-yellow-400 leading-none mb-0.5">
                        ♕
                      </div>

                      <Avatar
                        username={first.username}
                        type="body-iso"
                        className="w-[88px] h-[165px]"
                      />

                      <p className="text-xs font-black mt-1 max-w-[170px] truncate">
                        {first.username}
                      </p>

                      <p className="text-sm font-black text-green-400">
                        {formatMoney(first.money)}
                      </p>

                      <div
                        className="
                          mt-1
                          w-full
                          h-[95px]
                          rounded-t-[18px]
                          bg-gradient-to-b
                          from-green-400/60
                          via-green-500/15
                          to-transparent
                          border border-green-400/30
                          border-b-0
                          flex items-center justify-center
                        "
                      >
                        <span className="text-3xl font-black">
                          1
                        </span>
                      </div>

                    </div>
                  )}

                  {/* =================================================
                      THIRD
                  ================================================= */}

                  {third && (
                    <div
                      className="
                        w-[140px]
                        lg:w-[150px]
                        flex flex-col
                        items-center
                        justify-end
                      "
                    >

                      <Avatar
                        username={third.username}
                        type="body-iso"
                        className="w-[58px] h-[110px]"
                      />

                      <p className="text-[11px] font-bold mt-1 max-w-[130px] truncate">
                        {third.username}
                      </p>

                      <p className="text-xs font-black text-orange-400">
                        {formatMoney(third.money)}
                      </p>

                      <div
                        className="
                          mt-1
                          w-full
                          h-[55px]
                          rounded-t-[16px]
                          bg-gradient-to-b
                          from-orange-500/35
                          to-transparent
                          border border-orange-500/20
                          border-b-0
                          flex items-center justify-center
                        "
                      >
                        <span className="text-2xl font-black text-white/80">
                          3
                        </span>
                      </div>

                    </div>
                  )}

                </div>

                {/* =================================================
                    MOBILE
                ================================================= */}

                <div
                  className="
                    sm:hidden
                    grid grid-cols-3
                    items-end
                    min-h-[245px]
                    px-1.5 pt-4
                  "
                >

                  {/* SECOND */}

                  <div className="min-w-0 flex flex-col items-center justify-end">

                    {second && (
                      <>
                        <Avatar
                          username={second.username}
                          type="body-iso"
                          className="w-[48px] h-[88px]"
                        />

                        <p className="w-full px-1 text-center text-[9px] font-bold truncate">
                          {second.username}
                        </p>

                        <p className="text-[10px] font-black text-white/70">
                          {formatMoney(second.money)}
                        </p>

                        <div
                          className="
                            mt-1
                            w-full
                            h-[55px]
                            rounded-t-lg
                            bg-gradient-to-b
                            from-white/20
                            to-transparent
                            border border-white/10
                            border-b-0
                            flex items-center justify-center
                          "
                        >
                          <span className="text-xl font-black text-white/80">
                            2
                          </span>
                        </div>
                      </>
                    )}

                  </div>

                  {/* FIRST */}

                  <div className="min-w-0 flex flex-col items-center justify-end">

                    {first && (
                      <>
                        <div className="text-xl text-yellow-400 leading-none mb-0.5">
                          ♕
                        </div>

                        <Avatar
                          username={first.username}
                          type="body-iso"
                          className="w-[60px] h-[105px]"
                        />

                        <p className="w-full px-1 text-center text-[10px] font-black truncate">
                          {first.username}
                        </p>

                        <p className="text-[11px] font-black text-green-400">
                          {formatMoney(first.money)}
                        </p>

                        <div
                          className="
                            mt-1
                            w-full
                            h-[68px]
                            rounded-t-lg
                            bg-gradient-to-b
                            from-green-400/60
                            via-green-500/15
                            to-transparent
                            border border-green-400/30
                            border-b-0
                            flex items-center justify-center
                          "
                        >
                          <span className="text-2xl font-black">
                            1
                          </span>
                        </div>
                      </>
                    )}

                  </div>

                  {/* THIRD */}

                  <div className="min-w-0 flex flex-col items-center justify-end">

                    {third && (
                      <>
                        <Avatar
                          username={third.username}
                          type="body-iso"
                          className="w-[45px] h-[82px]"
                        />

                        <p className="w-full px-1 text-center text-[9px] font-bold truncate">
                          {third.username}
                        </p>

                        <p className="text-[10px] font-black text-orange-400">
                          {formatMoney(third.money)}
                        </p>

                        <div
                          className="
                            mt-1
                            w-full
                            h-[46px]
                            rounded-t-lg
                            bg-gradient-to-b
                            from-orange-500/35
                            to-transparent
                            border border-orange-500/20
                            border-b-0
                            flex items-center justify-center
                          "
                        >
                          <span className="text-xl font-black text-white/80">
                            3
                          </span>
                        </div>
                      </>
                    )}

                  </div>

                </div>

              </section>
            )}

            {/* =================================================
                USER LIST
            ================================================= */}

            <section className="mt-2.5 sm:mt-3">

              <div className="space-y-1.5 sm:space-y-2">

                {(search ? filteredUsers : otherUsers).map((user) => {

                  const originalIndex = users.findIndex(
                    (item) => item.username === user.username
                  );

                  const rank = originalIndex + 1;

                  return (
                    <div
                      key={user.username}
                      className="
                        w-full
                        h-[52px] sm:h-[58px]
                        flex items-center
                        px-2.5 sm:px-3.5
                        rounded-lg sm:rounded-xl
                        bg-white/[0.025]
                        border border-white/[0.055]
                        backdrop-blur-md
                        transition
                        hover:bg-white/[0.045]
                      "
                    >

                      {/* RANK */}

                      <div
                        className="
                          w-6 sm:w-7
                          shrink-0
                          text-center
                          text-[11px] sm:text-xs
                          font-black
                          text-white/35
                        "
                      >
                        {rank}
                      </div>

                      {/* AVATAR */}

                      <div
                        className="
                          w-8 h-8
                          sm:w-9 sm:h-9
                          ml-1.5 sm:ml-2.5
                          shrink-0
                          rounded-lg
                          overflow-hidden
                          bg-black/20
                          border border-white/[0.05]
                          flex items-center justify-center
                        "
                      >

                        <Avatar
                          username={user.username}
                          type="helm"
                          className="w-8 h-8 sm:w-9 sm:h-9"
                        />

                      </div>

                      {/* USERNAME */}

                      <div className="ml-2 sm:ml-2.5 min-w-0 flex-1">

                        <p className="text-[11px] sm:text-xs font-bold truncate">
                          {user.username}
                        </p>

                      </div>

                      {/* MONEY */}

                      <div className="ml-2 shrink-0 text-right">

                        <p className="text-[11px] sm:text-xs font-black text-green-400">
                          {formatMoney(user.money)}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* SEARCH EMPTY */}

              {search && filteredUsers.length === 0 && (
                <div className="text-center py-14 text-white/30 text-xs">
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