'use client';

import { setRanks } from '@/redux/storage/ranks';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/userSlice';
import Swal from 'sweetalert2'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const dispatch = useDispatch();
  const ranks = useSelector(state => state.ranks.ranks);
  const user = useSelector((state) => state.user);
  const [buys, sbuys] = useState(false);

  useEffect(() => {
    if (ranks.length > 0) return;
    fetch(apiUrl + '/ranks')
      .then(res => res.json())
      .then(data => {
        dispatch(setRanks(data));
        console.log(data);
      })
      .catch(err => console.error(err));
  }, [ranks]);

  const popup = (id, idrank, image) => {
    Swal.fire({
      title: "ซื้อสินค้า",
      text: "คุณแน่ใจว่าจะซื้อใช่ไหม",
      imageUrl: image,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ซื้อ",
      cancelButtonText: "ไม่"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(apiUrl + '/buyrank', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rankId: id, userId: user.id, quantity: 1, idrank: idrank}) 
        })  
        .then(res => res.json())
        .then(data => {
          if (data.status == true) {
            Swal.fire({
              title: data.message,
              icon: "success",
              draggable: true
            });
          }else{
            Swal.fire({
              title: data.message,
              icon: "error",
              draggable: true
            });
          }
        });
      }
    });
  }

  const buyss = () => {
    sbuys(true);
  };
  

const [rankId, setrankId] = useState([]);
const [quantity, setquantity] = useState([]);
const [idrank, setidrank] = useState([]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">ยศทั้งหมด</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {ranks.map(r => (
          <div
            key={r.id}
            className="bg-amber-50 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 rounded-xl shadow-md flex flex-col justify-between items-center transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="font-extrabold text-lg text-center">{r.name}</div>
            <img
              src={r.priceture}
              alt={r.name}
              className="w-20 h-20 object-contain my-2 transition-transform duration-300 hover:scale-105"
            />
            <div className="text-sm">ราคา: {r.price} บาท</div>
            <button
              className="mt-2 bg-orange-500 hover:bg-orange-600 text-white py-1 px-4 rounded transition-all duration-300 hover:scale-105 shadow hover:shadow-lg"
             onClick={buyss}
            >
              ซื้อเลย
            </button>
          </div>
        ))}
       {buys && 
           <div className="fixed inset-0 bg-black/70 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
           <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
             <div className="text-center">
               <h3 className="text-2xl font-bold text-gray-900">Modal Title</h3>
               <div className="mt-2 px-7 py-3">
                 <p className="text-lg text-gray-500">Modal Body</p>
               </div>
               <div className="flex justify-center mt-4">
     
                 <button
                   className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                 onClick={() => sbuys(false)}
                 >
                   Close
                 </button>
     
               </div>
             </div>
           </div>
         </div>
       }
      </div>
    </div>
  );
};

export default Page;
