"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Microscope, Pill, Stethoscope, Syringe, Thermometer } from "lucide-react"
import Link from "next/link"

export default function LabReportAnalyzer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Canvas Background Animation
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Medical symbols for background
    const symbols = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.3 + 0.1,
    }))

    // Animation loop for canvas
    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      symbols.forEach((symbol) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(59, 130, 246, ${symbol.opacity})`
        ctx.lineWidth = 2

        ctx.moveTo(symbol.x - symbol.size / 2, symbol.y)
        ctx.lineTo(symbol.x + symbol.size / 2, symbol.y)
        ctx.moveTo(symbol.x, symbol.y - symbol.size / 2)
        ctx.lineTo(symbol.x, symbol.y + symbol.size / 2)

        ctx.stroke()

        symbol.y += symbol.speed
        if (symbol.y > canvas.height) {
          symbol.y = -symbol.size
          symbol.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    // GSAP Animations for floating medical icons
    const icons = iconsRef.current?.children
    if (icons) {
      Array.from(icons).forEach((icon, index) => {
        gsap.to(icon, {
          y: `${Math.sin(index) * 20}`,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        })
      })
    }

    // Page entrance animation
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    })

    // Button hover animations
    const buttons = document.querySelectorAll(".animate-button")
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", (e) => {
        const target = e.currentTarget as HTMLElement
        gsap.to(target, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        })
      })

      button.addEventListener("mouseleave", (e) => {
        const target = e.currentTarget as HTMLElement
        gsap.to(target, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      })
    })

    return () => {
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Floating medical icons */}
      <div ref={iconsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute left-10 top-1/4">
          <Microscope className="w-12 h-12 text-blue-400/30" />
        </div>
        <div className="absolute right-10 top-1/3">
          <Stethoscope className="w-16 h-16 text-blue-500/20" />
        </div>
        <div className="absolute left-1/4 bottom-1/4">
          <Thermometer className="w-10 h-10 text-blue-300/40" />
        </div>
        <div className="absolute right-1/4 top-1/4">
          <Syringe className="w-14 h-14 text-blue-400/25" />
        </div>
        <div className="absolute right-1/3 bottom-1/3">
          <Pill className="w-12 h-12 text-blue-300/30" />
        </div>
      </div>

      {/* Main content */}
      <div ref={containerRef} className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Lab Report Analyzer</h1>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <Link
            href="/appointment"
            className="animate-button relative group px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-blue-200/50 hover:shadow-xl"
          >
            <span className="relative z-10">Book Your Appointment</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/Onlinepharmacy"
            className="animate-button relative group px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-green-200/50 hover:shadow-xl"
          >
            <span className="relative z-10">Buy Medicine</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        {/* Iframe Container */}
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="aspect-video">
            <iframe
              src="https://app.dante-ai.com/embed/?kb_id=3a286c00-ac41-4a29-86f7-b94c8c5e4361&token=f23d8f79-b62a-4ab6-93a0-0290b3c5e58a&modeltype=gpt-4-omnimodel-mini&tabs=false"
              allow="clipboard-write; clipboard-read; *;microphone *"
              className="w-full h-[500px] rounded-lg"
              frameBorder="0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}