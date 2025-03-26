"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LockIcon, UnlockIcon, MoonIcon, PaletteIcon, TypeIcon, RefreshCwIcon } from "lucide-react"
import type { DesignSystemItem } from "./types"

export const getDesignSystemItems = (): DesignSystemItem[] => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return [
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
                  pathLength: 0.6,
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
                  pathLength: 0.6,
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
                transition={{ type: "spring", stiffness: 300 }}
              >
                &ldquo;&ldquo;
              </motion.span>
              <motion.span
                className="text-[#5d4037] text-8xl"
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
      bgColor: "#ffffff",
      textColor: "#0061FF",
      content: (
        <div className="flex justify-center items-center h-full">
          {hoveredItem === "logo" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-14 h-14"
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
          ) : (
            <motion.div
              className="w-12 h-12 flex items-center justify-center"
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
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.div
                className="absolute w-16 h-16 bg-[#6d3200] rounded-full"
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
                  pathLength: 0.6,
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.circle
                cx="30"
                cy="30"
                r="8"
                fill="#4a148c"
              />
              <motion.circle
                cx="120"
                cy="30"
                r="8"
                fill="#4a148c"
              />
              <motion.circle
                cx="75"
                cy="120"
                r="8"
                fill="#4a148c"
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
} 