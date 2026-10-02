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

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) =>
      String(user.username || "")
        .toLowerCase()
        .includes(keyword)
    );
  }, [users, search]);

  const first = users[0];
  const second = users[1];
  const third = users[2];

  const otherUsers = filteredUsers.filter((user) => {
    const index = users.findIndex(
      (item) => item.username === user.username
    );

    return index >= 3;
  });

  return (
    <main className="min-h-screen w-full bg-transparent text-white">

      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 py-5">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-3">

            <div
              className="
                w-11 h-11
                rounded-xl
                flex items-center justify-center
                bg-yellow-500/[0.06]
                border border-yellow-500/30
              "
            >
              <span className="text-xl">📊</span>
            </div>

            <div>
              <h1 className="text-xl font-black">
                เลเวล
              </h1>

              <p className="text-xs text-white/40">
                อันดับสูงสุด 50 คน
              </p>
            </div>

          </div>

          {/* SEARCH */}

          <div className="relative w-[180px] sm:w-[220px]">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-sm">
              🔍
            </span>

            <input
              type="text"
              placeholder="ค้นหาชื่อ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-10
                rounded-xl
                pl-9 pr-3
                bg-white/[0.025]
                border border-white/[0.07]
                text-sm
                text-white
                placeholder:text-white/25
                outline-none
                focus:border-yellow-500/30
              "
            />

          </div>

        </div>

        {/* ================= TITLE ================= */}

        <div className="flex justify-center mb-4">

          <div className="text-center">

            <h2 className="text-lg font-black">
              SUPPORTER
            </h2>

            <div className="w-12 h-[2px] bg-yellow-500/60 mx-auto mt-1 rounded-full" />

          </div>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="flex justify-center py-20">

            <div
              className="
                w-8 h-8
                rounded-full
                border-2
                border-white/10
                border-t-yellow-400
                animate-spin
              "
            />

          </div>

        ) : users.length === 0 ? (

          <div className="text-center py-20 text-white/30">
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
                  h-[390px]
                  rounded-[26px]
                  overflow-hidden

                  bg-white/[0.015]

                  border
                  border-white/[0.055]

                  backdrop-blur-md
                "
              >

                {/* ================= FIRST ================= */}

                {first && (

                  <div
                    className="
                      absolute
                      left-1/2
                      -translate-x-1/2
                      bottom-0

                      w-[210px]
                      h-[350px]

                      flex
                      flex-col
                      items-center
                      justify-end
                    "
                  >

                    {/* crown */}

                    <div
                      className="
                        absolute
                        top-2
                        text-3xl
                        text-yellow-400
                      "
                    >
                      ♕
                    </div>

                    {/* player */}

                    <Avatar
                      username={first.username}
                      type="body-iso"
                      className="
                        w-[105px]
                        h-[190px]
                        object-contain
                        drop-shadow-[0_0_18px_rgba(250,204,21,0.20)]
                      "
                    />

                    <p className="text-sm font-black mt-1">
                      {first.username}
                    </p>

                    <p className="text-base font-black text-yellow-400">
                      {Number(first.RP || 0).toLocaleString()}
                    </p>

                    {/* rank box */}

                    <div
                      className="
                        mt-1
                        w-full
                        h-[105px]

                        rounded-t-[20px]

                        bg-gradient-to-b
                        from-yellow-400/60
                        via-yellow-500/15
                        to-transparent

                        border
                        border-yellow-400/30
                        border-b-0

                        flex
                        items-center
                        justify-center
                      "
                    >

                      <span className="text-4xl font-black">
                        1
                      </span>

                    </div>

                  </div>

                )}

                {/* ================= SECOND ================= */}

                {second && (

                  <div
                    className="
                      absolute
                      left-[17%]
                      sm:left-[24%]
                      bottom-0

                      w-[165px]
                      h-[280px]

                      flex
                      flex-col
                      items-center
                      justify-end
                    "
                  >

                    <Avatar
                      username={second.username}
                      type="body-iso"
                      className="
                        w-[78px]
                        h-[145px]
                        object-contain
                      "
                    />

                    <p className="text-xs font-bold mt-1">
                      {second.username}
                    </p>

                    <p className="text-sm font-black text-white/70">
                      {Number(second.RP || 0).toLocaleString()}
                    </p>

                    <div
                      className="
                        mt-1
                        w-full
                        h-[80px]

                        rounded-t-[18px]

                        bg-gradient-to-b
                        from-white/20
                        to-transparent

                        border
                        border-white/10
                        border-b-0

                        flex
                        items-center
                        justify-center
                      "
                    >

                      <span className="text-3xl font-black text-white/80">
                        2
                      </span>

                    </div>

                  </div>

                )}

                {/* ================= THIRD ================= */}

                {third && (

                  <div
                    className="
                      absolute
                      right-[17%]
                      sm:right-[24%]
                      bottom-0

                      w-[165px]
                      h-[255px]

                      flex
                      flex-col
                      items-center
                      justify-end
                    "
                  >

                    <Avatar
                      username={third.username}
                      type="body-iso"
                      className="
                        w-[70px]
                        h-[130px]
                        object-contain
                      "
                    />

                    <p className="text-xs font-bold mt-1">
                      {third.username}
                    </p>

                    <p className="text-sm font-black text-orange-400">
                      {Number(third.RP || 0).toLocaleString()}
                    </p>

                    <div
                      className="
                        mt-1
                        w-full
                        h-[65px]

                        rounded-t-[18px]

                        bg-gradient-to-b
                        from-orange-500/35
                        to-transparent

                        border
                        border-orange-500/20
                        border-b-0

                        flex
                        items-center
                        justify-center
                      "
                    >

                      <span className="text-3xl font-black text-white/80">
                        3
                      </span>

                    </div>

                  </div>

                )}

              </section>

            )}

            {/* =================================================
                LIST
            ================================================== */}

            <section className="mt-4">

              <div className="space-y-2">

                {(search ? filteredUsers : otherUsers).map(
                  (user) => {

                    const originalIndex = users.findIndex(
                      (item) =>
                        item.username === user.username
                    );

                    const rank = originalIndex + 1;

                    return (

                      <div
                        key={user.username}
                        className="
                          w-full
                          h-[64px]

                          flex
                          items-center

                          px-4

                          rounded-xl

                          bg-white/[0.025]

                          border
                          border-white/[0.055]

                          backdrop-blur-md

                          transition

                          hover:bg-white/[0.045]
                          hover:border-white/[0.10]
                        "
                      >

                        {/* rank */}

                        <div
                          className="
                            w-8
                            text-center
                            text-sm
                            font-black
                            text-white/35
                          "
                        >
                          {rank}
                        </div>

                        {/* avatar */}

                        <div
                          className="
                            w-10
                            h-10
                            ml-3

                            rounded-lg

                            overflow-hidden

                            bg-black/20

                            border
                            border-white/[0.05]

                            flex
                            items-center
                            justify-center
                          "
                        >

                          <Avatar
                            username={user.username}
                            type="helm"
                            className="
                              w-10
                              h-10
                              object-contain
                            "
                          />

                        </div>

                        {/* username */}

                        <div className="ml-3 min-w-0">

                          <p
                            className="
                              text-sm
                              font-bold
                              truncate
                              max-w-[200px]
                              sm:max-w-[500px]
                            "
                          >
                            {user.username}
                          </p>

                        </div>

                        {/* RP */}

                        <div className="ml-auto text-right">

                          <p className="text-sm font-black text-yellow-400">
                            {Number(
                              user.RP || 0
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

              {search &&
                filteredUsers.length === 0 && (

                  <div className="text-center py-16 text-white/30 text-sm">
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