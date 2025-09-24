'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { setPoint } from '@/redux/userSlice'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const dispatch = useDispatch();
  const [ranks, setRanks] = useState([]);
  const user = useSelector((state) => state.user);
  const [buys, sbuys] = useState(false);
  const [selectedRank, setSelectedRank] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showConfirmGift, setShowConfirmGift] = useState(false); 
  const [showAlert, setShowAlert] = useState(false); 
  const [alertData, setAlertData] = useState({ type: '', title: '', message: '' });

  useEffect(() => {
    if (ranks.length > 0) return;
    fetch(apiUrl + '/product/get/' + id)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(rank => ({
          ...rank,
          Optionsquantity: rank.Optionsquantity === true || rank.Optionsquantity === 'true',
        }));
        setRanks(formatted);
      })
      .catch(err => console.error(err));
  }, [ranks]);

  const showIOSAlert = (type, title, message) => {
    setAlertData({ type, title, message });
    setShowAlert(true);
  };

  const buyss = (rank) => {
    setSelectedRank(rank);
    setQuantity(1);
    sbuys(true);
  };

  const confirmBuy = () => {
    if (!selectedRank) return;
    const finalQuantity = selectedRank.Optionsquantity ? quantity : 1;

    fetch(apiUrl + '/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Id: selectedRank.id,
        userId: user.id,
        quantity: finalQuantity,
        idrank: selectedRank.rank_id,
        rankup: selectedRank.rank_set,
        type: selectedRank.type
      })
    })
      .then(res => res.json())
      .then(data => {
        showIOSAlert('success', 'สำเร็จ', data.message);
        sbuys(false);
        dispatch(setPoint(data.newPoint));
      })
      .catch(() => {
        showIOSAlert('error', 'ผิดพลาด', 'เกิดข้อผิดพลาดในการซื้อ');
        sbuys(false);
      });
  };

  const giftBuy = () => {
    if (!selectedRank || !selectedPlayer) return;
    const finalQuantity = selectedRank.Optionsquantity ? quantity : 1;

    fetch(apiUrl + '/git', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Id: selectedRank.id,
        userId: selectedPlayer.id,
        quantity: finalQuantity,
        idrank: selectedRank.rank_id,
        rankup: selectedRank.rank_set,
        type: selectedRank.type,
        ppgive: user.id
      })
    })
      .then(res => res.json())
      .then(data => {
        showIOSAlert('success', 'ส่งของขวัญสำเร็จ', data.message);
        setShowGiftPopup(false);
        setSelectedPlayer(null);
        dispatch(setPoint(data.newPoint));
      })
      .catch(() => {
        showIOSAlert('error', 'ผิดพลาด', 'เกิดข้อผิดพลาดในการส่งของขวัญ');
        setShowGiftPopup(false);
      });
  };

  useEffect(() => {
    if (showGiftPopup) {
      fetch(`${apiUrl}/`)
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(p => p.username !== user.username);
          setPlayers(filtered);
        })
        .catch(err => console.error(err));
    }
  }, [showGiftPopup]);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className='text-2xl font-semibold text-gray-900 flex items-center justify-center gap-3'>
            {decodeURIComponent(id)}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ranks.map(r => (
            <div key={r.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                <img src={r.priceture} alt={r.name} className="max-w-full max-h-full object-contain rounded-xl" />
              </div>
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate text-center">{r.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">฿{r.price}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      user.id === -1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                    }`}
                    onClick={() => user.id !== -1 && buyss(r)}
                    disabled={user.id === -1}
                  >
                    ซื้อเลย
                  </button>
                  <button
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      user.id === -1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
                    }`}
                    onClick={() => {
                      setSelectedRank(r);
                      setQuantity(1);
                      setShowGiftPopup(true);
                    }}
                    disabled={user.id === -1}
                    title="ส่งของขวัญ"
                  >
                    🎁
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buy Modal */}
        {buys && selectedRank && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end sm:items-center z-50 p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">ยืนยันการซื้อ</h3>
              <img src={selectedRank.priceture} alt={selectedRank.name} className="w-16 h-16 mx-auto mb-4 rounded-xl object-contain" />
              <p className="text-gray-600 mb-4 text-center">
                คุณต้องการซื้อ <strong>{selectedRank.name}</strong> ใช่หรือไม่?
              </p>
              {selectedRank.Optionsquantity && (
                <div className="mb-4 text-center">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">จำนวน:</label>
                  <input type="number" id="quantity" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-20 px-3 py-2 border text-gray-700 border-gray-300 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200" onClick={() => sbuys(false)}>ยกเลิก</button>
                <button className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600" onClick={confirmBuy}>ยืนยัน</button>
              </div>
            </div>
          </div>
        )}

        {/* Gift Modal */}
        {showGiftPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end sm:items-center z-50 p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl sm:rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900">เลือกผู้เล่นเพื่อส่งของขวัญ</h2>
              </div>
              <div className="p-6 space-y-4">
                <input type="text" placeholder="ค้นหาชื่อผู้เล่น..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {players.filter(p => p.username.toLowerCase().includes(search.toLowerCase())).map((player, index) => (
                    <div key={index} className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedPlayer?.username === player.username ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-50'}`} onClick={() => setSelectedPlayer(player)}>
                      <span className="text-gray-900 font-medium">{player.username}</span>
                    </div>
                  ))}
                  {players.filter(p => p.username.toLowerCase().includes(search.toLowerCase())).length === 0 && <div className="text-gray-500 text-center py-4">ไม่พบผู้เล่น</div>}
                </div>
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200" onClick={() => { setShowGiftPopup(false); setSelectedPlayer(null); }}>ยกเลิก</button>
                  <button className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${selectedPlayer ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} onClick={() => setShowConfirmGift(true)} disabled={!selectedPlayer}>ส่งของขวัญ</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gift Confirmation */}
        {showConfirmGift && selectedPlayer && selectedRank && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end sm:items-center z-50 p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">ยืนยันการส่งของขวัญ</h3>
              <img src={selectedRank.priceture} alt={selectedRank.name} className="w-16 h-16 mx-auto mb-4 rounded-xl object-contain" />
              <p className="text-gray-600 mb-4 text-center">
                คุณต้องการส่ง <strong>{selectedRank.name}</strong> ให้กับ <strong>{selectedPlayer.username}</strong> ใช่หรือไม่?
              </p>
              {selectedRank.Optionsquantity && (
                <div className="mb-4 text-center">
                  <label htmlFor="quantityGift" className="block text-sm font-medium text-gray-700 mb-2">จำนวน:</label>
                  <input type="number" id="quantityGift" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-20 px-3 py-2 text-gray-700 border border-gray-300 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200" onClick={() => setShowConfirmGift(false)}>ยกเลิก</button>
                <button className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600" onClick={() => { setShowConfirmGift(false); giftBuy(); }}>ยืนยัน</button>
              </div>
            </div>
          </div>
        )}

        {/* iOS-style Alert */}
        {showAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  alertData.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {alertData.type === 'success' ? '✅' : '❌'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{alertData.title}</h3>
                <p className="text-gray-600">{alertData.message}</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600" onClick={() => setShowAlert(false)}>ตกลง</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
