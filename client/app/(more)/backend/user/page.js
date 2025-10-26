"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navbar } from '@/components/Navbar_2';

export default function EditUserPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ point: '', RP: '', newPassword: '' });
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // custom alert state (JS version, no TypeScript)
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "success" // "success" or "error"
  });

  const user = useSelector((state) => state.user);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (!user?.username) {
        setIsAuthorized(false);
        return;
      }
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/backend`);
        const found = res.data.find(
          (entry) => entry.name?.trim().toLowerCase() === user?.username?.trim().toLowerCase()
        );
        setIsAuthorized(!!found);
      } catch {
        setIsAuthorized(false);
      }
    }
    checkAuth();
  }, [user]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      point: user.point,
      RP: user.RP,
      newPassword: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/user/${editingUser.id}`,
        { point: form.point, RP: form.RP, newPassword: form.newPassword, confirmPassword: form.newPassword });

      setAlert({ show: true, title: "สำเร็จ", message: "แก้ไขผู้ใช้เรียบร้อยแล้ว", type: "success" });

      setEditingUser(null);
      setShowModal(false);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/`);
      setUsers(res.data);
    } catch (err) {
      setAlert({ show: true, title: "ผิดพลาด", message: err.response?.data?.message || "เกิดข้อผิดพลาด", type: "error" });
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(query) ||
      user.id?.toString().includes(query) ||
      user.realname?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-8 max-w-5xl mx-auto text-gray-900">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">แก้ไขผู้ใช้</h1>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 ค้นหาด้วย username, ID หรือ realname..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800 placeholder-gray-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500">
              พบ <span className="font-semibold text-blue-600">{filteredUsers.length}</span> รายการ
            </p>
          )}
        </div>

        {/* table (desktop) */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl shadow-md bg-white">
          <table className="w-full text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Point</th>
                <th className="p-3">RP</th>
                <th className="p-3">Realname</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    {searchQuery ? 'ไม่พบผลการค้นหา' : 'ไม่มีข้อมูลผู้ใช้'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3 font-semibold">{u.username}</td>
                  <td className="p-3">{u.point}</td>
                  <td className="p-3">{u.RP}</td>
                  <td className="p-3">{u.realname}</td>
                  <td className="p-3">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full shadow hover:opacity-90"
                      onClick={() => handleEdit(u)}
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* cards (mobile) */}
        <div className="sm:hidden space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
              {searchQuery ? 'ไม่พบผลการค้นหา' : 'ไม่มีข้อมูลผู้ใช้'}
            </div>
          ) : (
            filteredUsers.map(u => (
            <div key={u.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {u.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{u.username}</h3>
                    <p className="text-xs text-gray-500">ID: {u.id}</p>
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow text-sm font-semibold"
                  onClick={() => handleEdit(u)}
                >
                  แก้ไข
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Point</p>
                  <p className="text-lg font-bold text-gray-800">{u.point}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">RP</p>
                  <p className="text-lg font-bold text-gray-800">{u.RP}</p>
                </div>
              </div>
              {u.realname && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Realname</p>
                  <p className="text-sm font-medium text-gray-800">{u.realname}</p>
                </div>
              )}
            </div>
            ))
          )}
        </div>

        {/* modal edit user */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <form 
              onSubmit={handleSubmit} 
              className="bg-white p-6 rounded-2xl shadow-2xl space-y-4 w-full max-w-sm"
            >
              <h2 className="text-lg font-bold text-center text-gray-800">
                ✏️ แก้ไขผู้ใช้: <span className="text-blue-600">{editingUser.username}</span>
              </h2>

              <div className="space-y-1">
                <label className="block text-gray-600 text-sm">Point</label>
                <input
                  type="number"
                  value={form.point}
                  onChange={e => setForm({ ...form, point: e.target.value })}
                  className="w-full p-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-600 text-sm">RP</label>
                <input
                  type="number"
                  value={form.RP}
                  onChange={e => setForm({ ...form, RP: e.target.value })}
                  className="w-full p-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
                  required
                />
              </div>

              <div className="space-y-1 pt-1 border-t border-gray-200">
                <label className="block text-red-500 font-semibold text-sm">รหัสผ่านใหม่ (ถ้าต้องการ)</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={e => setForm({ ...form, newPassword: e.target.value })}
                  className="w-full p-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 rounded-xl text-white font-semibold shadow hover:opacity-90">
                  บันทึก
                </button>
                <button type="button" className="flex-1 bg-gray-200 px-4 py-2 rounded-xl text-gray-800 font-semibold hover:bg-gray-300" onClick={() => setShowModal(false)}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        )}

        {/* iOS-style Alert */}
        {alert.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[999]">
            <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-2xl animate-[fadeIn_0.25s_ease-out]">
              <h3 className={`text-lg font-bold mb-2 ${alert.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {alert.title}
              </h3>
              <p className="text-gray-600 mb-4">{alert.message}</p>
              <button
                className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:opacity-90"
                onClick={() => setAlert({ ...alert, show: false })}
              >
                ตกลง
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
