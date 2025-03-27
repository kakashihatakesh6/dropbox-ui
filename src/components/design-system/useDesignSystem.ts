"use client"

import { useState, useRef, useEffect } from "react"
import type { DesignSystemProps } from "./types"

export function useDesignSystem({
  initialCenterItem,
  entranceAnimation = false,
  scrollProgress = 0,
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

    // Allow scrolling in both directions if already expanding
    if (isExpanding) {
      // Continue with scrolling in both directions
    } 
    // For initial expansion, jump immediately to 25% on first scroll for quicker start
    else if (!isExpanding && e.deltaY > 0) {
      setIsExpanding(true)
      // Jump immediately to 25% on first scroll down for more responsiveness
      setScrollAmount(prev => ({
        ...prev,
        [centerItem]: 25
      }))
      return
    } else if (!isExpanding && e.deltaY < 0) {
      // If not expanding and trying to scroll up, do nothing
      return
    }

    // Update scroll amount for the center item with more stable increments
    setScrollAmount((prev) => {
      const currentAmount = prev[centerItem] || 0
      
      // If we're below 25% and scrolling down, jump directly to 25%
      if (currentAmount < 25 && e.deltaY > 0) {
        return {
          ...prev,
          [centerItem]: 25
        }
      }
      
      // Use a higher base increment for faster response while scrolling
      const baseIncrement = 3.5; // Increased from 0.6 for much higher sensitivity
      
      // Use a dynamic scaling factor based on current position
      // This creates an ease-in-out effect for the scrolling
      const position = currentAmount / 100;
      const easeInOutFactor = 0.8 + (0.4 * Math.sin(position * Math.PI));
      
      // Calculate increment with easing and direction
      // This makes small wheel movements more effective
      const wheelSensitivity = Math.min(Math.abs(e.deltaY) * 0.05, 1.2);
      const increment = e.deltaY > 0 
        ? baseIncrement * easeInOutFactor * wheelSensitivity
        : -baseIncrement * easeInOutFactor * wheelSensitivity;
        
      const newAmount = Math.max(0, Math.min(100, currentAmount + increment));

      // Handle the transition out of expanding state
      if (newAmount <= 5 && isExpanding) {
        setIsExpanding(false)
      }

      // Store the last scroll position to maintain state
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Set a timeout to snap to thresholds with shorter delay for responsiveness
      scrollTimeoutRef.current = setTimeout(() => {
        if (newAmount > 85) { // Reduced threshold from 95 to 85 for quicker completion
          setScrollAmount(prev => ({
            ...prev,
            [centerItem]: 100
          }))
        } else if (newAmount > 10 && newAmount < 35) {
          // Expanded snap range for more stability at low values
          setScrollAmount(prev => ({
            ...prev,
            [centerItem]: 25
          }))
        } else if (newAmount < 5) {
          setScrollAmount(prev => ({
            ...prev,
            [centerItem]: 0
          }))
          // Reset isExpanding when we reach 0
          setIsExpanding(false)
        }
      }, 250) // Reduced from 500ms for more responsive behavior

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
      // Reset isExpanding to allow the user to expand again
      setIsExpanding(false)
    } else if (item === centerItem && !isExpanding) {
      // If clicking on the center item when not expanding, initiate expansion
      setIsExpanding(true)
      setScrollAmount(prev => ({
        ...prev,
        [item]: 20 // Jump directly to 20% instead of 1%
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

    // When scrolled to 100%, make all non-logo items completely transparent
    if (item !== "logo" && centerItem === "logo" && 
        typeof scrollAmount[centerItem] === 'number' && 
        scrollAmount[centerItem] === 100) {
      return 0;
    }

    // Start fading out earlier for a smoother transition, around 80% scroll
    if (item !== centerItem && centerItem &&
      typeof scrollAmount[centerItem] === 'number' &&
      scrollAmount[centerItem] > 80) {
      // Fade out gradually from 80% to 100% of expansion
      // Fully transparent by 100%
      return Math.max(0, 1 - ((scrollAmount[centerItem] - 80) / 20));
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

  // Get entrance position for animation
  const getEntrancePosition = (itemId: string) => {
    if (entranceAnimation === false) return { x: 0, y: 0 }
    
    // Create staggered entrance effects based on item IDs
    switch (itemId) {
      case "framework":
        return { x: -100, y: -50 }
      case "voice":
        return { x: -100, y: 50 }
      case "typography":
        return { x: -50, y: -100 }
      case "color":
        return { x: 50, y: 100 }
      case "leftBox":
        return { x: -50, y: 0 }
      case "logo": 
        return { x: 0, y: 0 }
      case "iconography":
        return { x: 50, y: -50 }
      case "imagery":
        return { x: 100, y: 100 }
      case "motion":
        return { x: 100, y: -100 }
      default:
        return { x: 0, y: 0 }
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

  // Get position offset for expanding state
  const getPositionOffset = (item: string) => {
    if (!centerItem || !isExpanding) return { x: 0, y: 0 }
    
    const amount = scrollAmount[centerItem] || 0
    if (amount <= 0) return { x: 0, y: 0 }
    
    // Create offset based on item position relative to center
    const baseOffset = amount * 2.5 // Adjust the multiplier for more/less movement
    
    switch(item) {
      case "framework":
        return { x: -baseOffset, y: -baseOffset }
      case "voice":
        return { x: -baseOffset, y: baseOffset }
      case "typography":
        return { x: -baseOffset * 0.5, y: -baseOffset * 1.2 }
      case "color":
        return { x: -baseOffset * 0.5, y: baseOffset * 1.2 }
      case "leftBox":
        return { x: -baseOffset, y: 0 }
      case "logo":
        return { x: 0, y: 0 } // Logo stays centered
      case "iconography":
        return { x: baseOffset * 0.8, y: -baseOffset * 0.8 }
      case "imagery":
        return { x: baseOffset * 0.8, y: baseOffset * 0.8 }
      case "motion":
        return { x: baseOffset, y: -baseOffset }
      default:
        return { x: 0, y: 0 }
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