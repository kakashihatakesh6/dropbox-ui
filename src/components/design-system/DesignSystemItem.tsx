"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { DesignSystemItem as DesignSystemItemType } from "./types"

// Helper function to adjust color brightness for gradients
const adjustColorBrightness = (hexColor: string, percent: number): string => {
  // Remove the # if present
  hexColor = hexColor.replace('#', '');

  // Parse the hex values
  let r = parseInt(hexColor.substr(0, 2), 16);
  let g = parseInt(hexColor.substr(2, 2), 16);
  let b = parseInt(hexColor.substr(4, 2), 16);

  // Adjust brightness
  r = Math.min(255, Math.max(0, r + percent));
  g = Math.min(255, Math.max(0, g + percent));
  b = Math.min(255, Math.max(0, b + percent));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

interface DesignSystemItemProps {
  item: DesignSystemItemType
  isCenter: boolean
  isExpanded: boolean
  isHovered: boolean
  getExpansionScale: (item: string) => number
  getItemOpacity: (item: string) => number
  getItemSize: (item: string) => number
  getZIndex: (item: string) => number
  getEntrancePosition: (itemId: string) => { x: number; y: number }
  getEntranceScale: (itemId: string) => number
  getEntranceOpacity: (itemId: string) => number
  getBoxShadow: (itemId: string) => string
  getLogoInitialPosition: (itemId: string) => { x: number; y: number }
  getPositionOffset: (item: string) => { x: number; y: number }
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
  gridPosition: string
  scrollAmount: Record<string, number>
  entranceAnimation: boolean
  hasInitialized: boolean
  isExpanding: boolean
  centerItem: string | null
  transitionDuration?: number
}

export function DesignSystemItem({
  item,
  isCenter,
  isExpanded,
  isHovered,
  getItemOpacity,
  getItemSize,
  getZIndex,
  getEntrancePosition,
  getEntranceScale,
  getEntranceOpacity,
  getBoxShadow,
  getLogoInitialPosition,
  getPositionOffset,
  onMouseEnter,
  onMouseLeave,
  onClick,
  gridPosition,
  scrollAmount,
  entranceAnimation,
  isExpanding,
  centerItem,

}: DesignSystemItemProps) {
  // Get initial position for entrance animation
  const initialPosition = getEntrancePosition(item.id);

  // Get initial position from logo bounds for the transition animation
  const initialLogoPosition = getLogoInitialPosition(item.id);

  // Calculate position offset for moving items away from center
  const positionOffset = getPositionOffset(item.id);

  return (
    <motion.div
      className={`overflow-hidden relative rounded-xl shadow-lg ${gridPosition}`}
      initial={entranceAnimation ? {
        opacity: getEntranceOpacity(item.id),
        scale: getEntranceScale(item.id),
        x: item.id === "logo" ? initialPosition.x : initialPosition.x + initialLogoPosition.x,
        y: item.id === "logo" ? initialPosition.y : initialPosition.y + initialLogoPosition.y
      } : undefined}
      animate={{
        opacity: getItemOpacity(item.id),
        scale: getItemSize(item.id),
        x: item.id === "logo" ? positionOffset.x : positionOffset.x + initialLogoPosition.x,
        y: item.id === "logo" ? positionOffset.y : positionOffset.y + initialLogoPosition.y,
        zIndex: getZIndex(item.id),
        color: item.textColor,
        filter: item.id !== centerItem && centerItem &&
          typeof scrollAmount[centerItem] === 'number' &&
          scrollAmount[centerItem] > 70
          ? `blur(${(scrollAmount[centerItem] - 70) / 30}px)`
          : "blur(0px)",
        boxShadow: getBoxShadow(item.id),
        ...(isExpanded && {
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
        ...(item.id === "logo" && centerItem === "logo" &&
          typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] === 100 && {
          width: "30vw",
          height: "30vw",
          position: "fixed",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          borderRadius: "1rem",
          scale: 1,
          zIndex: 30
        }),
        ...(item.id === "logo" && centerItem === "logo" &&
          typeof scrollAmount[centerItem] === 'number' && (scrollAmount[centerItem] === 0 || scrollAmount[centerItem] <= 0) && {
          width: "auto",
          height: "auto",
          position: "relative",
          top: "auto",
          left: "auto",
          x: 0,
          y: 0,
          zIndex: 25,
        }),
        ...(isCenter && !isExpanded && centerItem &&
          typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] > 0 && {
          position: "relative",
          zIndex: 25,
          transformOrigin: "center center",
          scale: 1 + (scrollAmount[centerItem] / 100) * 0.2,
        }),
      }}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: 0.4,
        ...(isExpanded || (isExpanded === false && centerItem !== null && centerItem !== item.id)
          ? {
            type: "spring",
            stiffness: 80,
            damping: 30,
            mass: 1.2,
            duration: 0.5,
          }
          : {}
        ),
      }}
      layout={false}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        background: item.id === "logo"
          ? item.bgColor
          : `linear-gradient(135deg, ${item.bgColor}, ${adjustColorBrightness(item.bgColor, -20)})`,
        color: item.textColor,
        border: `1px solid rgba(255, 255, 255, ${isHovered ? '0.2' : '0.1'})`,
        boxShadow: isHovered
          ? `0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`
          : `0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
        padding: "1rem",
        ...(item.id === "logo" && {
          transformOrigin: "center center",
          background: item.bgColor,
        }),
      }}
    >
      {item.id === "logo" && centerItem === "logo" &&
        typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] !== 100 &&
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{item.title}</h2>
          {isCenter && !isExpanded && centerItem && (
            <motion.div
              className="text-xs font-semibold px-2 py-1 rounded-full bg-white bg-opacity-20 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {isExpanding && typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] > 0
                ? `${Math.round(scrollAmount[centerItem])}%`
                : "Scroll to expand"}
            </motion.div>
          )}
        </div>
      }

      {/* Don't animate center box content during expansion */}
      {isCenter
        ? (
          <div className="h-full flex flex-col">
            {/* Header when logo is fully expanded to 100% */}
            {item.id === "logo" && centerItem === "logo" &&
              typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] === 100 && (
                <div
                  className="flex items-start p-8 border-gray-200"
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
              )}

            <div className="flex-grow flex items-center justify-center">
              {item.id === "logo" && centerItem === "logo" &&
                typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] === 100 ? (
                <div></div>
              ) : (
                <motion.div
                  className={`flex items-center justify-center ${item.id === "logo" ? "w-10 h-10" : "w-12 h-12"}`}
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
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                    className="w-full h-full"
                  >
                    <path d="M63.246 0L0 41.625l43.766 35.22 64.764-39.812-45.284-37.033zm129.728 0L147.69 37.033l64.762 39.812 43.768-35.22L193.735 0h-.761zm-129.728 115.6L0 74.336l43.766-35.033 64.764 39.626-45.284 36.672zm129.728 0L147.69 73.93l64.762-39.626 43.768 35.032-63.52 41.264zm-65.202 42.627l-45.046-36.848-45.285 36.848 45.285 37.22 45.046-37.22z" fill="#0061FF" />
                  </svg>
                </motion.div>
              )}
            </div>

            {/* Bottom section with icon and down arrow for logo when fully expanded to 100% */}
            {item.id === "logo" && centerItem === "logo" &&
              typeof scrollAmount[centerItem] === 'number' && scrollAmount[centerItem] === 100 && (
                <div
                  className={`py-8 px-16 flex w-full justify-between items-center`}
                >
                  <div
                    className={`w-10 h-10 transition-all duration-500 ease-out`}
                  >
                    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                      <path d="M63.246 0L0 41.625l43.766 35.22 64.764-39.812-45.284-37.033zm129.728 0L147.69 37.033l64.762 39.812 43.768-35.22L193.735 0h-.761zm-129.728 115.6L0 74.336l43.766-35.033 64.764 39.626-45.284 36.672zm129.728 0L147.69 73.93l64.762-39.626 43.768 35.032-63.52 41.264zm-65.202 42.627l-45.046-36.848-45.285 36.848 45.285 37.22 45.046-37.22z" fill="#0061FF" />
                    </svg>
                  </div>

                  <div
                    className="w-9 h-9"
                    style={{
                      opacity: 1,
                      transition: 'opacity 0.3s ease-out',
                      display: 'block'
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="#0061FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
          </div>
        )
        : ((!centerItem || typeof scrollAmount[centerItem] !== 'number' || scrollAmount[centerItem] === 0)
          ? item.content
          : <div className="h-full flex items-center justify-center">{item.content}</div>
        )
      }

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute inset-0 p-8 bg-opacity-100 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              // Use the scroll amount to calculate the content visibility
              scale: Math.min(1, (scrollAmount[item.id] || 0) / 100),
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              // Add a slight delay to the content appearing
              delay: 0.1
            }}
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
                    onClick();
                  }}
                >
                  Close
                </motion.button>
              </div>

              {/* Only display content when scroll amount is at least 80% */}
              {(scrollAmount[item.id] || 0) > 80 && (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-16"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: ((scrollAmount[item.id] || 0) - 80) / 20, // Fade in from 80% to 100%
                  }}
                  transition={{ duration: 0.3 }}
                >
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
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 