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

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-8 max-w-5xl mx-auto text-gray-900">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">แก้ไขผู้ใช้</h1>

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
              {users.map(u => (
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
              ))}
            </tbody>
          </table>
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
