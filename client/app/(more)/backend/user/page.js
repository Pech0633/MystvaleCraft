"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navbar } from '@/components/Navbar_2';
import { X } from 'lucide-react'; // ใช้สำหรับไอคอน ❌

export default function EditUserPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ point: '', RP: '', newPassword: '' });
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "success"
  });

  const user = useSelector((state) => state.user);
  const [isAuthorized, setIsAuthorized] = useState(null); // null = กำลังโหลด

  // ✅ ตรวจสอบสิทธิ์ผู้ใช้
  useEffect(() => {
    async function checkAuth() {
      if (!user?.username) {
        setIsAuthorized(false);
        return;
      }
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/backend`);
        const found = res.data.find(
          (entry) =>
            entry.name?.trim().toLowerCase() ===
            user?.username?.trim().toLowerCase()
        );
        setIsAuthorized(!!found);
      } catch {
        setIsAuthorized(false);
      }
    }
    checkAuth();
  }, [user]);

  // ✅ โหลดข้อมูลผู้ใช้ (ถ้าได้รับอนุญาตเท่านั้น)
  useEffect(() => {
    if (isAuthorized) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/`)
        .then((res) => setUsers(res.data))
        .catch(() => setUsers([]));
    }
  }, [isAuthorized]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      point: user.point,
      RP: user.RP,
      newPassword: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/user/${editingUser.id}`,
        {
          point: form.point,
          RP: form.RP,
          newPassword: form.newPassword,
          confirmPassword: form.newPassword,
        }
      );

      setAlert({
        show: true,
        title: "สำเร็จ",
        message: "แก้ไขผู้ใช้เรียบร้อยแล้ว",
        type: "success",
      });

      setEditingUser(null);
      setShowModal(false);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/`);
      setUsers(res.data);
    } catch (err) {
      setAlert({
        show: true,
        title: "ผิดพลาด",
        message: err.response?.data?.message || "เกิดข้อผิดพลาด",
        type: "error",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(query) ||
      user.id?.toString().includes(query) ||
      user.realname?.toLowerCase().includes(query)
    );
  });

  // ⏳ ระหว่างตรวจสอบสิทธิ์
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  // 🚫 ถ้าไม่ตรงชื่อใน backend → แสดงหน้าไม่มีสิทธิ์
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ไม่มีสิทธิ์เข้าถึง
          </h2>
          <p className="text-gray-600 mb-6">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <a
            href="/"
            className="inline-block px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:opacity-90"
          >
            กลับหน้าหลัก
          </a>
        </div>
      </div>
    );
  }

  // ✅ แสดงข้อมูลเมื่อผ่านสิทธิ์
  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-8 max-w-5xl mx-auto text-gray-900">
        <h1 className="text-2xl font-bold mb-6 text-center">จัดการผู้ใช้</h1>

        {/* กล่องค้นหา */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            className="border rounded-lg p-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ตารางข้อมูล */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">ชื่อผู้ใช้</th>
                <th className="py-2 px-4 text-left">ชื่อจริง</th>
                <th className="py-2 px-4 text-left">Point</th>
                <th className="py-2 px-4 text-left">RP</th>
                <th className="py-2 px-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.username}</td>
                  <td className="py-2 px-4">{u.realname}</td>
                  <td className="py-2 px-4">{u.point}</td>
                  <td className="py-2 px-4">{u.RP}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal แก้ไขข้อมูล */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                แก้ไขข้อมูล: {editingUser.username}
              </h2>
              <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium">
                  Point:
                </label>
                <input
                  type="number"
                  className="border p-2 rounded-lg w-full mb-3"
                  value={form.point}
                  onChange={(e) => setForm({ ...form, point: e.target.value })}
                />
                <label className="block mb-2 text-sm font-medium">RP:</label>
                <input
                  type="number"
                  className="border p-2 rounded-lg w-full mb-3"
                  value={form.RP}
                  onChange={(e) => setForm({ ...form, RP: e.target.value })}
                />
                <label className="block mb-2 text-sm font-medium">
                  รหัสผ่านใหม่:
                </label>
                <input
                  type="password"
                  className="border p-2 rounded-lg w-full mb-4"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                    onClick={() => setShowModal(false)}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
