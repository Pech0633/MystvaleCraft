'use client';


import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Medal } from 'lucide-react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [ranks, setRanks] = useState([]);
  const user = useSelector((state) => state.user);
  const [buys, sbuys] = useState(false);
  const [selectedRank, setSelectedRank] = useState(null);

  useEffect(() => {
    if (ranks.length > 0) return;
    fetch(apiUrl + '/ranks')
      .then(res => res.json())
      .then(data => {
        setRanks(data);
      })
      .catch(err => console.error(err));
  }, [ranks]);

  const buyss = (rank) => {
    setSelectedRank(rank);
    sbuys(true);
  };

  const confirmBuy = () => {
    if (!selectedRank) return;
    fetch(apiUrl + '/buyrank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rankId: selectedRank.id, // ใช้คีย์ที่ถูกต้อง
        userId: user.id,
        quantity: 1,
        idrank: selectedRank.rank_id // เปลี่ยนเป็น rank_id แทน rankId
      })            
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      sbuys(false);
    })
    .catch(() => {
      alert("เกิดข้อผิดพลาดในการซื้อ");
      sbuys(false);
    });
  };

  return (
    <div className="p-4 text-black">
      <div className='flex items-center justify-center mb-6'>
        <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-black border-b-2 border-gray-300 pb-2 flex items-center gap-3'>
          <Medal className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black' />
          ยศ
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {ranks.map(r => (
          <div
            key={r.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 rounded-xl shadow-md flex flex-col justify-between items-center transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-amber-50"
          >
            <img
              src={r.priceture}
              alt={r.name}
              className="w-20 h-20 object-contain my-2 transition-transform duration-300 hover:scale-105"
            />
            <div className="font-extrabold text-lg text-center">{r.name}</div>
            <div className="text-sm">ราคา: {r.price} บาท</div>
            <button
              className="mt-2 bg-orange-500 hover:bg-orange-600 text-black py-1 px-4 rounded transition-all duration-300 hover:scale-105 shadow hover:shadow-lg"
              onClick={() => buyss(r)}
            >
              ซื้อเลย
            </button>
          </div>
        ))}
      </div>

      {buys && selectedRank && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="p-8 border w-96 shadow-xl rounded-2xl bg-white text-black">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-600">ยืนยันการซื้อ</h3>
              <img
                src={selectedRank.priceture}
                alt={selectedRank.name}
                className="w-20 h-20 mx-auto my-4"
              />
              <p className="text-lg">คุณต้องการซื้อ <strong>{selectedRank.name}</strong> ใช่หรือไม่?</p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="px-4 py-2 bg-green-500 text-black font-medium rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={confirmBuy}
                >
                  ยืนยัน
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-md shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={() => sbuys(false)}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
