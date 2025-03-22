"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LockIcon } from "lucide-react"

export default function DesignSystem() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [centerItem, setCenterItem] = useState<string | null>(null)
  const [scrollAmount, setScrollAmount] = useState<Record<string, number>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate which item is in the center of the viewport
  useEffect(() => {
    const calculateCenterItem = () => {
      if (!containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerCenter = containerRect.top + containerRect.height / 2
      
      let closestItem = null
      let closestDistance = Infinity

      // Find the item closest to the center
      Object.entries(itemRefs.current).forEach(([itemId, element]) => {
        if (!element) return
        
        const rect = element.getBoundingClientRect()
        const itemCenter = rect.top + rect.height / 2
        const distance = Math.abs(containerCenter - itemCenter)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestItem = itemId
        }
      })

      setCenterItem(closestItem)
    }

    calculateCenterItem()
    
    const handleScroll = () => {
      calculateCenterItem()
      setIsScrolling(true)
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Set a new timeout
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
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
  }, [])

  // Track scroll amount for the center item only
  const handleWheel = (e: React.WheelEvent, item: string) => {
    if (item !== centerItem) return
    
    e.preventDefault() // Prevent default scroll behavior

    // Update scroll amount for this item
    setScrollAmount((prev) => {
      const currentAmount = prev[item] || 0
      const newAmount = Math.max(0, Math.min(100, currentAmount + (e.deltaY > 0 ? 5 : -5)))

      // If scroll reaches threshold, expand the item
      if (newAmount >= 100 && expandedItem !== item) {
        setExpandedItem(item)
      } else if (newAmount <= 0 && expandedItem === item) {
        setExpandedItem(null)
      }

      return {
        ...prev,
        [item]: newAmount,
      }
    })
  }

  // Handle click to toggle expanded state
  const handleClick = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item)
    
    // Reset scroll amount when closing
    if (expandedItem === item) {
      setScrollAmount(prev => ({
        ...prev,
        [item]: 0
      }))
    }
  }

  // Reset when mouse leaves
  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  // Get expansion scale for an item (0-1)
  const getExpansionScale = (item: string) => {
    if (expandedItem === item) return 1
    if (item === centerItem) return (scrollAmount[item] || 0) / 100
    if (item === hoveredItem) return 0.5 // Partial animation on hover
    return 0
  }

  // Get opacity for items
  const getItemOpacity = (item: string) => {
    if (expandedItem && expandedItem !== item) return 0.5
    return 1
  }

  // Get size for an item based on hover/center/expanded state
  const getItemSize = (item: string) => {
    if (expandedItem === item) return 1.1
    if (item === centerItem) return 1 + (scrollAmount[centerItem] || 0) / 100 * 0.1
    if (item === hoveredItem) return 1.05
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
      span: "col-span-1",
      content: (
        <div className="h-full flex items-center justify-center">
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
      span: "md:col-span-2",
      content: (
        <div className="flex justify-between items-center h-32">
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
      span: "md:row-span-2",
      content: (
        <div className="flex justify-center items-center h-64">
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            animate={{
              rotate: 360 * getExpansionScale("logo"),
              scale: 1 + 0.2 * getExpansionScale("logo"),
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.rect x="20" y="20" width="30" height="30" fill="#0a3d62" />
            <motion.rect x="70" y="20" width="30" height="30" fill="#0a3d62" />
            <motion.rect x="45" y="45" width="30" height="30" fill="#0a3d62" />
            <motion.rect x="20" y="70" width="30" height="30" fill="#0a3d62" />
            <motion.rect x="70" y="70" width="30" height="30" fill="#0a3d62" />
          </motion.svg>
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
      span: "col-span-1",
      content: (
        <div className="flex justify-center items-center h-32">
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
      span: "md:col-span-2 lg:col-span-1",
      content: (
        <div className="flex justify-center items-center h-32 relative">
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
      span: "col-span-1",
      content: (
        <div className="flex justify-center items-center h-32">
          <motion.div
            animate={{
              scale: 1 + 0.5 * getExpansionScale("iconography"),
              y: -20 * getExpansionScale("iconography"),
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <LockIcon size={64} className="text-[#1e5631]" />
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
      span: "md:col-span-2",
      content: (
        <div className="flex justify-end items-center h-32">
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
      span: "col-span-1",
      content: (
        <div className="flex justify-center items-center h-64">
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
              }}
              transition={{
                repeat: expandedItem === "motion" ? Number.POSITIVE_INFINITY : 0,
                duration: 1,
                delay: 1,
              }}
            />
          </svg>
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
  ]

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4" ref={containerRef}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {items.map((item) => (
          <motion.div
            key={item.id}
            ref={el => itemRefs.current[item.id] = el}
            className={`bg-[${item.bgColor}] text-[${item.textColor}] p-6 overflow-hidden relative rounded-xl shadow-lg ${item.span}`}
            animate={{
              height: expandedItem === item.id ? 500 : 300,
              opacity: getItemOpacity(item.id),
              scale: getItemSize(item.id),
              zIndex: getZIndex(item.id),
              boxShadow: hoveredItem === item.id || centerItem === item.id || expandedItem === item.id 
                ? "0 10px 25px rgba(0,0,0,0.2)" 
                : "0 4px 6px rgba(0,0,0,0.1)",
              // When fully expanded, make it take more space
              ...(expandedItem === item.id && {
                gridColumn: "1 / -1", // Span all columns
                height: 600,
              }),
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              // Make layout transitions smoother
              layout: { duration: 0.5 },
            }}
            layout
            onWheel={(e) => handleWheel(e, item.id)}
            onClick={() => handleClick(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundColor: item.bgColor,
              color: item.textColor,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">{item.title}</h2>
              {centerItem === item.id && !expandedItem && (
                <motion.div 
                  className="text-xs font-semibold px-2 py-1 rounded-full bg-white bg-opacity-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Scroll to expand
                </motion.div>
              )}
            </div>
            
            {item.content}
            
            <AnimatePresence>
              {expandedItem === item.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-8 bg-opacity-95 rounded-b-xl backdrop-blur-sm"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    backgroundColor: item.bgColor,
                  }}
                >
                  {item.expandedContent}
                  <motion.button
                    className="mt-4 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedItem(null);
                    }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

