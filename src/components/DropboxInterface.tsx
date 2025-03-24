"use client"

import { RefObject, useMemo, CSSProperties } from "react"

interface DropboxInterfaceProps {
  scrollProgress: number
  transitionComplete: boolean
  logoBoxRef: RefObject<HTMLDivElement>
}

export default function DropboxInterface({ 
  scrollProgress, 
  logoBoxRef,
  // Ignore the transitionComplete prop
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transitionComplete
}: DropboxInterfaceProps) {
  
  // Use useMemo to calculate styles based on scroll progress for better performance
  const styles = useMemo(() => {
    // Define key animation breakpoints - make transitions more gradual
    const START_SHRINKING = 0;    // Begin to shrink immediately
    const MID_SHRINKING = 0.3;    // Complete first phase of shrinking later (increased from 0.2)
    const FINAL_SHRINK = 0.9;     // Final size reduction (increased from 0.8)
    
    // Calculate phase transitions using easing functions for smoothness
    const getEasedValue = (start: number, end: number) => {
      // Return 0 if we haven't reached this phase
      if (scrollProgress < start) return 0;
      
      // Return 1 if we've completed this phase
      if (scrollProgress >= end) return 1;
      
      // Calculate progress through this phase (0 to 1)
      const phaseProgress = (scrollProgress - start) / (end - start);
      
      // Apply a more gentle easing for smoother, more stable animation
      // Simple ease-out function for smoother transition
      return 1 - Math.pow(1 - phaseProgress, 2);
    };
    
    // Calculate scale values at different phases
    const initialScale = 1;
    const midScale = 0.8;  // Less extreme initial scaling (increased from 0.7)
    const finalScale = 0.06;
    
    // Calculate current scale based on progress through different phases
    let currentScale: number;
    
    if (scrollProgress < MID_SHRINKING) {
      // First scaling phase - from 1 to 0.8
      const shrinkProgress = getEasedValue(START_SHRINKING, MID_SHRINKING);
      currentScale = initialScale - shrinkProgress * (initialScale - midScale);
    } else if (scrollProgress < FINAL_SHRINK) {
      // Second scaling phase - from 0.8 to 0.1, more gradual
      const finalShrinkProgress = getEasedValue(MID_SHRINKING, FINAL_SHRINK);
      currentScale = midScale - finalShrinkProgress * (midScale - 0.1);
    } else {
      // Final mini logo phase - to 0.06
      const miniLogoProgress = getEasedValue(FINAL_SHRINK, 1);
      currentScale = 0.1 - miniLogoProgress * (0.1 - finalScale);
    }
    
    // Calculate opacity with slower fadeout
    const opacity = scrollProgress < 0.2 
      ? 1 
      : Math.max(0, 1 - ((scrollProgress - 0.2) * 0.8));
    
    // Remove the horizontal and vertical shifts that were causing movement
    const styleObj: CSSProperties = {
      opacity,
      transform: `scale(${currentScale})`,
      transformOrigin: 'center center', // Keep scaling from center
    };
    
    // Add pointer-events as a separate property with proper type checking
    if (scrollProgress > 0.8) {
      styleObj.pointerEvents = 'none';
    }
    
    return styleObj;
  }, [scrollProgress]);

  return (
    <div 
      className="fixed inset-0 w-full z-20 transition-all duration-300 ease-out"
      style={styles}
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
              <div 
                className="w-10 h-10 transition-transform duration-500 ease-out"
                ref={logoBoxRef}
              >
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
  )
} 