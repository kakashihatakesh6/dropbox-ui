"use client"

import { useState, useEffect, useRef } from "react"
import DesignSystem from "../components/design-system"

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const designSystemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!mainContentRef.current) return
      
      // Calculate scroll progress (0 to 1)
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = Math.min(scrollY / (maxScroll * 0.6), 1)
      
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate visibility and scale based on scroll progress
  const dropboxVisibility = 1 - Math.min(scrollProgress * 2, 1)
  const designSystemVisibility = Math.min((scrollProgress - 0.3) * 2, 1)
  const designSystemScale = 0.5 + scrollProgress * 0.5

  return (
    <div className="min-h-screen w-full relative">
      {/* Dropbox content - shrinks and fades out on scroll */}
      <div 
        ref={mainContentRef}
        className="fixed inset-0 w-full z-10 transition-all duration-300"
        style={{
          opacity: dropboxVisibility,
          transform: `scale(${1 - scrollProgress * 0.2})`,
        }}
      >
        {/* Grid Layout */}
        <div className="h-full grid grid-cols-1 md:grid-cols-[1fr,2fr,1fr] border border-gray-200 divide-x divide-gray-200">
          {/* Left empty column */}
          <div className="border-b border-gray-200"></div>

          {/* Center column with content */}
          <div className="flex w-full justify-center py-6">
            <div className="flex flex-col w-[40vw] border-1 border-gray-200 bg-white">
              {/* Top section with text */}
              <div className="min-h-[70vh] flex items-start p-8 border-gray-200">
                <h1
                  className="text-[1.5rem] md:text-[2rem] font-bold leading-[1.15]"
                  style={{
                    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    color: '#0061FF',
                    fontWeight: 700,
                  }}
                >
                  At Dropbox, our Brand <br /> Guidelines help us <br /> infuse everything we <br /> make with identity.
                </h1>
              </div>

              {/* Bottom section with logo */}
              <div className="py-8 px-16 flex justify-between items-center">
                <div className="w-10 h-10">
                  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                    <path d="M63.246 0L0 41.625l43.766 35.22 64.764-39.812-45.284-37.033zm129.728 0L147.69 37.033l64.762 39.812 43.768-35.22L193.735 0h-.761zm-129.728 115.6L0 74.336l43.766-35.033 64.764 39.626-45.284 36.672zm129.728 0L147.69 73.93l64.762-39.626 43.768 35.032-63.52 41.264zm-65.202 42.627l-45.046-36.848-45.285 36.848 45.285 37.22 45.046-37.22z" fill="#0061FF" />
                  </svg>
                </div>
                <div className="w-9 h-9">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6 6 6-6" stroke="#0061FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right empty column */}
          <div className="border-b border-gray-200"></div>
        </div>
      </div>

      {/* Design System - grows and fades in on scroll */}
      <div
        ref={designSystemRef}
        className="fixed inset-0 w-full z-0 transition-all duration-300"
        style={{
          opacity: designSystemVisibility,
          transform: `scale(${designSystemScale})`,
          pointerEvents: designSystemVisibility > 0.5 ? 'auto' : 'none',
        }}
      >
        <DesignSystem />
      </div>

      {/* Scroll indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center">
        <p className="text-xs text-gray-500 mb-2 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm">
          Scroll to explore design system
        </p>
        <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="#0061FF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Spacer to enable scrolling */}
      <div style={{ height: "300vh" }} />
    </div>
  );
}
