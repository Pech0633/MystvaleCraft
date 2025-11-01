"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navbar } from "@/components/Navbar_2";
import { TextCursor, X } from "lucide-react";
import { show } from "@/redux/storage/LoginSlice";

export default function EditCodePage() {
  const [codes, setCodes] = useState([]);
  const [editingCode, setEditingCode] = useState(null);
  const [form, setForm] = useState({ command: "", point: "", equal: "" });
  const [showModal, setShowModal] = useState(false);
  const [showC, setShowC] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(null);
  const user = useSelector((state) => state.user);
  const [mode, setmode] = useState("command");

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


  useEffect(() => {
    if (isAuthorized) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/getcode`)
        .then((res) => setCodes(res.data))
        .catch(() => setCodes([]));
    }
  }, [isAuthorized]);
    const ss = () => {
      setmode("command");  
    };
  const handleEdit = (code) => {
    setEditingCode(code);
    if (code.point > 1) {
      setmode("point");
      if (mode == "point"){
        setForm({
          command: code.command,
          point: code.point,
          equal: code.equal,
        });
      }else{
        setForm({
          command: code.command,
          point: 0,
          equal: code.equal,
        });
      }
    }

    setShowModal(true);
  };

  const Csamit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/code`,
        form
      );
      setShowC(false);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getcode`);
      setCodes(res.data);
    }catch (err) {
      alert("เกิดข้อผิดพลาดในการสร้างข้อมูล");
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/code/${editingCode.id}`,
        form
      );
      setShowModal(false);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getcode`);
      setCodes(res.data);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

const handleDelete = async (codeId) => {
  if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโค้ดนี้?")) {
    return;
  }
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/code/dl/${codeId}`);
    setCodes((prevCodes) => prevCodes.filter((c) => c.id !== codeId));
  } catch (err) {
    console.error("Error deleting code:", err);
    alert("เกิดข้อผิดพลาดในการลบข้อมูล");
  }
};

  const filteredCodes = codes.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.command?.toLowerCase().includes(query) ||
      c.equal?.toLowerCase().includes(query) ||
      c.id?.toString().includes(query)
    );
  });

  // 🔄 กำลังโหลดสิทธิ์
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }
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
 
  // ✅ หน้าจัดการ Code
  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-8 max-w-5xl mx-auto text-gray-900">
        <h1 className="text-2xl font-bold mb-6 text-center">
          จัดการรหัส Code
        </h1>

        {/* กล่องค้นหา */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ค้นหาโค้ดหรือคำสั่ง..."
            className="border rounded-lg p-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="py-2 px-4 text-left">Equal</th>
                <th className="py-2 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredCodes.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{c.equal}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      แก้ไข
                    </button>
              <button
                  onClick={() => handleDelete(c.id)} // เรียกใช้ฟังก์ชัน handleDelete ที่ปรับปรุงใหม่
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
              ลบ
            </button>
                  </td>
                </tr>
              ))}
            </tbody> 
          </table>
        </div>
      <div className="w-full text-center mt-4 text-white">
        <button
          className="bg-green-500 p-2 w-10 rounded-2xl"
          onClick={() => setShowC(true)}
        >
          +
        </button>
      </div>

      {showC && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">เพิ่มโค้ดใหม่</h2>

            <form onSubmit={Csamit}>
              <label className="block mb-2 text-sm font-medium">Equal:</label>
              <input
                type="text"
                className="border p-2 rounded-lg w-full mb-4"
                value={form.equal}
                onChange={(e) => setForm({ ...form, equal: e.target.value })}
              />
            <div className="flex justify-center mb-4 gap-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg ${
                  mode === "command"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setmode("command")}
              >
                Command
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg ${
                  mode === "point"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setmode("point")}
              >
                Point
              </button>
            </div>
              {mode === "command" && (
                <>
                  <label className="block mb-2 text-sm font-medium">
                    Command:
                  </label>
                  <input
                    type="text"
                    className="border p-2 rounded-lg w-full mb-4"
                    value={form.command}
                    onChange={(e) =>
                      setForm({ ...form, command: e.target.value })
                    }
                  />
                </>
              )}
              {mode === "point" && (
                <>
                  <label className="block mb-2 text-sm font-medium">
                    Point:
                  </label>
                  <input
                    type="number"
                    className="border p-2 rounded-lg w-full mb-4"
                    value={form.point}
                    onChange={(e) =>
                      setForm({ ...form, point: e.target.value })
                    }
                  />
                </>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setShowC(false) && ss()} 
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  สร้าง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                แก้ไขโค้ด: {editingCode.equal}
              </h2>
              <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium">Equal:</label>
                <input
                  type="text"
                  className="border p-2 rounded-lg w-full mb-4"
                  value={form.equal}
                  onChange={(e) => setForm({ ...form, equal: e.target.value })}
                />
            <div className="flex justify-center mb-4 gap-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg ${
                  mode === "command"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setmode("command")}
              >
                Command
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg ${
                  mode === "point"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setmode("point")}
              >
                Point
              </button>
            </div>
              {mode === "command" && (
                <>
                  <label className="block mb-2 text-sm font-medium">
                    Command:
                  </label>
                  <input
                    type="text"
                    className="border p-2 rounded-lg w-full mb-4"
                    value={form.command}
                    onChange={(e) =>
                      setForm({ ...form, command: e.target.value })
                    }
                  />
                </>
              )}
              {mode === "point" && (
                <>
                  <label className="block mb-2 text-sm font-medium">
                    Point:
                  </label>
                  <input
                    type="number"
                    className="border p-2 rounded-lg w-full mb-4"
                    value={form.point}
                    onChange={(e) =>
                      setForm({ ...form, point: e.target.value })
                    }
                  />
                </>
              )}
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
