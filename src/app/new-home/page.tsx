"use client"

import { DesignSystemGrid } from "@/components/design-system/DesignSystemGrid";
import { useState, useEffect, useRef } from "react"
// import { DesignSystemGrid } from "../../components/design-system"

export default function NewHomePage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [logoBounds, setLogoBounds] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | undefined>(undefined) // Changed back to undefined to match expected type
  // Add initialScrollValue state to control logo expansion
  const initialScrollValue = 100
  const hasScrolled = useRef(false)
  // Add refs for smooth scrolling
  const targetScrollProgress = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  // Add client-side detection
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle scroll events to track progress with smooth animation
  useEffect(() => {
    if (!isClient) return; // Skip if not client-side
    
    // Smooth animation function
    const animateScroll = () => {
      // Easing factor - higher = faster scrolling (0-1)
      // Increased for more responsive transitions
      const speedFactor = 0.6
      
      // Calculate the difference between current and target
      const delta = targetScrollProgress.current - scrollProgress
      
      // Only update if difference is significant
      if (Math.abs(delta) > 0.001) {
        // Apply the easing with speed factor
        const newProgress = scrollProgress + delta * speedFactor
        setScrollProgress(newProgress)
        
        // Continue animation
        animationFrameId.current = requestAnimationFrame(animateScroll)
      }
    }
    
    const handleScroll = () => {
      // Mark that user has scrolled
      if (!hasScrolled.current) {
        hasScrolled.current = true
      }
      
      // Get scroll position
      const scrollTop = window.scrollY
      
      // Calculate the total scrollable height of the page
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      
      // Calculate raw progress (0 to 1)
      const rawProgress = Math.min(1, scrollTop / scrollHeight)
      
      // Increased scrollMultiplier for more responsive scrolling
      // This ensures small scrolls result in bigger visual changes
      const scrollMultiplier = 15
      
      // Apply multiplier but keep within 0-1 range
      targetScrollProgress.current = Math.min(1, rawProgress * scrollMultiplier)
      
      // Start animation if not already running
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(animateScroll)
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)
    
    // Set initial scroll position
    handleScroll()
    
    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [scrollProgress, isClient])
  
  // Effect to set initial logo position
  useEffect(() => {
    if (!isClient) return; // Skip if not client-side
    
    // Set initial position for logo always in the center of the screen
    setLogoBounds({
      width: 40,
      height: 40,
      x: window.innerWidth / 2 - 20,
      y: window.innerHeight / 2 - 20
    })
    
    // Add resize listener to ensure logo stays centered when window resizes
    const handleResize = () => {
      setLogoBounds({
        width: 40,
        height: 40,
        x: window.innerWidth / 2 - 20,
        y: window.innerHeight / 2 - 20
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isClient])

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full h-screen flex flex-col items-center justify-center">
        {isClient ? (
          <DesignSystemGrid
            initialCenterItem="logo"
            entranceAnimation={true}
            scrollProgress={scrollProgress}
            logoBounds={logoBounds}
            initialScrollValue={initialScrollValue}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* Simple loading state or placeholder */}
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
} 