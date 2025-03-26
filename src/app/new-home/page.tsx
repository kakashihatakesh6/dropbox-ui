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
  } | undefined>(undefined)
  // Add initialScrollValue state to control logo expansion
  const initialScrollValue = 100
  const hasScrolled = useRef(false)

  // Handle scroll events to track progress
  useEffect(() => {
    const handleScroll = () => {
      // Mark that user has scrolled
      if (!hasScrolled.current) {
        hasScrolled.current = true;
      }
      
      // Get scroll position
      const scrollTop = window.scrollY
      
      // Calculate the total scrollable height of the page
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      
      // Calculate progress (0 to 1)
      const progress = Math.min(1, scrollTop / scrollHeight)
      
      // Update state
      setScrollProgress(progress)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)
    
    // Set initial scroll position
    handleScroll()
    
    // Clean up
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Effect to set initial logo position
  useEffect(() => {
    // Set initial position for logo always in the center of the screen
    setLogoBounds({
      width: 80,
      height: 80,
      x: window.innerWidth / 2 - 40,
      y: window.innerHeight / 2 - 40
    })
    
    // Add resize listener to ensure logo stays centered when window resizes
    const handleResize = () => {
      setLogoBounds({
        width: 80,
        height: 80,
        x: window.innerWidth / 2 - 40,
        y: window.innerHeight / 2 - 40
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <DesignSystemGrid
          initialCenterItem="logo"
          entranceAnimation={true}
          scrollProgress={scrollProgress}
          logoBounds={logoBounds}
          initialScrollValue={initialScrollValue}
        />
      </div>
    </div>
  )
} 