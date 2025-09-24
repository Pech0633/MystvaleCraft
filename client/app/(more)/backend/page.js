'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Plus,
  Pencil,
  Trash2,
  Store,
  ShoppingCart,
  X,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Navbar } from '@/components/Navbar_2';

export default function AdminShopPage() {
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState({ name: '', href: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useSelector((state) => state.user);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const fetchShops = async () => {
    try {
      const [res, ress] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shop/get`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/backend`),
      ]);

      // set ข้อมูลร้านค้า
      setShops(res.data);
      const found = ress.data.find(
        (entry) =>
          entry.name?.trim().toLowerCase() === user?.username?.trim().toLowerCase()
      );

      setIsAuthorized(!!found);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!form.name || !form.href) {
      alert('กรุณากรอกชื่อร้านค้าและลิงก์ปลายทาง');
      return;
    }
    
    if (!selectedImage && !editingId) {
      alert('กรุณาเลือกภาพ');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('href', form.href);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/shop/put/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/shop/post`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      setForm({ name: '', href: '' });
      setSelectedImage(null);
      setPreviewUrl('');
      setEditingId(null);
      setIsModalOpen(false);
      fetchShops();
    } catch (err) {
      console.error('Submit Error:', err);
      if (err.response?.status === 413) {
        alert('ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)');
      } else if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    }
  };

  const handleEdit = (shop) => {
    setForm({ name: shop.name, href: shop.href });
    setSelectedImage(null);
    setPreviewUrl(shop.image || '');
    setEditingId(shop.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('ยืนยันการลบข้อมูลนี้ใช่หรือไม่?')) {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/shop/del/${id}`);
      fetchShops();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ name: '', href: '' });
    setSelectedImage(null);
    setPreviewUrl('');
    setEditingId(null);
  };

  useEffect(() => {
    // เรียก fetchShops ก็ต่อเมื่อ user มี username
    if (user?.username) {
      fetchShops();
    }
  }, [user]);

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
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1"
              >
                <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{shop.name}</h3>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(shop)}
                      className="bg-blue-500 text-white px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-blue-600 active:bg-blue-700"
                    >
                      <Pencil className="w-4 h-4" />
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(shop.id)}
                      className="bg-red-500 text-white px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-red-600 active:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      ลบ
                    </button>
                    <Link
                      href={'/backend/' + shop.href}
                      className="bg-green-500 text-white px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-green-600 active:bg-green-700"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      จัดการสินค้า
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Button */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 border-dashed flex items-center justify-center min-h-[200px] transition-all duration-200 hover:shadow-md hover:-translate-y-1">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setForm({ name: '', href: '' });
                  setSelectedImage(null);
                  setPreviewUrl('');
                  setEditingId(null);
                }}
                className="flex flex-col items-center gap-3 p-6 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">เพิ่มร้านค้า</span>
              </button>
            </div>
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
                    {editingId ? 'แก้ไขร้านค้า' : 'เพิ่มร้านค้า'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* iOS-style Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Shop Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อร้านค้า
                  </label>
                  <input
                    type="text"
                    placeholder="กรอกชื่อร้านค้า"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    รูปภาพร้านค้า
                  </label>
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {selectedImage ? selectedImage.name : 'แตะเพื่อเลือกรูปภาพ'}
                        </span>
                      </label>
                    </div>
                    
                    {(previewUrl || selectedImage) && (
                      <div className="flex justify-center">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-2xl border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ลิงก์ปลายทาง
                  </label>
                  <input
                    type="text"
                    placeholder="กรอกลิงก์ปลายทาง"
                    value={form.href}
                    onChange={(e) => setForm({ ...form, href: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
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
    </>
  );
}
