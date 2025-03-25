"use client"

import { useMemo, CSSProperties, useEffect } from "react"
import React from "react"

interface DropboxInterfaceProps {
  scrollProgress: number
  transitionComplete: boolean
  logoBoxRef: React.RefObject<HTMLDivElement>
  onLogoPositionChange?: (bounds: { x: number; y: number; width: number; height: number }) => void
}

export default function DropboxInterface({ 
  scrollProgress, 
  logoBoxRef,
  transitionComplete,
  onLogoPositionChange
}: DropboxInterfaceProps) {
  
  // Report logo position to parent component for transition
  useEffect(() => {
    if (logoBoxRef.current && onLogoPositionChange) {
      const updatePosition = () => {
        const bounds = logoBoxRef.current?.getBoundingClientRect();
        if (bounds) {
          onLogoPositionChange({
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height
          });
        }
      };
      
      // Update position initially and on resize
      updatePosition();
      window.addEventListener('resize', updatePosition);
      
      // Clean up event listener
      return () => {
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [logoBoxRef, onLogoPositionChange]);

  // Use useMemo to calculate styles based on scroll progress for better performance
  const styles = useMemo(() => {
    // Define key animation breakpoints with more gradual transitions
    const START_SHRINKING = 0;     // Begin to shrink immediately
    const MID_SHRINKING = 0.3;     // Complete first phase of shrinking
    const FINAL_SHRINK = 0.9;      // Final size reduction
    const TRANSFORM_START = 0.4;   // Start transforming to design system shape
    const TRANSFORM_END = 0.7;     // Complete transformation to design system shape
    
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
    const midScale = 0.8;  // Less extreme initial scaling
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
      
      // If transition is complete, ensure we reach exact final scale
      if (transitionComplete) {
        currentScale = finalScale;
      }
    }
    
    // Calculate opacity with slower fadeout
    const opacity = scrollProgress < 0.2 
      ? 1 
      : Math.max(0, 1 - ((scrollProgress - 0.2) * 0.8));
      
    // Calculate border radius transformation (from rectangular to circular/square)
    const transformProgress = getEasedValue(TRANSFORM_START, TRANSFORM_END);
    const borderRadius = `${Math.min(8, transformProgress * 16)}px`;
    
    // Calculate background color transition (white to white with reduced opacity)
    const bgColor = `rgba(255, 255, 255, ${1 - transformProgress * 0.2})`;
    
    // Calculate border transition (solid to none)
    const borderOpacity = 1 - transformProgress;
    const borderColor = `rgba(229, 231, 235, ${borderOpacity})`;
    
    // Calculate width/height transition to make it more square
    const widthChange = 40 - (transformProgress * 15); // 40vw to 25vw
    
    // Remove the horizontal and vertical shifts that were causing movement
    const styleObj: CSSProperties = {
      opacity,
      transform: `scale(${currentScale})`,
      transformOrigin: 'center center', // Keep scaling from center
    };
    
    // Add pointer-events as a separate property with proper type checking
    if (scrollProgress > 0.8 || transitionComplete) {
      styleObj.pointerEvents = 'none';
    }
    
    return {
      container: styleObj,
      innerBox: {
        width: `${widthChange}vw`,
        borderRadius,
        backgroundColor: bgColor,
        borderColor,
        transition: 'all 0.4s ease-out',
      },
      contentFade: {
        opacity: 1 - transformProgress,
        transition: 'opacity 0.4s ease-out',
      },
      logoTransform: {
        transform: `scale(${1 + transformProgress * 0.3})`,
        transition: 'transform 0.4s ease-out',
      },
      gridBorders: {
        opacity: borderOpacity,
        transition: 'opacity 0.4s ease-out',
      }
    };
  }, [scrollProgress, transitionComplete]);

  return (
    <div 
      className="fixed inset-0 w-full z-20 transition-all duration-300 ease-out"
      style={styles.container}
    >
      {/* Grid Layout */}
      <div 
        className="h-full grid grid-cols-1 md:grid-cols-[1fr,2fr,1fr] border border-gray-200 divide-x divide-gray-200"
        style={styles.gridBorders}
      >
        {/* Left empty column */}
        <div className="border-b border-gray-200" style={styles.gridBorders}></div>

        {/* Center column with content */}
        <div className="flex w-full justify-center py-6">
          <div 
            className="flex flex-col border-1 border-gray-200 bg-white"
            style={styles.innerBox}
          >
            {/* Top section with text */}
            <div 
              className="min-h-[70vh] flex items-start p-8 border-gray-200"
              style={styles.contentFade}
            >
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

            {/* Bottom section with logo - this transitions to the center of design system */}
            <div 
              className={`py-8 px-16 flex justify-between items-center ${scrollProgress > 0.5 ? 'justify-center' : 'justify-between'}`}
              style={{
                ...styles.contentFade,
                // When transition is complete, ensure alignment with design system center
                justifyContent: transitionComplete ? 'center' : scrollProgress > 0.5 ? 'center' : 'space-between'
              }}
            >
              <div 
                className={`w-10 h-10 transition-all duration-500 ease-out ${scrollProgress > 0.5 || transitionComplete ? 'mx-auto' : ''}`}
                ref={logoBoxRef}
                style={styles.logoTransform}
              >
                <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                  <path d="M63.246 0L0 41.625l43.766 35.22 64.764-39.812-45.284-37.033zm129.728 0L147.69 37.033l64.762 39.812 43.768-35.22L193.735 0h-.761zm-129.728 115.6L0 74.336l43.766-35.033 64.764 39.626-45.284 36.672zm129.728 0L147.69 73.93l64.762-39.626 43.768 35.032-63.52 41.264zm-65.202 42.627l-45.046-36.848-45.285 36.848 45.285 37.22 45.046-37.22z" fill="#0061FF" />
                </svg>
              </div>
              <div 
                className="w-9 h-9"
                style={{ 
                  opacity: transitionComplete ? 0 : Math.max(0, 1 - scrollProgress * 3),
                  transition: 'opacity 0.3s ease-out',
                  display: transitionComplete ? 'none' : 'block'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9l6 6 6-6" stroke="#0061FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            
          </div>
        </div>

        {/* Right empty column */}
        <div className="border-b border-gray-200" style={styles.gridBorders}></div>
      </div>
    </div>
  )
} 