"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LockIcon, UnlockIcon, MoonIcon, PaletteIcon, TypeIcon, RefreshCwIcon } from "lucide-react"

interface DesignSystemProps {
  initialCenterItem?: string | null;
}

export default function DesignSystem({ initialCenterItem }: DesignSystemProps = {}) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [centerItem, setCenterItem] = useState<string | null>(initialCenterItem || "logo")  // Use provided initial center item or default to logo
  const [scrollAmount, setScrollAmount] = useState<Record<string, number>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isExpanding, setIsExpanding] = useState(false)

  // Update centerItem when initialCenterItem changes
  useEffect(() => {
    if (initialCenterItem !== undefined) {
      setCenterItem(initialCenterItem);
    }
  }, [initialCenterItem]);

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

    // Update scroll amount for the center item with more stable increments
    setScrollAmount((prev) => {
      const currentAmount = prev[centerItem] || 0
      // Use smaller increment for smoother expansion
      const increment = 1.5
      const newAmount = Math.max(0, Math.min(100, currentAmount + (e.deltaY > 0 ? increment : -increment)))

      // Only set expanding state when we reach threshold values
      if (newAmount >= 95 && !isExpanding) {
        setIsExpanding(true)
        setTimeout(() => {
          setExpandedItem(centerItem)
          setIsExpanding(false)
        }, 200)
      } else if (newAmount <= 5 && isExpanding) {
        setIsExpanding(false)
      }

      // Store the last scroll position to maintain state
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Set a timeout to snap to thresholds for stability
      scrollTimeoutRef.current = setTimeout(() => {
        if (newAmount > 85) {
          setScrollAmount(prev => ({
            ...prev,
            [centerItem]: 100
          }))
        } else if (newAmount < 15) {
          setScrollAmount(prev => ({
            ...prev,
            [centerItem]: 0
          }))
        }
      }, 200)

      return {
        ...prev,
        [centerItem]: newAmount,
      }
    })
  }

  // Handle click to toggle expanded state with improved stability
  const handleClick = (item: string) => {
    if (isExpanding) return // Prevent clicks during expansion

    if (expandedItem === item) {
      // Smooth retraction animation
      setScrollAmount(prev => ({
        ...prev,
        [item]: 0
      }))
      
      setTimeout(() => {
        setExpandedItem(null)
      }, 300)
    } else {
      // Set scroll amount to 100 for clean expansion
      setScrollAmount(prev => ({
        ...prev,
        [item]: 100
      }))
      
      setExpandedItem(item)
    }
  }

  // Reset when mouse leaves
  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  // Get expansion scale for an item (0-1) with improved stability
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
    
    // Fade out non-center items during expansion
    if (item !== centerItem && centerItem && 
        typeof scrollAmount[centerItem] === 'number' && 
        scrollAmount[centerItem] > 0) {
      // Simple linear fade based on scroll amount
      return Math.max(0.2, 1 - (scrollAmount[centerItem] / 100) * 0.8)
    }
    
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

  // Items data for easier mapping
  const items = [
    {
      id: "framework",
      title: "Framework",
      bgColor: "#2c3e50",
      textColor: "white",
      content: (
        <div className="h-full flex items-center justify-center">
          {hoveredItem === "framework" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: [0, 15, -15, 15, 0]
              }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 grid-rows-2 gap-3"
            >
              <div className="w-8 h-8 bg-white rounded-md"></div>
              <div className="w-8 h-8 bg-white rounded-md"></div>
              <div className="w-8 h-8 bg-white rounded-md"></div>
              <div className="w-8 h-8 bg-white rounded-md"></div>
            </motion.div>
          ) : (
            <svg width="150" height="150" viewBox="0 0 150 150">
              <motion.line
                x1="30"
                y1="30"
                x2="75"
                y2="75"
                stroke="white"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 0.6 + 0.4 * getExpansionScale("framework"),
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.line
                x1="75"
                y1="75"
                x2="30"
                y2="120"
                stroke="white"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 0.6 + 0.4 * getExpansionScale("framework"),
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.circle cx="30" cy="30" r="6" fill="white" />
              <motion.circle cx="75" cy="75" r="6" fill="white" />
              <motion.circle cx="30" cy="120" r="6" fill="white" />
            </svg>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Design Framework</h3>
          <p className="mb-4">
            The structural foundation that guides our design decisions and ensures consistency across platforms.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Grid systems and layouts</li>
            <li>Spacing and alignment principles</li>
            <li>Responsive design guidelines</li>
            <li>Component architecture</li>
          </ul>
        </>
      ),
    },
    {
      id: "voice",
      title: "Voice & Tone",
      bgColor: "#f1c40f",
      textColor: "#5d4037",
      content: (
        <div className="flex justify-between items-center h-full">
          {hoveredItem === "voice" ? (
            <motion.div
              className="flex flex-col items-center justify-center w-full space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="h-1 bg-white w-3/4 rounded-full"
                animate={{ width: ["20%", "80%", "60%"] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              />
              <motion.div 
                className="h-1 bg-white w-1/2 rounded-full"
                animate={{ width: ["60%", "30%", "70%"] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
              />
              <motion.div 
                className="h-1 bg-white w-2/3 rounded-full"
                animate={{ width: ["40%", "90%", "50%"] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
              />
            </motion.div>
          ) : (
            <>
              <motion.span
                className="text-[#5d4037] text-8xl"
                animate={{
                  x: -20 * getExpansionScale("voice"),
                  scale: 1 + 0.2 * getExpansionScale("voice"),
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                &ldquo;&ldquo;
              </motion.span>
              <motion.span
                className="text-[#5d4037] text-8xl"
                animate={{
                  x: 20 * getExpansionScale("voice"),
                  scale: 1 + 0.2 * getExpansionScale("voice"),
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                &rdquo;&rdquo;
              </motion.span>
            </>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Communication Style</h3>
          <p className="mb-4">
            How we speak to our audience, reflecting our brand personality through consistent communication.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">We are:</h4>
              <ul className="list-disc pl-5">
                <li>Clear and concise</li>
                <li>Friendly and approachable</li>
                <li>Knowledgeable but not condescending</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">We avoid:</h4>
              <ul className="list-disc pl-5">
                <li>Technical jargon</li>
                <li>Overly formal language</li>
                <li>Ambiguous messaging</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "logo",
      title: "Logo",
      bgColor: "#48dbfb",
      textColor: "#0a3d62",
      content: (
        <div className="flex justify-center items-center h-full">
          {hoveredItem === "logo" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-14 h-14"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="#0a3d62" 
                className="w-full h-full"
              >
                <path d="M12 2l5.5 5.5-5.5 5.5-5.5-5.5 5.5-5.5zM5.5 14.5l5.5 5.5 5.5-5.5-5.5-5.5-5.5 5.5z"/>
              </svg>
            </motion.div>
          ) : (
            <motion.div
              className="w-12 h-12 flex items-center justify-center"
              animate={{
                scale: 1 + 0.05 * getExpansionScale("logo"),
              }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.2
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="#0a3d62" 
                className="w-full h-full"
              >
                <path d="M12 2l5.5 5.5-5.5 5.5-5.5-5.5 5.5-5.5zM5.5 14.5l5.5 5.5 5.5-5.5-5.5-5.5-5.5 5.5z"/>
              </svg>
            </motion.div>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Brand Mark</h3>
          <p className="mb-4">Our visual identity mark, representing our brand in its most condensed form.</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Usage Guidelines:</h4>
              <ul className="list-disc pl-5">
                <li>Maintain clear space around the logo</li>
                <li>Never distort or rotate the logo</li>
                <li>Use approved color variations only</li>
                <li>Minimum size requirements must be followed</li>
              </ul>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="w-16 h-16 bg-[#0a3d62] flex items-center justify-center">
                <div className="w-8 h-8 bg-[#48dbfb]"></div>
              </div>
              <div className="w-16 h-16 bg-white flex items-center justify-center">
                <div className="w-8 h-8 bg-[#0a3d62]"></div>
              </div>
              <div className="w-16 h-16 bg-[#0a3d62] flex items-center justify-center opacity-50">
                <div className="w-8 h-8 bg-white"></div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "typography",
      title: "Typography",
      bgColor: "#ff7f50",
      textColor: "#5d0f0f",
      content: (
        <div className="flex justify-center items-center h-full">
          {hoveredItem === "typography" ? (
            <motion.div
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TypeIcon size={64} className="text-white" />
            </motion.div>
          ) : (
            <motion.span
              className="text-[#5d0f0f] text-8xl font-serif"
              animate={{
                y: -20 * getExpansionScale("typography"),
                scale: 1 + 0.2 * getExpansionScale("typography"),
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Aa
            </motion.span>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Type System</h3>
          <p className="mb-4">The font families, sizes, and styles that create hierarchy and enhance readability.</p>
          <div className="space-y-3">
            <div className="font-sans">
              <span className="text-xs opacity-70">Primary Font</span>
              <div className="text-2xl">Inter / Sans-Serif</div>
            </div>
            <div className="font-serif">
              <span className="text-xs opacity-70">Secondary Font</span>
              <div className="text-2xl">Merriweather / Serif</div>
            </div>
            <div className="font-mono">
              <span className="text-xs opacity-70">Monospace</span>
              <div className="text-2xl">Roboto Mono</div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "color",
      title: "Color",
      bgColor: "#ff9f43",
      textColor: "#6d3200",
      content: (
        <div className="flex justify-center items-center h-full relative">
          {hoveredItem === "color" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.6 }}
            >
              <PaletteIcon size={64} className="text-white" />
            </motion.div>
          ) : (
            <>
              <motion.div
                className="absolute w-16 h-16 bg-[#6d3200] rounded"
                animate={{
                  x: -40 * getExpansionScale("color"),
                  y: -20 * getExpansionScale("color"),
                  rotate: 45 * getExpansionScale("color"),
                }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.div
                className="absolute w-16 h-16 bg-[#6d3200] rounded-full"
                animate={{
                  x: 40 * getExpansionScale("color"),
                  y: 20 * getExpansionScale("color"),
                }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Color Palette</h3>
          <p className="mb-4">Our palette that evokes emotion, creates hierarchy, and reinforces brand recognition.</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-2">
              <div className="w-full h-10 bg-[#2c3e50] rounded"></div>
              <div className="text-xs">Navy</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-10 bg-[#f1c40f] rounded"></div>
              <div className="text-xs">Yellow</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-10 bg-[#48dbfb] rounded"></div>
              <div className="text-xs">Cyan</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-10 bg-[#ff7f50] rounded"></div>
              <div className="text-xs">Coral</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-10 bg-[#ff9f43] rounded"></div>
              <div className="text-xs">Orange</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-10 bg-[#b8e994] rounded"></div>
              <div className="text-xs">Green</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-10 bg-[#8e44ad] rounded"></div>
              <div className="text-xs">Purple</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-10 bg-[#d8b5ff] rounded"></div>
              <div className="text-xs">Lavender</div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "iconography",
      title: "Iconography",
      bgColor: "#b8e994",
      textColor: "#1e5631",
      content: (
        <div className="flex justify-center items-center h-full">
          <motion.div
            animate={{
              scale: 1 + 0.5 * getExpansionScale("iconography"),
              y: -20 * getExpansionScale("iconography"),
              rotate: hoveredItem === "iconography" ? 360 : 0,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300,
              rotate: { duration: 0.5 }
            }}
          >
            {hoveredItem === "iconography" ? (
              <UnlockIcon size={64} className="text-white" />
            ) : (
              <LockIcon size={64} className="text-[#1e5631]" />
            )}
          </motion.div>
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Icon System</h3>
          <p className="mb-4">Visual symbols that communicate meaning efficiently and enhance user experience.</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Icon Guidelines:</h4>
              <ul className="list-disc pl-5">
                <li>Consistent stroke weight</li>
                <li>Simple, recognizable shapes</li>
                <li>Align to pixel grid</li>
                <li>Maintain visual harmony</li>
              </ul>
            </div>
            <div className="flex gap-4 justify-around">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#1e5631] flex items-center justify-center">
                  <LockIcon size={20} className="text-white" />
                </div>
                <span className="text-xs mt-1">Filled</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1e5631] flex items-center justify-center">
                  <LockIcon size={20} className="text-[#1e5631]" />
                </div>
                <span className="text-xs mt-1">Outlined</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#1e5631] bg-opacity-20 flex items-center justify-center">
                  <LockIcon size={20} className="text-[#1e5631]" />
                </div>
                <span className="text-xs mt-1">Duotone</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "imagery",
      title: "Imagery",
      bgColor: "#8e44ad",
      textColor: "white",
      content: (
        <div className="flex justify-center items-center h-full">
          {hoveredItem === "imagery" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MoonIcon size={80} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              className="w-32 h-32 bg-[#ffcccb] rounded-lg overflow-hidden relative"
              animate={{
                x: -20 * getExpansionScale("imagery"),
                scale: 1 + 0.2 * getExpansionScale("imagery"),
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#e84393] rounded-full" />
              <motion.div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#e84393] rounded-t-[50px]" />
            </motion.div>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Visual Language</h3>
          <p className="mb-4">
            Photography and illustrations that tell our story and connect emotionally with our audience.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Photography Style:</h4>
              <ul className="list-disc pl-5">
                <li>Natural lighting</li>
                <li>Authentic moments</li>
                <li>Diverse representation</li>
                <li>Vibrant but not oversaturated</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Illustration Style:</h4>
              <ul className="list-disc pl-5">
                <li>Geometric shapes</li>
                <li>Bold color blocking</li>
                <li>Minimal details</li>
                <li>Consistent line weights</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "motion",
      title: "Motion",
      bgColor: "#d8b5ff",
      textColor: "#4a148c",
      content: (
        <div className="flex justify-center items-center h-full">
          {hoveredItem === "motion" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1, 
                rotate: 360,
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Number.POSITIVE_INFINITY, 
                repeatType: "loop",
                ease: "linear"
              }}
            >
              <RefreshCwIcon size={80} className="text-white" />
            </motion.div>
          ) : (
            <svg width="150" height="150" viewBox="0 0 150 150">
              <motion.path
                d="M30,30 Q75,120 120,30 Q75,-60 30,30"
                fill="transparent"
                stroke="#4a148c"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 0.6 + 0.4 * getExpansionScale("motion"),
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.circle
                cx="30"
                cy="30"
                r="8"
                fill="#4a148c"
                animate={{
                  scale: expandedItem === "motion" ? [1, 1.2, 1] : 1,
                  y: expandedItem === "motion" ? [0, -10, 0] : 0,
                }}
                transition={{
                  repeat: expandedItem === "motion" ? Number.POSITIVE_INFINITY : 0,
                  duration: 1,
                }}
              />
              <motion.circle
                cx="120"
                cy="30"
                r="8"
                fill="#4a148c"
                animate={{
                  scale: expandedItem === "motion" ? [1, 1.2, 1] : 1,
                  y: expandedItem === "motion" ? [0, -10, 0] : 0,
                }}
                transition={{
                  repeat: expandedItem === "motion" ? Number.POSITIVE_INFINITY : 0,
                  duration: 1,
                  delay: 0.5,
                }}
              />
              <motion.circle
                cx="75"
                cy="120"
                r="8"
                fill="#4a148c"
                animate={{
                  scale: expandedItem === "motion" ? [1, 1.2, 1] : 1,
                  y: expandedItem === "motion" ? [0, -10, 0] : 0,
                }}
                transition={{
                  repeat: expandedItem === "motion" ? Number.POSITIVE_INFINITY : 0,
                  duration: 1,
                  delay: 1,
                }}
              />
            </svg>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Animation Principles</h3>
          <p className="mb-4">How our elements move and transition to create engaging, intuitive user experiences.</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Motion Principles:</h4>
                <ul className="list-disc pl-5">
                  <li>Natural and fluid</li>
                  <li>Purposeful, not decorative</li>
                  <li>Consistent timing and easing</li>
                  <li>Responsive to user input</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Timing Guidelines:</h4>
                <ul className="list-disc pl-5">
                  <li>Quick: 150-200ms</li>
                  <li>Standard: 250-300ms</li>
                  <li>Emphasis: 400-500ms</li>
                  <li>Complex: 500-800ms</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "accessibility",
      title: "Accessibility",
      bgColor: "#20bf6b",
      textColor: "white",
      content: (
        <div className="flex justify-center items-center h-full">
          {hoveredItem === "accessibility" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              className="relative w-32 h-32 flex items-center justify-center"
              animate={{
                scale: 1 + 0.2 * getExpansionScale("accessibility"),
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#20bf6b]"></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Inclusive Design</h3>
          <p className="mb-4">
            Design principles and practices that ensure our products are accessible to users of all abilities.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Accessibility Standards:</h4>
              <ul className="list-disc pl-5">
                <li>WCAG 2.1 AA compliance</li>
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>Sufficient color contrast</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Design Considerations:</h4>
              <ul className="list-disc pl-5">
                <li>Text resizing without loss of functionality</li>
                <li>Alternative text for images</li>
                <li>Focus indicators for interactive elements</li>
                <li>Multiple ways to access content</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ]

  return (
    <div 
      className="w-full h-screen bg-white flex items-center justify-center overflow-hidden" 
      ref={containerRef}
      onWheel={handleWheel} // Add wheel event handler to the container
    >
      {/* Grid lines that ONLY appear during expansion */}
      {centerItem && scrollAmount[centerItem] && scrollAmount[centerItem] > 0 && (
        <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Extra small grid pattern */}
            <pattern id="xsmallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="none" />
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(65,182,255,0.1)" strokeWidth="0.5" />
            </pattern>
            <rect width="100vw" height="100vh" fill="url(#xsmallGrid)" />
            
            {/* Small grid pattern */}
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" />
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(65,182,255,0.15)" strokeWidth="0.6" />
            </pattern>
            <rect width="100vw" height="100vh" fill="url(#smallGrid)" />
            
            {/* Medium grid pattern */}
            <pattern id="mediumGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill="none" />
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(65,182,255,0.2)" strokeWidth="0.8" />
            </pattern>
            <rect width="100vw" height="100vh" fill="url(#mediumGrid)" />
            
            {/* Large grid pattern */}
            <pattern id="largeGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="none" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(65,182,255,0.25)" strokeWidth="1" />
            </pattern>
            <rect width="100vw" height="100vh" fill="url(#largeGrid)" />
            
            {/* Extra large grid pattern */}
            <pattern id="xlGrid" width="200" height="200" patternUnits="userSpaceOnUse">
              <rect width="200" height="200" fill="none" />
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(65,182,255,0.3)" strokeWidth="1.2" />
            </pattern>
            <rect width="100vw" height="100vh" fill="url(#xlGrid)" />
          </svg>
        </div>
      )}

      {/* Additional grid decorators that ONLY appear during expansion */}
      {centerItem && scrollAmount[centerItem] && scrollAmount[centerItem] > 0 && (
        <div 
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{ 
            opacity: Math.min(0.7, scrollAmount[centerItem] / 100),
            zIndex: 2 
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Horizontal and vertical grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(65,182,255,0.2)" strokeWidth="0.2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(65,182,255,0.25)" strokeWidth="0.3" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(65,182,255,0.2)" strokeWidth="0.2" />
            <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(65,182,255,0.2)" strokeWidth="0.2" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(65,182,255,0.25)" strokeWidth="0.3" />
            <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(65,182,255,0.2)" strokeWidth="0.2" />
            
            {/* Diagonal grid lines */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(65,182,255,0.2)" strokeWidth="0.2" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(65,182,255,0.2)" strokeWidth="0.2" />
          </svg>
        </div>
      )}

      {/* Add connecting lines between boxes ONLY during expansion */}
      {centerItem && scrollAmount[centerItem] && scrollAmount[centerItem] > 20 && (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ 
            opacity: Math.min(0.7, scrollAmount[centerItem] / 100),
            zIndex: 4
          }}
        >
          {/* Draw organic connecting lines in the gaps */}
          {items.map((item) => {
            if (item.id === centerItem || !itemRefs.current[item.id] || !itemRefs.current[centerItem || '']) return null;
            
            // Get center box position
            const centerBox = itemRefs.current[centerItem || '']?.getBoundingClientRect();
            const currBox = itemRefs.current[item.id]?.getBoundingClientRect();
            
            if (!centerBox || !currBox) return null;
            
            // Calculate midpoint for curved lines
            const centerX = centerBox.left + centerBox.width / 2;
            const centerY = centerBox.top + centerBox.height / 2;
            const currX = currBox.left + currBox.width / 2;
            const currY = currBox.top + currBox.height / 2;
            
            // Calculate control points for curved lines
            const midX = (centerX + currX) / 2;
            const midY = (centerY + currY) / 2;
            
            // Add some variation to control points
            const ctrlX = midX + (Math.random() * 20 - 10);
            const ctrlY = midY + (Math.random() * 20 - 10);
            
            // Very light blue connecting lines
            const strokeColor = "rgba(65,182,255,0.4)";
            
            // Create path for curved line
            const path = `M ${centerX} ${centerY} Q ${ctrlX} ${ctrlY} ${currX} ${currY}`;
            
            const lineDashLength = Math.sqrt(
              Math.pow(centerX - currX, 2) + Math.pow(centerY - currY, 2)
            ) * 1.5; // Multiply by 1.5 to account for curve
            
            const dashProgress = Math.min(1, scrollAmount[centerItem] / 100 * 1.5);
            
            return (
              <motion.path
                key={`line-${item.id}`}
                d={path}
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={lineDashLength}
                strokeDashoffset={lineDashLength * (1 - dashProgress)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            );
          })}
        </svg>
      )}

      <div 
        className={`grid grid-cols-3 grid-rows-3 h-full w-full max-h-screen max-w-screen p-8 relative`}
        style={{
          gap: '1.25rem', // Fixed gap size that doesn't change during expansion
          zIndex: 5 // Above the grid lines
        }}
      >
        {items.map((item) => {
          // Set grid positions to create a 3x3 grid with logo in center
          let gridPosition = "";
          switch(item.id) {
            case "framework":
              gridPosition = "col-start-1 col-end-2 row-start-1 row-end-2";
              break;
            case "voice":
              gridPosition = "col-start-2 col-end-3 row-start-1 row-end-2";
              break;
            case "logo": // Center item
              gridPosition = "col-start-2 col-end-3 row-start-2 row-end-3";
              break;
            case "typography":
              gridPosition = "col-start-3 col-end-4 row-start-1 row-end-2";
              break;
            case "color":
              gridPosition = "col-start-1 col-end-2 row-start-2 row-end-3";
              break;
            case "iconography":
              gridPosition = "col-start-3 col-end-4 row-start-2 row-end-3";
              break;
            case "imagery":
              gridPosition = "col-start-1 col-end-2 row-start-3 row-end-4";
              break;
            case "motion":
              gridPosition = "col-start-2 col-end-3 row-start-3 row-end-4";
              break;
            case "accessibility": // New bottom-right item
              gridPosition = "col-start-3 col-end-4 row-start-3 row-end-4";
              break;
            default:
              gridPosition = "col-start-3 col-end-4 row-start-3 row-end-4";
          }

          // Calculate position offset for moving items away from center
          const positionOffset = centerItem && typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] > 0 
            ? (() => {
                if (item.id === centerItem) return { x: 0, y: 0 };
                
                // Use exponential factor to make boxes move faster as they get further
                const moveOutFactor = Math.pow(scrollAmount[centerItem] / 100, 1.1) * 220;
                
                // Explicitly use the id as a string to avoid TypeScript errors
                const id = item.id;
                switch(id) {
                  case "framework": // top-left
                    return { x: -moveOutFactor, y: -moveOutFactor };
                  case "voice": // top-center
                    return { x: 0, y: -moveOutFactor * 1.1 };
                  case "typography": // top-right
                    return { x: moveOutFactor, y: -moveOutFactor };
                  case "color": // middle-left
                    return { x: -moveOutFactor * 1.1, y: 0 };
                  case "iconography": // middle-right
                    return { x: moveOutFactor * 1.1, y: 0 };
                  case "imagery": // bottom-left
                    return { x: -moveOutFactor, y: moveOutFactor };
                  case "motion": // bottom-center
                    return { x: 0, y: moveOutFactor * 1.1 };
                  default: // bottom-right
                    return { x: moveOutFactor, y: moveOutFactor };
                }
              })()
            : { x: 0, y: 0 };
          
          return (
            <motion.div
              key={item.id}
              ref={(el: HTMLDivElement | null) => { itemRefs.current[item.id] = el }}
              className={`bg-[${item.bgColor}] text-[${item.textColor}] p-4 overflow-hidden relative rounded-xl shadow-lg ${gridPosition} transition-colors`}
              animate={{
                opacity: getItemOpacity(item.id),
                scale: getItemSize(item.id),
                x: positionOffset.x,
                y: positionOffset.y,
                zIndex: getZIndex(item.id),
                backgroundColor: item.bgColor, // Keep original background color
                color: item.textColor, // Keep original text color 
                // Simplified blur effect
                filter: item.id !== centerItem && centerItem && 
                       typeof scrollAmount[centerItem] === 'number' && 
                       scrollAmount[centerItem] > 70 
                  ? `blur(${(scrollAmount[centerItem] - 70) / 30}px)` 
                  : "blur(0px)",
                boxShadow: hoveredItem === item.id || centerItem === item.id || expandedItem === item.id 
                  ? "0 10px 25px rgba(0,0,0,0.2)" 
                  : "0 4px 6px rgba(0,0,0,0.1)",
                // Fixed expanded state properties
                ...(expandedItem === item.id && {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100vw",
                  height: "100vh",
                  x: 0,
                  y: 0,
                  borderRadius: 0,
                  zIndex: 50
                }),
                // Simplified intermediate expansion for center item
                ...(item.id === centerItem && !expandedItem && centerItem && 
                  typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] > 0 && {
                  position: "relative",
                  zIndex: 25,
                  scale: 1 + (scrollAmount[centerItem] / 100) * 0.2,
                }),
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                // Make expanded/contracted state more stable with slower transitions
                ...(expandedItem === item.id || (expandedItem !== null && expandedItem !== item.id) 
                  ? { duration: 0.4 }
                  : {}
                ),
              }}
              layout="preserve-aspect"
              onWheel={(e) => {
                // Only handle wheel events on center item or container
                if (item.id === centerItem && !expandedItem) {
                  handleWheel(e)
                }
              }}
              onClick={() => handleClick(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={handleMouseLeave}
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor,
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{item.title}</h2>
                {item.id === centerItem && !expandedItem && centerItem && (
                  <motion.div 
                    className="text-xs font-semibold px-2 py-1 rounded-full bg-white bg-opacity-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] > 0 
                      ? `${Math.round(scrollAmount[centerItem])}%` 
                      : "Scroll to expand"}
                  </motion.div>
                )}
              </div>
              
              {/* Don't animate center box content during expansion */}
              {(item.id === centerItem) 
                ? (
                  <div className="h-full flex items-center justify-center">
                    {item.id === "logo" ? (
                      <motion.div
                        className="w-12 h-12 flex items-center justify-center"
                        animate={{
                          scale: 1,
                        }}
                        transition={{ 
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                          duration: 0.2
                        }}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="#0a3d62" 
                          className="w-full h-full"
                        >
                          <path d="M12 2l5.5 5.5-5.5 5.5-5.5-5.5 5.5-5.5zM5.5 14.5l5.5 5.5 5.5-5.5-5.5-5.5-5.5 5.5z"/>
                        </svg>
                      </motion.div>
                    ) : (
                      <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                      >
                        <rect x="20" y="20" width="30" height="30" fill="#0a3d62" />
                        <rect x="70" y="20" width="30" height="30" fill="#0a3d62" />
                        <rect x="45" y="45" width="30" height="30" fill="#0a3d62" />
                        <rect x="20" y="70" width="30" height="30" fill="#0a3d62" />
                        <rect x="70" y="70" width="30" height="30" fill="#0a3d62" />
                      </svg>
                    )}
                  </div>
                )
                : ((!centerItem || typeof scrollAmount[centerItem] !== 'number' || scrollAmount[centerItem] === 0) 
                  ? item.content 
                  : <div className="h-full flex items-center justify-center opacity-80">{item.content}</div>
                )
              }
              
              <AnimatePresence>
                {expandedItem === item.id && (
                  <motion.div
                    className="absolute inset-0 p-8 bg-opacity-100 overflow-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                      backgroundColor: item.bgColor, // Keep original background color
                    }}
                  >
                    {/* Add decorative lines in the expanded view - light blue */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <svg width="100%" height="100%" className="opacity-50">
                        <pattern id="expandedGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(65,182,255,0.3)" strokeWidth="1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#expandedGrid)" />
                        
                        <pattern id="expandedLargeGrid" width="120" height="120" patternUnits="userSpaceOnUse">
                          <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(65,182,255,0.4)" strokeWidth="1.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#expandedLargeGrid)" />
                      </svg>
                    </div>
                    
                    <div className="max-w-6xl mx-auto relative z-10">
                      <div className="flex justify-between items-center mb-8 pt-6">
                        <h1 className="text-4xl font-bold">{item.title}</h1>
                        <motion.button
                          className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedItem(null);
                          }}
                        >
                          Close
                        </motion.button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-16">
                        {/* Enhanced expandedContent with sections */}
                        <div className="md:col-span-8 space-y-8">
                          <section className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-medium mb-6 flex items-center">
                              <span className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="8" x2="12" y2="16"></line>
                                  <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                              </span>
                              Overview
                            </h2>
                            <div className="prose prose-lg">
                              {item.expandedContent}
                            </div>
                          </section>
                          
                          <section className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-medium mb-6 flex items-center">
                              <span className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                  <path d="M3 9h18"></path>
                                  <path d="M9 21V9"></path>
                                </svg>
                              </span>
                              Best Practices
                            </h2>
                            <div className="space-y-4">
                              <div className="flex items-start">
                                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4 mt-1">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="font-medium text-lg">Consistency is Key</h3>
                                  <p>Maintain consistency across all touchpoints to build a coherent experience.</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4 mt-1">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="font-medium text-lg">Less is More</h3>
                                  <p>Focus on simplicity and clarity rather than complexity and clutter.</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4 mt-1">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="font-medium text-lg">Test and Iterate</h3>
                                  <p>Regularly test with users and refine based on their feedback.</p>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                        
                        <div className="md:col-span-4 space-y-8">
                          <section className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-medium mb-6 flex items-center">
                              <span className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                              </span>
                              Resources
                            </h2>
                            <ul className="space-y-3">
                              <li>
                                <a href="#" className="flex items-center p-3 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors">
                                  <span className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                      <polyline points="13 2 13 9 20 9"></polyline>
                                    </svg>
                                  </span>
                                  <span>Documentation</span>
                                </a>
                              </li>
                              <li>
                                <a href="#" className="flex items-center p-3 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors">
                                  <span className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                      <path d="M2 2l7.586 7.586"></path>
                                      <circle cx="11" cy="11" r="2"></circle>
                                    </svg>
                                  </span>
                                  <span>Sketch Files</span>
                                </a>
                              </li>
                              <li>
                                <a href="#" className="flex items-center p-3 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors">
                                  <span className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                  </span>
                                  <span>Examples</span>
                                </a>
                              </li>
                            </ul>
                          </section>
                          
                          <section className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-medium mb-6 flex items-center">
                              <span className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                              </span>
                              Need Help?
                            </h2>
                            <p className="mb-4">Have questions about implementing this in your project?</p>
                            <button className="w-full py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                              Contact Support
                            </button>
                          </section>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

