'use client'
import { useEffect, useRef, useState } from 'react'

export default function MouseGlow() {
  const maskRef = useRef(null)
  const glowRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const [hasMouse, setHasMouse] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')
    setHasMouse(mediaQuery.matches)

    const handleChange = () => {
      setHasMouse(mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!hasMouse) return

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const update = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1

      const x = pos.current.x
      const y = pos.current.y

      const glowEffect = `
        radial-gradient(circle at ${x}px ${y}px,
          rgba(255, 255, 255, 0.9) 0px,
          rgba(255, 180, 80, 0.6) 60px,
          rgba(255, 70, 0, 0.4) 120px,
          transparent 220px
        )
      `

      const maskEffect = `
        radial-gradient(circle at ${x}px ${y}px,
          white 100px,
          transparent 250px
        )
      `

      if (glowRef.current) {
        glowRef.current.style.background = glowEffect
      }

      if (maskRef.current) {
        maskRef.current.style.webkitMaskImage = maskEffect
        maskRef.current.style.maskImage = maskEffect
      }

      requestAnimationFrame(update)
    }

    window.addEventListener('mousemove', handleMouseMove)
    requestAnimationFrame(update)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [hasMouse])

  if (!hasMouse) return null

  return (
    <>
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
          filter: 'blur(80px)',
          transition: 'background 0.2s ease',
        }}
      />

      <div
        ref={maskRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
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
