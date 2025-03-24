"use client"

import { useState, useEffect, useRef } from "react"
import DesignSystem from "../components/design-system"
import DropboxInterface from "../components/DropboxInterface"

export default function Home() {
  // Initialize with zero for no animation on page load
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const designSystemRef = useRef<HTMLDivElement>(null)
  const logoBoxRef = useRef<HTMLDivElement>(null)

  // Track if the transition to logo box is complete
  const [transitionComplete, setTransitionComplete] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!mainContentRef.current) return
      
      if (!hasScrolled && window.scrollY > 0) {
        setHasScrolled(true)
      }
      
      // Calculate scroll progress (0 to 1) with improved smoothing
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const documentHeight = document.body.scrollHeight - viewportHeight
      
      // Use a much smaller factor to significantly slow down the progress
      // This ensures the animation completes over a longer scroll distance
      const progress = Math.min(scrollY / (documentHeight * 0.08), 1)
      
      // Apply a gentler easing function for smoother, slower transitions
      // This modified ease-out function gives a more gradual feeling to the scroll
      const easedProgress = progress < 0.4
        ? 2 * progress * progress  // Slower initial acceleration
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;  // Smoother deceleration
      
      setScrollProgress(easedProgress)
      
      // Set transition complete flag at 80% progress (extended from 70%)
      setTransitionComplete(easedProgress > 0.8)
    }

    // Don't trigger initial calculation on page load
    window.addEventListener('scroll', handleScroll)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Only show design system if user has scrolled and Dropbox has reduced enough
  // Delay the design system appearance until scrollProgress is at least 0.2
  const designSystemVisibility = hasScrolled && scrollProgress >= 0.15 
    ? Math.min((scrollProgress - 0.15) * 1.2, 1) 
    : 0
    
  // Start design system smaller and grow it as we scroll, but only if user has scrolled
  const designSystemScale = hasScrolled 
    ? (0.15 + (scrollProgress > 0.15 ? (scrollProgress - 0.15) : 0) * 0.85) 
    : 0.15

  return (
    // Drop Box Interface
    <div className="min-h-screen w-full relative">
      {/* Dropbox content - shrinks and fades out on scroll */}
      <div ref={mainContentRef}>
        <DropboxInterface
          scrollProgress={scrollProgress}
          transitionComplete={transitionComplete}
          logoBoxRef={logoBoxRef as React.RefObject<HTMLDivElement>}
        />
      </div>

      {/* Design System - grows and fades in on scroll with entrance from sides */}
      <div
        ref={designSystemRef}
        className="fixed inset-0 w-full z-10 transition-all duration-700 ease-in-out"
        style={{
          opacity: designSystemVisibility,
          transform: `scale(${designSystemScale})`,
          // Only allow interactions with design system when it's visible enough
          pointerEvents: designSystemVisibility > 0.5 ? 'auto' : 'none',
        }}
      >
        <DesignSystem initialCenterItem="logo" entranceAnimation={hasScrolled} scrollProgress={hasScrolled ? scrollProgress : 0} />
      </div>

      {/* Scroll indicator */}
      <div 
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center transition-opacity duration-500"
        style={{ opacity: scrollProgress > 0.5 ? 0 : 1 - scrollProgress * 1.5 }}
      >
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
      <div style={{ height: "250vh" }} />
    </div>
  );
}
