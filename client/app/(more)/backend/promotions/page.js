'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Navbar } from '@/components/Navbar_2';

const emptyForm = { img: null, preview: '', rplimited: '', command: '', name: '' };

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useSelector((state) => state.user);

  const fetchPromotions = async () => {
    try {
      const [res, ress] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/promotions`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/backend`),
      ]);

      setPromotions(res.data);

      const found = ress.data.find(
        (entry) =>
          entry.name?.trim().toLowerCase() === user?.username?.trim().toLowerCase()
      );
      setIsAuthorized(!!found);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // ส่งไฟล์เฉพาะเมื่อผู้ใช้เลือกรูปใหม่ (ตอนแก้ไขไม่เลือกรูป = ใช้รูปเดิม)
      if (form.img) formData.append('img', form.img);
      formData.append('rplimited', form.rplimited);
      formData.append('command', form.command);
      formData.append('name', form.name);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/promotions/put/${editingId}`,
          formData,
          config
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/promotions/post`,
          formData,
          config
        );
      }
      closeModal();
      fetchPromotions();
    } catch (err) {
      console.error('Submit Error:', err);
    }
  };

  const handleEdit = (promo) => {
    setForm({
      img: null,
      preview: promo.img, // เก็บ URL รูปเดิมไว้แสดง preview
      rplimited: promo.rplimited,
      command: promo.command,
      name: promo.name,
    });
    setEditingId(promo.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('ยืนยันการลบโปรโมชั่นนี้ใช่หรือไม่?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/promotions/del/${id}`);
        fetchPromotions();
      } catch (err) {
        console.error('Delete Error:', err);
      }
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchPromotions();
    }
  }, [user]);

  // preview: รูปใหม่ที่เลือก > รูปเดิม
  const previewSrc = form.img ? URL.createObjectURL(form.img) : form.preview;

  if (!isAuthorized) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่มีสิทธิ์เข้าถึง
            </h2>
            <p className="text-gray-600">
              คุณไม่มีสิทธิ์เข้าถึงหน้านี้
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* iOS-style Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={promo.img}
                    alt={promo.name}
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{promo.name}</h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">RP ที่ต้องการ: {promo.rplimited}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-500 truncate">Command: {promo.command}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="flex-1 bg-blue-500 text-white px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-blue-600 active:bg-blue-700"
                    >
                      <Pencil className="w-4 h-4" />
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="flex-1 bg-red-500 text-white px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-red-600 active:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-dashed flex items-center justify-center min-h-[200px] transition-all duration-200 hover:shadow-md hover:-translate-y-1">
              <button
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                  setIsModalOpen(true);
                }}
                className="flex flex-col items-center gap-3 p-6 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">เพิ่มโปรโมชั่น</span>
              </button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end sm:items-center z-50 p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* iOS-style Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingId ? 'แก้ไขโปรโมชั่น' : 'เพิ่มโปรโมชั่น'}
                  </h2>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* iOS-style Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    รูปภาพโปรโมชั่น
                  </label>
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setForm({ ...form, img: file });
                        }}
                        className="hidden"
                        id="image-upload"
                        required={!editingId}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                          <Plus className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {editingId ? 'แตะเพื่อเปลี่ยนรูปภาพ (ไม่บังคับ)' : 'แตะเพื่อเลือกรูปภาพ'}
                        </span>
                      </label>
                    </div>

                    {previewSrc && (
                      <div className="flex justify-center">
                        <img
                          src={previewSrc}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-2xl border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อโปรโมชั่น
                    </label>
                    <input
                      type="text"
                      placeholder="กรอกชื่อโปรโมชั่น"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RP ที่ต้องการ
                    </label>
                    <input
                      type="number"
                      placeholder="กรอกจำนวน RP"
                      value={form.rplimited}
                      onChange={(e) => setForm({ ...form, rplimited: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Command
                    </label>
                    <input
                      type="text"
                      placeholder="กรอกคำสั่ง"
                      value={form.command}
                      onChange={(e) => setForm({ ...form, command: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* iOS-style Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors active:bg-gray-300"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors active:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    {editingId ? (
                      <>
                        <Pencil className="w-4 h-4" />
                        แก้ไข
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        เพิ่ม
                      </>
                    )}
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