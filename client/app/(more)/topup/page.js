'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { setPoint } from '@/redux/userSlice'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const TopupPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const [formData, setFormData] = useState({ code: '' })
  const [selectedFile, setSelectedFile] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('angpao')
  const [loading, setLoading] = useState(false)
  const [promotions, setPromotions] = useState([])
  const [promoLoading, setPromoLoading] = useState(true)

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState({ type: '', title: '', message: '' })

  const showIOSAlert = (type, title, message) => {
    setAlertData({ type, title, message })
    setShowAlert(true)
  }

  useEffect(() => {
    if (user.id === -1) router.push('/')
  }, [user.id, router])

  if (typeof user.id !== 'number') {
    return <div className="text-black text-center py-20">กำลังโหลดข้อมูลผู้ใช้...</div>
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        showIOSAlert('error', 'ไฟล์ไม่ถูกต้อง', 'กรุณาเลือกไฟล์รูปภาพเท่านั้น')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        showIOSAlert('error', 'ไฟล์ใหญ่เกินไป', 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let response, data
      if (paymentMethod === 'angpao') {
        response = await fetch(apiUrl + '/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerName: user.username, code: formData.code, userId: user.id }),
        })
        data = await response.json()
      } else {
        if (!selectedFile) {
          showIOSAlert('error', 'กรุณาเลือกไฟล์', 'กรุณาเลือกไฟล์สลิปการโอนเงิน')
          setLoading(false)
          return
        }

        const formDataToSend = new FormData()
        formDataToSend.append('files', selectedFile)
        formDataToSend.append('playerName', user.username)
        formDataToSend.append('userId', user.id)

        response = await fetch(apiUrl + '/slipok', { method: 'POST', body: formDataToSend })
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) data = await response.json()
        else data = await response.text()
      }

      if (response.ok) {
        if (paymentMethod === 'angpao') {
          dispatch(setPoint(user.point + data.points))
          showIOSAlert('success', 'ทำรายการสำเร็จ', `ได้รับ ${data.points} พอยต์`)
          setFormData({ code: '' })
        } else {
          showIOSAlert('success', 'อัปโหลดสำเร็จ', 'สลิปการโอนเงินของคุณถูกส่งเรียบร้อยแล้ว กรุณารอการตรวจสอบ')
          setSelectedFile(null)
          const fileInput = document.getElementById('file-upload')
          if (fileInput) fileInput.value = ''
        }
      } else showIOSAlert('error', 'เกิดข้อผิดพลาด', (data && data.message) || 'ไม่สามารถทำรายการได้')
    } catch (error) {
      console.error('Error:', error)
      showIOSAlert('error', 'เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchPromotions = async () => {
      setPromoLoading(true)
      try {
        const res = await fetch(apiUrl + '/promotions/' + user.username)
        const data = await res.json()
        setPromotions(data)
      } catch (e) {
        setPromotions([])
      } finally {
        setPromoLoading(false)
      }
    }
    if (user.username) fetchPromotions()
  }, [user.username])

  const handleGetPromotion = async (idpromotions) => {
    if (!user.id) return
    try {
      const res = await fetch(apiUrl + '/getpromotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promotionsid: idpromotions, userId: user.id }),
      })
      const data = await res.json()
      if (res.ok) showIOSAlert('success', 'รับของสำเร็จ', data.message || 'รับของเรียบร้อยแล้ว')
      else showIOSAlert('error', 'รับของไม่สำเร็จ', data.message || 'เกิดข้อผิดพลาด')
    } catch {
      showIOSAlert('error', 'เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* PROMOTION SECTION */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="glass-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">โปรโมชั่นเติมเงินสะสม</h2>
          </div>
          {promoLoading ? (
            <div className="text-center text-white/70">กำลังโหลดโปรโมชั่น...</div>
          ) : promotions.length === 0 ? (
            <div className="text-center text-white text-lg font-bold py-8">คุณได้รับไปหมดแล้ว</div>
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-2 promo-scrollbar">
              {promotions.map((promo) => {
                const eligible = user.RP >= promo.rplimited
                return (
                  <div
                    key={promo.id}
                    className="glass-white rounded-xl p-6 flex flex-col items-center shadow-lg min-w-[260px] max-w-[280px] flex-shrink-0"
                  >
                    <img src={promo.img.replace('./', '/f/public/')} alt={promo.name} className="w-24 h-24 object-contain mb-4" />
                    <div className="text-lg font-semibold mb-2 text-white">{promo.rplimited} บาท</div>
                    <button
                      disabled={!eligible}
                      className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 ${
                        eligible ? 'bg-white/40 text-white hover:bg-white/60' : 'bg-white/10 text-white/50 cursor-not-allowed'
                      }`}
                      onClick={() => eligible && handleGetPromotion(promo.id)}
                    >
                      {eligible ? 'รับของ' : `ขาดอีก ${promo.rplimited - user.RP} บาท`}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* TOPUP FORM */}
      <div className="max-w-xl mx-auto">
        <div className="glass-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">เติมเงิน</h1>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-white/10 border border-white/35 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('angpao')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  paymentMethod === 'angpao' ? 'bg-white/40 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                ซองอังเปา
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  paymentMethod === 'bank' ? 'bg-white/40 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                สลิปธนาคาร
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {paymentMethod === 'bank' ? (
              <div className="mb-6 text-center">
                <div className="inline-block glass-white border rounded-lg px-6 py-4 mb-2">
                  <div className="text-lg font-bold text-white">เลขบัญชี: 0651988799</div>
                  <div className="text-base text-white">ธนาคารกสิกรไทย</div>
                  <div className="text-base text-white">ชื่อบัญชี: บุญส่ง เขียวแก้ว</div>
                </div>
                <div className="text-xs text-white/70">* กรุณาโอนเงินเข้าบัญชีนี้และอัปโหลดสลิป</div>
              </div>
            ) : (
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-white mb-2">
                  ลิงก์ซองอังเปา
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-white/35 rounded-lg focus:ring-2 focus:ring-white bg-white/10 text-white placeholder-white/50"
                  placeholder="วางลิ้งซองอังเปา"
                />
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-white mb-2">
                  สลิปการโอนเงิน
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/35 border-dashed rounded-lg hover:border-white/50 transition-colors bg-white/10">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-white/50" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-white/80">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-white hover:text-white/80">
                        <span>อัปโหลดไฟล์</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">หรือลากและวาง</p>
                    </div>
                    <p className="text-xs text-white/50">PNG, JPG, GIF ขนาดไม่เกิน 5MB</p>
                  </div>
                </div>
                {selectedFile && <div className="mt-2 text-sm text-green-400">✓ เลือกไฟล์แล้ว: {selectedFile.name}</div>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/40 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/60 focus:ring-2 focus:ring-white transition duration-200 disabled:opacity-50"
            >
              {loading ? 'กำลังประมวลผล...' : paymentMethod === 'angpao' ? 'ยืนยันการเติมเงิน' : 'อัปโหลดสลิป'}
            </button>
          </form>
        </div>
      </div>
    
      {/* iOS-style Alert rr */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                alertData.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {alertData.type === 'success' ? '✓' : '✕'}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{alertData.title}</h3>
              <p className="text-gray-700 mb-4">{alertData.message}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
                onClick={() => setShowAlert(false)}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopupPage
