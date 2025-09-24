'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  Store,
  X,
  Upload
} from 'lucide-react';
import { useSelector } from 'react-redux';

export default function AdminShopPage() {
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [rankSetOptions, setRankSetOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const params = useParams();
  const user = useSelector((state) => state.user);

  const decodedType = decodeURIComponent(params?.id || '');
  const isRankType = decodedType === 'ยศ';

  const fetchData = async () => {
    try {
      const [resShops, resSheety] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get/${decodedType}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/backend`)
      ]);

      setShops(resShops.data);

      const found = resSheety.data.find(
        (entry) =>
          entry.name?.trim().toLowerCase() === user?.username?.trim().toLowerCase()
      );

      setIsAuthorized(!!found);
    } catch (error) {
      console.error('Error fetching data or checking authorization:', error);
      setIsAuthorized(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Add form fields to FormData
    Object.keys(form).forEach(key => {
      if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
        let value = form[key];
        
        // Keep as string for Optionsquantity
        if (key === 'Optionsquantity') {
          value = value === 'true' ? 'true' : 'false';
        }
        
        formData.append(key, value);
      }
    });

    if (!isRankType) {
      formData.append('rank_id', 0);
      formData.append('rank_set', 0);
    }

    // Add file if selected
    if (selectedFile) {
      formData.append('priceture', selectedFile);
    }

    try {
      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product/put/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product/post`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setForm({});
      setEditingId(null);
      setSelectedFile(null);
      setPreviewUrl('');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  const handleEdit = (shop) => {
    const editForm = { ...shop, type: decodedType };
    
    // Convert boolean strings back to Thai for Optionsquantity
    if (editForm.Optionsquantity === 'true') {
      editForm.Optionsquantity = 'true';
    } else if (editForm.Optionsquantity === 'false') {
      editForm.Optionsquantity = 'false';
    }
    
    setForm(editForm);
    setEditingId(shop.id);
    setPreviewUrl(shop.priceture || '');
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('ยืนยันการลบข้อมูลนี้ใช่หรือไม่?')) {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/del/${id}`);
      fetchData();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({});
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  useEffect(() => {
    if (user?.username) {
      fetchData();
    }
  }, [user, decodedType]);

  useEffect(() => {
    if (isRankType) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rank_set`).then(res => {
        setRankSetOptions(res.data);
      }).catch(() => setRankSetOptions([]));
    }
  }, [isRankType]);

  const formFields = [
    { name: 'name', placeholder: 'ชื่อสินค้า', type: 'text' },
    { name: 'price', placeholder: 'ราคา', type: 'number', step: '0.01' },
    { name: 'command', placeholder: 'คำสั่ง', type: 'text' },
    { name: 'Optionsquantity', placeholder: 'ปรับจำนวนได้หรือไม่', type: 'select', options: [
      { value: 'true', label: 'ใช่' },
      { value: 'false', label: 'ไม่ใช่' }
    ]},
  ];

  if (isRankType) {
    const rankSetSelectOptions = rankSetOptions.length > 0
      ? [{ id: 0, label: 'เลือกแรงที่จะให้อัพ' }, ...rankSetOptions.map(opt => ({ id: opt.id, label: String(opt.id) }))]
      : [];
    formFields.push(
      { name: 'rank_id', placeholder: 'ID ยศ', type: 'number', step: '0.01' },
      { name: 'rank_set', placeholder: 'ระดับยศที่เซ็ต', type: 'select', options: rankSetSelectOptions }
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
          <p className="text-gray-600">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* iOS-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                <img
                  src={shop.priceture}
                  alt={shop.name}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
              
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{shop.name}</h3>
                
                {shop.price && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">ราคา: ฿{shop.price}</span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(shop)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-blue-600 active:bg-blue-700"
                  >
                    <Pencil className="w-4 h-4" />
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(shop.id)}
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 border-dashed flex items-center justify-center min-h-[200px] transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setForm({
                  type: decodedType,
                  rank_id: 0,
                  rank_set: 0,
                  Optionsquantity: 'false',
                });
                setEditingId(null);
                setSelectedFile(null);
                setPreviewUrl('');
              }}
              className="flex flex-col items-center gap-3 p-6 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">เพิ่ม{decodedType}</span>
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
                    {editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}
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
                {/* Form Fields */}
                <div className="space-y-4">
    
                  {formFields.map(({ name, placeholder, type, step, options }) => {
                    if (type === 'select') {
                      return (
                        <div key={name}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {placeholder}
                          </label>
                          <select
                            value={form[name] || ''}
                            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            
                            <option value="">เลือก{placeholder}</option>
                            {options && options.map((option) => (
                              <option key={option.value || option.id || option} value={option.value || option.id || option}>
                                {option.label || option}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {placeholder}
                        </label>
                        <input
                          type={type}
                          step={step}
                          placeholder={placeholder}
                          value={form[name] || ''}
                          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    รูปภาพสินค้า
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
                          {selectedFile ? selectedFile.name : 'แตะเพื่อเลือกรูปภาพ'}
                        </span>
                      </label>
                    </div>
                    
                    {(previewUrl || selectedFile) && (
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
  );
}
