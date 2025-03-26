"use client"

import { useState, useRef, useEffect } from "react"
import type { DesignSystemProps } from "./types"

export function useDesignSystem({
  initialCenterItem,
  entranceAnimation = false,
  scrollProgress = 0,
  logoBounds,
  initialScrollValue
}: DesignSystemProps = {}) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [centerItem, setCenterItem] = useState<string | null>(initialCenterItem || "logo")
  const [scrollAmount, setScrollAmount] = useState<Record<string, number>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isExpanding, setIsExpanding] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const initialScrollApplied = useRef(false)

  // Update centerItem when initialCenterItem changes
  useEffect(() => {
    if (initialCenterItem !== undefined) {
      setCenterItem(initialCenterItem);
    }
  }, [initialCenterItem]);

  // Apply initialScrollValue when component mounts
  useEffect(() => {
    if (
      centerItem && 
      initialScrollValue !== undefined && 
      !initialScrollApplied.current
    ) {
      setScrollAmount(prev => ({
        ...prev,
        [centerItem]: initialScrollValue
      }))
      // If initial scroll value is 100, we're already expanded
      if (initialScrollValue === 100) {
        setIsExpanding(true)
      }
      initialScrollApplied.current = true
    }
  }, [centerItem, initialScrollValue]);

  // Set initialization flag once mounted
  useEffect(() => {
    setHasInitialized(true);
  }, []);

  // Calculate which item is in the center of the viewport
  useEffect(() => {
    const calculateCenterItem = () => {
      if (!containerRef.current) return
      // Only calculate if initialCenterItem is not provided
      if (initialCenterItem === undefined) {
        setCenterItem("logo") // Force logo to be the center item
      }
    }

    calculateCenterItem()

    const handleScroll = () => {
      // Keep logo as center item, but track scroll for expansion

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', calculateCenterItem)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateCenterItem)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [initialCenterItem])

  // Track scroll amount for the center item only with improved stability
  const handleWheel = (e: React.WheelEvent) => {
    if (!centerItem || expandedItem) return

    e.preventDefault() // Prevent default scroll behavior

    // Only allow scrolling to start changing the UI after a deliberate action
    // This prevents accidental expansion on initial scroll
    if (!isExpanding && e.deltaY > 0) {
      setIsExpanding(true)
      return
    } else if (!isExpanding && e.deltaY < 0) {
      // If not expanding and trying to scroll up, do nothing
      return
    }

    // Update scroll amount for the center item with more stable increments
    setScrollAmount((prev) => {
      const currentAmount = prev[centerItem] || 0
      
      // Use a dynamic increment for smoother response based on scroll direction
      // Slower increment for more stability, especially when expanding
      const baseIncrement = 0.6; // Reduced for smoother scrolling
      
      // Apply exponential smoothing for scroll handling
      // This makes initial movement slower and more controlled
      const increment = e.deltaY > 0 
        ? Math.min(baseIncrement, baseIncrement * Math.max(0.3, currentAmount / 100))
        : -baseIncrement;
        
      const newAmount = Math.max(0, Math.min(100, currentAmount + increment));

      // We no longer set expandedItem when reaching 100%
      // We just let the visual expansion happen without showing the detailed content
      if (newAmount <= 5 && isExpanding) {
        setIsExpanding(false)
      }

      // Store the last scroll position to maintain state
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Set a timeout to snap to thresholds for stability
      scrollTimeoutRef.current = setTimeout(() => {
        if (newAmount > 95) {
          setScrollAmount(prev => ({
            ...prev,
            [centerItem]: 100
          }))
        } else if (newAmount < 5) {
          setScrollAmount(prev => ({
            ...prev,
            [centerItem]: 0
          }))
        }
      }, 500) // Increased for more stability

      return {
        ...prev,
        [centerItem]: newAmount,
      }
    })
  }

  // Handle click to toggle expanded state with improved stability
  const handleClick = (item: string) => {
    if (isExpanding && item !== centerItem) return // Prevent clicks on other items during expansion

    if (expandedItem === item) {
      // Smooth retraction animation
      setScrollAmount(prev => ({
        ...prev,
        [item]: 0
      }))

      setTimeout(() => {
        setExpandedItem(null)
      }, 300)
    } else if (item === centerItem && scrollAmount[centerItem] === 100) {
      // If we click on the already maximally expanded center item, we bring it back to 0
      setScrollAmount(prev => ({
        ...prev,
        [item]: 0
      }))
    } else if (item === centerItem && !isExpanding) {
      // If clicking on the center item when not expanding, initiate expansion
      setIsExpanding(true)
      setScrollAmount(prev => ({
        ...prev,
        [item]: 1 // Set to a small value to start expansion
      }))
    } else {
      // For other items, we expand to 100 but not show the expanded content immediately
      setScrollAmount(prev => ({
        ...prev,
        [item]: 20 // Start at 20% to begin the expansion animation
      }))

      // Only set expandedItem if it's a deliberate click, not from scrolling to 100%
      // We now delay setting the expandedItem to allow for smoother expansion
      if (item !== centerItem || (item === centerItem && scrollAmount[centerItem] !== 100)) {
        // Gradually increase the scroll amount to 100% for smooth expansion
        const expandInterval = setInterval(() => {
          setScrollAmount(prev => {
            const currAmount = prev[item] || 0;
            const newAmount = Math.min(100, currAmount + 5); // Increment by 5% each step

            // Once we reach 100%, set the expanded item
            if (newAmount === 100) {
              clearInterval(expandInterval);
              setExpandedItem(item);
            }

            return {
              ...prev,
              [item]: newAmount
            };
          });
        }, 25); // Update every 25ms for smooth animation
      }
    }
  }

  // Reset when mouse leaves
  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  // Get position offset for an item (0-1) with improved stability
  const getExpansionScale = (item: string) => {
    if (expandedItem === item) return 1
    if (item === centerItem) {
      // Simplify center item expansion calculation
      return ((centerItem && scrollAmount[centerItem]) || 0) / 100
    }
    if (item === hoveredItem &&
      (!centerItem || !scrollAmount[centerItem] || scrollAmount[centerItem] === 0)) {
      return 0.5 // Only show hover animation when not scrolling
    }
    return 0
  }

  // Get opacity for items with improved stability
  const getItemOpacity = (item: string) => {
    // When an item is fully expanded, make other items completely invisible
    if (expandedItem && expandedItem !== item) return 0

    // Start fading out only in final 10% of expansion
    if (item !== centerItem && centerItem &&
      typeof scrollAmount[centerItem] === 'number' &&
      scrollAmount[centerItem] > 90) {
      // Fade out in the last 10% of expansion (from 90% to 100%)
      return 1 - ((scrollAmount[centerItem] - 90) / 10)
    }

    // Otherwise maintain full opacity
    return 1
  }

  // Get size for an item based on hover/center/expanded state with improved stability
  const getItemSize = (item: string) => {
    if (expandedItem === item) return 1.1
    if (item === centerItem) {
      // Simplified growth logic
      return 1 + ((scrollAmount[centerItem] || 0) / 100) * 0.2
    }
    if (item === hoveredItem &&
      (!centerItem || !scrollAmount[centerItem] || scrollAmount[centerItem] === 0)) {
      return 1.05
    }
    // Keep other items at their original size
    return 1
  }

  // Get z-index for proper layering
  const getZIndex = (item: string) => {
    if (expandedItem === item) return 30
    if (item === centerItem) return 20
    if (item === hoveredItem) return 10
    return 1
  }

  // Get logo box custom dimensions when fully expanded to 100%
  const getLogoBoxDimensions = (item: string) => {
    if (item === "logo" && centerItem === "logo" && scrollAmount[centerItem] === 100) {
      return {
        width: "40vw",
        height: "70vh",
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }
    }
    return {}
  }

  // Calculate initial position for entrance animation based on item position and scrollProgress
  const getEntrancePosition = (itemId: string) => {
    if (!entranceAnimation || scrollProgress > 0.8) return { x: 0, y: 0 }

    // Apply a staggered entrance based on scrollProgress, complete by 80%
    const entranceProgress = Math.min(scrollProgress * 1.25, 1)

    // Enhanced entrances - create a scale effect from center to sides
    // Make effect more dramatic (larger initial offsets)
    const entranceOffset = 3000 * (1 - entranceProgress)

    // Position based on item ID
    switch (itemId) {
      case "framework": // top-left
        return { x: -entranceOffset * 1.2, y: -entranceOffset * 1.2 };
      case "voice": // top-center
        return { x: 0, y: -entranceOffset * 1.5 };
      case "typography": // top-right
        return { x: entranceOffset * 1.2, y: -entranceOffset * 1.2 };
      case "color": // middle-left
        return { x: -entranceOffset * 1.5, y: 0 };
      case "logo": // center - no effect on logo
        return { x: 0, y: 0 };
      case "iconography": // middle-right
        return { x: entranceOffset * 1.5, y: 0 };
      case "imagery": // bottom-left
        return { x: -entranceOffset * 1.2, y: entranceOffset * 1.2 };
      case "motion": // bottom-center
        return { x: 0, y: entranceOffset * 1.5 };
      case "accessibility": // bottom-right
        return { x: entranceOffset * 1.2, y: entranceOffset * 1.2 };
      default:
        return { x: 0, y: 0 };
    }
  }

  // Calculate initial scale for items appearing
  const getEntranceScale = (itemId: string) => {
    if (!entranceAnimation) return 1;

    // Center logo has a different initial scale
    if (itemId === "logo") return 1;

    // Scale used for entrance animation - start very small and grow
    const entranceScale = scrollProgress < 0.3 ? 0.001 : Math.min(scrollProgress * 1.5, 1);
    return entranceScale;
  }

  // Calculate initial opacity for entrance animation
  const getEntranceOpacity = (itemId: string) => {
    if (!entranceAnimation) return 1;

    // Center logo always visible
    if (itemId === "logo") return 1;

    // Other items fade in gradually - start completely invisible
    return Math.min(scrollProgress * 3 - 0.5, 1);
  }

  // Get the drop shadow effect for each item
  const getBoxShadow = (itemId: string) => {
    if (hoveredItem === itemId || centerItem === itemId || expandedItem === itemId) {
      return "0 10px 25px rgba(0,0,0,0.2)";
    }

    if (itemId === "logo" && entranceAnimation && scrollProgress < 0.5) {
      // Special highlight for center logo during transition
      return "0 0 30px rgba(0,97,255,0.3)";
    }

    return "0 4px 6px rgba(0,0,0,0.1)";
  }

  // Get initial position for logo box to match Dropbox interface position
  const getLogoInitialPosition = (itemId: string) => {
    // Always return zero offset for the logo to keep it stable in the center
    if (itemId === "logo") {
      return { x: 0, y: 0 };
    }
    
    // For non-logo items, return zero offset
    return { x: 0, y: 0 };
  }

  // Calculate position offset for moving items away from center
  const getPositionOffset = (item: string) => {
    if (!centerItem || 
        typeof scrollAmount[centerItem] !== 'number' || 
        scrollAmount[centerItem] <= 0) return { x: 0, y: 0 };
    
    if (item === centerItem) return { x: 0, y: 0 };

    // Use a more stable movement pattern with minimal initial movement
    let moveOutFactor = 0;

    // Reduce the overall movement amount and make it more linear
    // This creates a more stable and predictable movement pattern
    if (scrollAmount[centerItem] <= 50) {
      // First half - very minimal movement
      moveOutFactor = (scrollAmount[centerItem] / 100) * 50; // Very small factor
    } else if (scrollAmount[centerItem] <= 90) {
      // Second half - gradual movement
      // Map 50-90% to a more controlled range (50-200)
      const midProgress = (scrollAmount[centerItem] - 50) / 40;
      moveOutFactor = 50 + (midProgress * 150); 
    } else {
      // Final exit (90-100%) - ensure items exit completely but smoothly
      const exitProgress = (scrollAmount[centerItem] - 90) / 10;
      moveOutFactor = 200 + (exitProgress * 800); // Less aggressive than before
    }

    // Fixed positions with equal distances
    switch (item) {
      case "framework": // top-left
        return { x: -moveOutFactor, y: -moveOutFactor };
      case "voice": // top-center
        return { x: 0, y: -moveOutFactor };
      case "typography": // top-right
        return { x: moveOutFactor, y: -moveOutFactor };
      case "color": // middle-left
        return { x: -moveOutFactor, y: 0 };
      case "iconography": // middle-right
        return { x: moveOutFactor, y: 0 };
      case "imagery": // bottom-left
        return { x: -moveOutFactor, y: moveOutFactor };
      case "motion": // bottom-center
        return { x: 0, y: moveOutFactor };
      default: // bottom-right
        return { x: moveOutFactor, y: moveOutFactor };
    }
  }

  return {
    expandedItem,
    hoveredItem,
    centerItem,
    scrollAmount,
    containerRef,
    itemRefs,
    isExpanding,
    hasInitialized,
    handleWheel,
    handleClick,
    handleMouseLeave,
    getExpansionScale,
    getItemOpacity,
    getItemSize,
    getZIndex,
    getLogoBoxDimensions,
    getEntrancePosition,
    getEntranceScale,
    getEntranceOpacity,
    getBoxShadow,
    getLogoInitialPosition,
    getPositionOffset,
    setHoveredItem
  }
} 