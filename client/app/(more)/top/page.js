"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Avatar = ({
  username,
  type = "helm",
  className = "",
}) => {
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
          .sort(
            (a, b) =>
              Number(b.RP || 0) - Number(a.RP || 0)
          )
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

    if (!keyword) {
      return users;
    }

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
    <main className="min-h-screen w-full bg-transparent text-white overflow-x-hidden">

      <div className="w-full max-w-[1350px] mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-3
          mb-5
        ">

          {/* TITLE */}

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              sm:w-11
              sm:h-11
              shrink-0
              rounded-xl
              flex
              items-center
              justify-center
              bg-yellow-500/[0.06]
              border
              border-yellow-500/30
            ">
              <span className="text-lg sm:text-xl">
                📊
              </span>
            </div>

            <div className="min-w-0">

              <h1 className="
                text-lg
                sm:text-xl
                font-black
              ">
                เลเวล
              </h1>

              <p className="
                text-[11px]
                sm:text-xs
                text-white/40
              ">
                อันดับสูงสุด 50 คน
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className="
            relative
            w-full
            sm:w-[220px]
          ">

            <span className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-white/25
              text-sm
            ">
              🔍
            </span>

            <input
              type="text"
              placeholder="ค้นหาชื่อ"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                h-10
                rounded-xl
                pl-9
                pr-3
                bg-white/[0.025]
                border
                border-white/[0.07]
                text-sm
                text-white
                placeholder:text-white/25
                outline-none
                focus:border-yellow-500/30
              "
            />

          </div>

        </div>

        {/* =====================================================
            TITLE
        ====================================================== */}

        <div className="flex justify-center mb-4">

          <div className="text-center">

            <h2 className="
              text-base
              sm:text-lg
              font-black
            ">
              SUPPORTER
            </h2>

            <div className="
              w-10
              sm:w-12
              h-[2px]
              bg-yellow-500/60
              mx-auto
              mt-1
              rounded-full
            " />

          </div>

        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading ? (

          <div className="
            flex
            justify-center
            py-20
          ">

            <div className="
              w-8
              h-8
              rounded-full
              border-2
              border-white/10
              border-t-yellow-400
              animate-spin
            " />

          </div>

        ) : users.length === 0 ? (

          <div className="
            text-center
            py-20
            text-white/30
          ">
            ไม่พบข้อมูล
          </div>

        ) : (

          <>

            {/* =================================================
                TOP 3
            ================================================== */}

            {!search && (

              <section className="
                w-full

                rounded-2xl
                sm:rounded-[26px]

                overflow-hidden

                bg-white/[0.015]

                border
                border-white/[0.055]

                backdrop-blur-md
              ">

                {/* =================================================
                    DESKTOP
                ================================================== */}

                <div className="
                  hidden
                  sm:block
                  relative
                  h-[360px]
                  lg:h-[390px]
                ">

                  {/* ================= SECOND ================= */}

                  {second && (

                    <div className="
                      absolute
                      left-[16%]
                      lg:left-[22%]
                      bottom-0

                      w-[150px]
                      lg:w-[165px]

                      h-[270px]
                      lg:h-[280px]

                      flex
                      flex-col
                      items-center
                      justify-end
                    ">

                      <Avatar
                        username={second.username}
                        type="body-iso"
                        className="
                          w-[75px]
                          h-[140px]
                        "
                      />

                      <p className="
                        text-xs
                        font-bold
                        mt-1
                        max-w-[140px]
                        truncate
                      ">
                        {second.username}
                      </p>

                      <p className="
                        text-sm
                        font-black
                        text-white/70
                      ">
                        {Number(
                          second.RP || 0
                        ).toLocaleString()}
                      </p>

                      <div className="
                        mt-1
                        w-full
                        h-[75px]

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
                      ">

                        <span className="
                          text-3xl
                          font-black
                          text-white/80
                        ">
                          2
                        </span>

                      </div>

                    </div>

                  )}

                  {/* ================= FIRST ================= */}

                  {first && (

                    <div className="
                      absolute
                      left-1/2
                      -translate-x-1/2
                      bottom-0

                      w-[200px]
                      lg:w-[210px]

                      h-[350px]
                      lg:h-[360px]

                      flex
                      flex-col
                      items-center
                      justify-end
                    ">

                      <div className="
                        text-3xl
                        text-yellow-400
                        mb-[-2px]
                      ">
                        ♕
                      </div>

                      <Avatar
                        username={first.username}
                        type="body-iso"
                        className="
                          w-[100px]
                          h-[185px]
                        "
                      />

                      <p className="
                        text-sm
                        font-black
                        mt-1
                        max-w-[180px]
                        truncate
                      ">
                        {first.username}
                      </p>

                      <p className="
                        text-base
                        font-black
                        text-yellow-400
                      ">
                        {Number(
                          first.RP || 0
                        ).toLocaleString()}
                      </p>

                      <div className="
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
                      ">

                        <span className="
                          text-4xl
                          font-black
                        ">
                          1
                        </span>

                      </div>

                    </div>

                  )}

                  {/* ================= THIRD ================= */}

                  {third && (

                    <div className="
                      absolute
                      right-[16%]
                      lg:right-[22%]
                      bottom-0

                      w-[150px]
                      lg:w-[165px]

                      h-[245px]
                      lg:h-[255px]

                      flex
                      flex-col
                      items-center
                      justify-end
                    ">

                      <Avatar
                        username={third.username}
                        type="body-iso"
                        className="
                          w-[68px]
                          h-[125px]
                        "
                      />

                      <p className="
                        text-xs
                        font-bold
                        mt-1
                        max-w-[140px]
                        truncate
                      ">
                        {third.username}
                      </p>

                      <p className="
                        text-sm
                        font-black
                        text-orange-400
                      ">
                        {Number(
                          third.RP || 0
                        ).toLocaleString()}
                      </p>

                      <div className="
                        mt-1
                        w-full
                        h-[62px]

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
                      ">

                        <span className="
                          text-3xl
                          font-black
                          text-white/80
                        ">
                          3
                        </span>

                      </div>

                    </div>

                  )}

                </div>


                {/* =================================================
                    MOBILE
                ================================================== */}

                <div className="
                  sm:hidden

                  grid
                  grid-cols-3
                  items-end

                  min-h-[285px]

                  px-2
                  pt-5
                ">

                  {/* ================= SECOND ================= */}

                  <div className="
                    min-w-0
                    flex
                    flex-col
                    items-center
                    justify-end
                  ">

                    {second ? (
                      <>
                        <Avatar
                          username={second.username}
                          type="body-iso"
                          className="
                            w-[58px]
                            h-[105px]
                          "
                        />

                        <p className="
                          w-full
                          px-1
                          text-center
                          text-[10px]
                          font-bold
                          truncate
                        ">
                          {second.username}
                        </p>

                        <p className="
                          text-[11px]
                          font-black
                          text-white/70
                        ">
                          {Number(
                            second.RP || 0
                          ).toLocaleString()}
                        </p>

                        <div className="
                          mt-1
                          w-full
                          h-[65px]

                          rounded-t-xl

                          bg-gradient-to-b
                          from-white/20
                          to-transparent

                          border
                          border-white/10
                          border-b-0

                          flex
                          items-center
                          justify-center
                        ">

                          <span className="
                            text-2xl
                            font-black
                            text-white/80
                          ">
                            2
                          </span>

                        </div>
                      </>
                    ) : (
                      <div />
                    )}

                  </div>


                  {/* ================= FIRST ================= */}

                  <div className="
                    min-w-0
                    flex
                    flex-col
                    items-center
                    justify-end
                  ">

                    {first ? (
                      <>

                        <div className="
                          text-2xl
                          text-yellow-400
                          leading-none
                          mb-1
                        ">
                          ♕
                        </div>

                        <Avatar
                          username={first.username}
                          type="body-iso"
                          className="
                            w-[72px]
                            h-[125px]
                          "
                        />

                        <p className="
                          w-full
                          px-1
                          text-center
                          text-[11px]
                          font-black
                          truncate
                        ">
                          {first.username}
                        </p>

                        <p className="
                          text-[13px]
                          font-black
                          text-yellow-400
                        ">
                          {Number(
                            first.RP || 0
                          ).toLocaleString()}
                        </p>

                        <div className="
                          mt-1
                          w-full
                          h-[85px]

                          rounded-t-xl

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
                        ">

                          <span className="
                            text-3xl
                            font-black
                          ">
                            1
                          </span>

                        </div>

                      </>
                    ) : (
                      <div />
                    )}

                  </div>


                  {/* ================= THIRD ================= */}

                  <div className="
                    min-w-0
                    flex
                    flex-col
                    items-center
                    justify-end
                  ">

                    {third ? (
                      <>

                        <Avatar
                          username={third.username}
                          type="body-iso"
                          className="
                            w-[54px]
                            h-[98px]
                          "
                        />

                        <p className="
                          w-full
                          px-1
                          text-center
                          text-[10px]
                          font-bold
                          truncate
                        ">
                          {third.username}
                        </p>

                        <p className="
                          text-[11px]
                          font-black
                          text-orange-400
                        ">
                          {Number(
                            third.RP || 0
                          ).toLocaleString()}
                        </p>

                        <div className="
                          mt-1
                          w-full
                          h-[55px]

                          rounded-t-xl

                          bg-gradient-to-b
                          from-orange-500/35
                          to-transparent

                          border
                          border-orange-500/20
                          border-b-0

                          flex
                          items-center
                          justify-center
                        ">

                          <span className="
                            text-2xl
                            font-black
                            text-white/80
                          ">
                            3
                          </span>

                        </div>

                      </>
                    ) : (
                      <div />
                    )}

                  </div>

                </div>

              </section>

            )}


            {/* =================================================
                LIST
            ================================================== */}

            <section className="mt-3 sm:mt-4">

              <div className="space-y-1.5 sm:space-y-2">

                {(search
                  ? filteredUsers
                  : otherUsers
                ).map((user) => {

                  const originalIndex =
                    users.findIndex(
                      (item) =>
                        item.username ===
                        user.username
                    );

                  const rank =
                    originalIndex + 1;

                  return (

                    <div
                      key={user.username}
                      className="
                        w-full
                        h-[58px]
                        sm:h-[64px]

                        flex
                        items-center

                        px-3
                        sm:px-4

                        rounded-xl

                        bg-white/[0.025]

                        border
                        border-white/[0.055]

                        backdrop-blur-md

                        hover:bg-white/[0.045]

                        transition
                      "
                    >

                      {/* RANK */}

                      <div className="
                        w-7
                        sm:w-8
                        shrink-0

                        text-center

                        text-xs
                        sm:text-sm

                        font-black

                        text-white/35
                      ">
                        {rank}
                      </div>


                      {/* AVATAR */}

                      <div className="
                        w-9
                        h-9
                        sm:w-10
                        sm:h-10

                        ml-2
                        sm:ml-3

                        shrink-0

                        rounded-lg

                        overflow-hidden

                        bg-black/20

                        border
                        border-white/[0.05]

                        flex
                        items-center
                        justify-center
                      ">

                        <Avatar
                          username={user.username}
                          type="helm"
                          className="
                            w-9
                            h-9
                            sm:w-10
                            sm:h-10
                          "
                        />

                      </div>


                      {/* USERNAME */}

                      <div className="
                        ml-2
                        sm:ml-3

                        min-w-0
                        flex-1
                      ">

                        <p className="
                          text-xs
                          sm:text-sm

                          font-bold

                          truncate
                        ">
                          {user.username}
                        </p>

                      </div>


                      {/* RP */}

                      <div className="
                        ml-2
                        shrink-0
                        text-right
                      ">

                        <p className="
                          text-xs
                          sm:text-sm

                          font-black

                          text-yellow-400
                        ">
                          {Number(
                            user.RP || 0
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  );
                })}

              </div>


              {/* SEARCH EMPTY */}

              {search &&
                filteredUsers.length === 0 && (

                  <div className="
                    text-center
                    py-16
                    text-white/30
                    text-sm
                  ">
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