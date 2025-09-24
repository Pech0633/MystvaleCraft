'use client'
import { useEffect, useRef } from 'react'

export default function MouseGlow() {
  const maskRef = useRef(null)
  const glowRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const update = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.08
      pos.current.y += (mouse.current.y - pos.current.y) * 0.08

      // ปรับขนาดวงแสงให้เล็กลงครึ่งหนึ่ง
      const gradient = `radial-gradient(circle at ${pos.current.x}px ${pos.current.y}px, white 75px, transparent 200px)`
      const blueGlow = `radial-gradient(circle at ${pos.current.x}px ${pos.current.y}px, rgba(0, 100, 255, 0.3), transparent 250px)`

      if (maskRef.current) {
        maskRef.current.style.webkitMaskImage = gradient
        maskRef.current.style.maskImage = gradient
      }

      if (glowRef.current) {
        glowRef.current.style.background = blueGlow
      }

      requestAnimationFrame(update)
    }

    window.addEventListener('mousemove', handleMouseMove)
    requestAnimationFrame(update)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* แสงน้ำเงิน */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: -3,
          background: 'none',
          filter: 'blur(60px)',
        }}
      />

      {/* ตารางแสดงเมื่ออยู่ในแสง */}
      <div
        ref={maskRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          WebkitMaskImage: 'none',
          maskImage: 'none',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          zIndex: -2,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
