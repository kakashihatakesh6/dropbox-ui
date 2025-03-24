"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import DropboxInterface from "./DropboxInterface"
import DesignSystem from "./design-system"

interface BrandTransitionProps {
  // Total scroll height (vh units)
  scrollHeight?: number;
  // Threshold at which transition is complete (0-1)
  completionThreshold?: number;
  // Controls how quickly the DesignSystem fades in (lower = slower fade)
  fadeInRate?: number;
  // When to start enabling pointer events on DesignSystem (0-1)
  pointerEventThreshold?: number;
}

export default function BrandTransition({
  scrollHeight = 500,
  completionThreshold = 0.9,
  fadeInRate = 2.5,
  pointerEventThreshold = 0.4,
}: BrandTransitionProps = {}) {
  // Track scroll position
  const [scrollProgress, setScrollProgress] = useState(0)
  const [transitionComplete, setTransitionComplete] = useState(false)
  
  // Ref for logo box in Dropbox interface - ensure it's typed correctly
  const logoBoxRef = useRef<HTMLDivElement>(null)
  
  // Track logo position for transition
  const [logoBounds, setLogoBounds] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null)

  // Handle logo position changes - use useCallback to avoid recreating on each render
  const handleLogoPositionChange = useCallback((bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    // Compare with previous bounds to avoid unnecessary updates
    setLogoBounds(prevBounds => {
      if (!prevBounds || 
          bounds.x !== prevBounds.x ||
          bounds.y !== prevBounds.y ||
          bounds.width !== prevBounds.width ||
          bounds.height !== prevBounds.height) {
        return bounds;
      }
      return prevBounds;
    });
  }, []);

  // Handle scroll events with smooth damping
  useEffect(() => {
    // Get the total scrollable height of the page
    // Subtract window height to get actual scrollable distance
    const getMaxScroll = () => document.body.scrollHeight - window.innerHeight
    
    let targetProgress = 0
    let currentProgress = 0
    let rafId: number | null = null
    let isAnimating = false
    
    // Smoothly animate scroll progress with damped effect
    const animateProgress = () => {
      // Damping factor (0-1) - higher = smoother but slower
      const dampFactor = 0.1
      
      // Calculate the difference between target and current
      const delta = targetProgress - currentProgress
      
      // Apply damping - only move a percentage of the distance each frame
      currentProgress += delta * dampFactor
      
      // Only update state if there's a meaningful change to avoid unnecessary rerenders
      if (Math.abs(delta) > 0.001) {
        setScrollProgress(currentProgress)
        
        // Set transition complete when progress reaches threshold
        if (currentProgress >= completionThreshold !== transitionComplete) {
          setTransitionComplete(currentProgress >= completionThreshold)
        }
        
        // Continue animation
        rafId = requestAnimationFrame(animateProgress)
      } else {
        isAnimating = false
      }
    }
    
    // Update target progress on scroll
    const handleScroll = () => {
      const maxScroll = getMaxScroll()
      // Calculate scroll progress (0 to 1)
      targetProgress = Math.min(1, window.scrollY / maxScroll)
      
      // Start animation if not already running
      if (!isAnimating) {
        isAnimating = true
        rafId = requestAnimationFrame(animateProgress)
      }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll)
    
    // Update on window resize
    window.addEventListener('resize', handleScroll)
    
    // Initial calculation
    handleScroll()
    
    // Cleanup
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [completionThreshold, transitionComplete]) // Include transitionComplete in dependencies

  return (
    <div className="relative">
      {/* This div ensures we have enough scroll space for the animation */}
      <div style={{ height: `${scrollHeight}vh` }} />
      
      {/* Dropbox Interface (visible at start, fades out during transition) */}
      <DropboxInterface 
        scrollProgress={scrollProgress}
        transitionComplete={transitionComplete}
        logoBoxRef={logoBoxRef}
        onLogoPositionChange={handleLogoPositionChange}
      />
      
      {/* Scroll indicator */}
      <div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center"
        style={{ 
          opacity: Math.max(0, 1 - scrollProgress * 3),
          pointerEvents: 'none',
        }}
      >
        <div className="text-[#0061FF] font-medium mb-2">Scroll to explore</div>
        <div className="w-8 h-12 border-2 border-[#0061FF] rounded-full flex justify-center">
          <div 
            className="w-1.5 h-3 bg-[#0061FF] rounded-full mt-1.5"
            style={{
              animation: 'scrollBounce 1.5s infinite',
            }}
          />
        </div>
        
        {/* Add animation keyframes */}
        <style jsx>{`
          @keyframes scrollBounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(8px);
            }
            60% {
              transform: translateY(4px);
            }
          }
        `}</style>
      </div>
      
      {/* Design System (invisible at start, fades in during transition) */}
      <div 
        className="fixed inset-0 z-30 pointer-events-auto"
        style={{ 
          opacity: Math.min(1, scrollProgress * fadeInRate),
          pointerEvents: scrollProgress > pointerEventThreshold ? 'auto' : 'none'
        }}
      >
        <DesignSystem 
          initialCenterItem="logo"
          entranceAnimation={true}
          scrollProgress={scrollProgress}
          logoBounds={logoBounds || undefined}
        />
      </div>
    </div>
  )
} 