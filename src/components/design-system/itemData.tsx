/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  LayoutGridIcon, 
  MicIcon, 
  TypeIcon, 
  PaletteIcon, 
  ImageIcon, 
  CircleIcon, 
  ActivityIcon, 
  AccessibilityIcon,
  ChevronRightIcon,
  MessageSquareIcon,
  SquareIcon,
  BoxIcon,
  GridIcon,
  ShapesIcon
} from "lucide-react"
import type { DesignSystemItem } from "./types"

export const getDesignSystemItems = (): DesignSystemItem[] => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return [
    {
      id: "framework",
      title: "Framework",
      bgColor: "#3A86FF",
      textColor: "white",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Framework</h3>
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
              <motion.div 
                className="w-8 h-8 bg-white rounded-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
              ></motion.div>
              <motion.div 
                className="w-8 h-8 bg-white rounded-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
              ></motion.div>
              <motion.div 
                className="w-8 h-8 bg-white rounded-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
              ></motion.div>
              <motion.div 
                className="w-8 h-8 bg-white rounded-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
              ></motion.div>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <LayoutGridIcon size={48} className="text-white" />
            </motion.div>
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
      bgColor: "#FF9F1C",
      textColor: "#5d4037",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Voice & Tone</h3>
          {hoveredItem === "voice" ? (
            <motion.div
              className="flex items-center justify-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="relative"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <MessageSquareIcon size={48} className="text-[#5d4037]" />
                <motion.div
                  className="absolute top-0 left-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MicIcon size={48} className="text-[#5d4037]" />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <MicIcon size={48} className="text-[#5d4037]" />
            </motion.div>
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
      id: "leftBox",
      title: "Services",
      bgColor: "#8338EC",
      textColor: "white",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Services</h3>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-center"
          >
            <ShapesIcon size={48} className="text-white" />
          </motion.div>
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Our Services</h3>
          <p className="mb-4">
            Comprehensive solutions to meet all your business needs.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Product Development</li>
            <li>UX/UI Design</li>
            <li>Cloud Infrastructure</li>
            <li>Consulting Services</li>
          </ul>
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
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              className="w-full h-full"
            >
              <path d="M63.246 0L0 41.625l43.766 35.22 64.764-39.812-45.284-37.033zm129.728 0L147.69 37.033l64.762 39.812 43.768-35.22L193.735 0h-.761zm-129.728 115.6L0 74.336l43.766-35.033 64.764 39.626-45.284 36.672zm129.728 0L147.69 73.93l64.762-39.626 43.768 35.032-63.52 41.264zm-65.202 42.627l-45.046-36.848-45.285 36.848 45.285 37.22 45.046-37.22z" fill="#0061FF" />
            </svg>
          </div>
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
      id: "rightBox",
      title: "Projects",
      bgColor: "#FF006E",
      textColor: "white",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Projects</h3>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-center"
          >
            <GridIcon size={48} className="text-white" />
          </motion.div>
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Our Projects</h3>
          <p className="mb-4">
            Explore our successful implementations and client work.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Recent Work:</h4>
              <ul className="list-disc pl-5">
                <li>E-commerce Platform</li>
                <li>Mobile Banking App</li>
                <li>Healthcare Portal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Industries:</h4>
              <ul className="list-disc pl-5">
                <li>Finance</li>
                <li>Healthcare</li>
                <li>Retail</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "typography",
      title: "Typography",
      bgColor: "#FB5607",
      textColor: "#ffffff",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Typography</h3>
          {hoveredItem === "typography" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div 
                className="font-bold text-3xl" 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Aa
              </motion.div>
              <motion.div 
                className="text-sm font-light"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              >
                Helvetica
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <TypeIcon size={48} className="text-white" />
            </motion.div>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Typography System</h3>
          <p className="mb-4">Our typographic hierarchy ensures readability and brand consistency across all touchpoints.</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Primary Typeface: Helvetica Neue</h4>
              <p className="text-sm">Used for headings, buttons, and key UI elements</p>
              <div className="mt-2">
                <p className="text-2xl font-bold">Heading</p>
                <p className="text-lg font-medium">Subheading</p>
                <p className="text-base">Body text</p>
                <p className="text-sm">Small text / Caption</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium">Secondary Typeface: Georgia</h4>
              <p className="text-sm italic font-serif">Used for longform content and special applications</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "color",
      title: "Color",
      bgColor: "#8338EC",
      textColor: "white",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Color</h3>
          {hoveredItem === "color" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <motion.div
                className="w-10 h-10 rounded-full bg-blue-500"
                animate={{ 
                  backgroundColor: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#3B82F6"] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="w-10 h-10 rounded-full bg-red-500"
                animate={{ 
                  backgroundColor: ["#EF4444", "#10B981", "#F59E0B", "#3B82F6", "#EF4444"] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
              <motion.div
                className="w-10 h-10 rounded-full bg-green-500"
                animate={{ 
                  backgroundColor: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#10B981"] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
              />
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <PaletteIcon size={48} className="text-white" />
            </motion.div>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Color Palette</h3>
          <p className="mb-4">Our color system expresses our brand personality and improves usability through appropriate contrast.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Primary Colors</h4>
              <div className="flex gap-2 mt-2">
                <div className="w-10 h-10 rounded-md bg-[#0061FF]"></div>
                <div className="w-10 h-10 rounded-md bg-[#FF5154]"></div>
                <div className="w-10 h-10 rounded-md bg-[#FFB54C]"></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium">Secondary Colors</h4>
              <div className="flex gap-2 mt-2">
                <div className="w-10 h-10 rounded-md bg-[#14B8A6]"></div>
                <div className="w-10 h-10 rounded-md bg-[#8B5CF6]"></div>
                <div className="w-10 h-10 rounded-md bg-[#F43F5E]"></div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "iconography",
      title: "Iconography",
      bgColor: "#FF006E",
      textColor: "white",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Iconography</h3>
          {hoveredItem === "iconography" ? (
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <ShapesIcon size={32} className="text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <BoxIcon size={32} className="text-white" />
              </motion.div>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <GridIcon size={32} className="text-white" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <CircleIcon size={48} className="text-white" />
            </motion.div>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Icon System</h3>
          <p className="mb-4">Consistent visual language through icons that aid navigation and comprehension.</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Icon Style Guidelines</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>2px stroke weight</li>
                <li>Rounded corners (2px radius)</li>
                <li>Consistent padding within bounding box</li>
                <li>Simplicity over detail</li>
              </ul>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-10 rounded-md">
                <CircleIcon size={24} className="text-white" />
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-10 rounded-md">
                <BoxIcon size={24} className="text-white" />
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-10 rounded-md">
                <GridIcon size={24} className="text-white" />
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-10 rounded-md">
                <ShapesIcon size={24} className="text-white" />
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "imagery",
      title: "Imagery",
      bgColor: "#3A86FF",
      textColor: "white",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Imagery</h3>
          {hoveredItem === "imagery" ? (
            <motion.div
              className="relative w-12 h-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <SquareIcon size={48} className="text-white" />
              </motion.div>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ImageIcon size={48} className="text-white" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <ImageIcon size={48} className="text-white" />
            </motion.div>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Photography & Illustration</h3>
          <p className="mb-4">Visual assets that reinforce our brand story and create emotional connection.</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Photography Style</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Natural lighting</li>
                <li>Authentic moments</li>
                <li>Rich color treatment</li>
                <li>People-focused</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Illustration Style</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Geometric shapes</li>
                <li>Limited color palette</li>
                <li>Conceptual approach</li>
                <li>Consistency with brand</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "motion",
      title: "Motion",
      bgColor: "#FF9F1C",
      textColor: "#5d4037",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Motion</h3>
          {hoveredItem === "motion" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <ActivityIcon size={48} className="text-[#5d4037]" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <ActivityIcon size={48} className="text-[#5d4037]" />
            </motion.div>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Motion Design</h3>
          <p className="mb-4">Animation principles that bring our interfaces to life and guide users through experiences.</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Animation Principles</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Purposeful movement</li>
                <li>Natural physics</li>
                <li>Appropriate timing</li>
                <li>Contextual feedback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Transition Types</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Page transitions: 300-500ms</li>
                <li>Micro-interactions: 150-250ms</li>
                <li>Loading states: looping</li>
                <li>Hover effects: 150ms</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "accessibility",
      title: "Accessibility",
      bgColor: "#6EBF8B",
      textColor: "white",
      content: (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">Accessibility</h3>
          {hoveredItem === "accessibility" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="relative"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AccessibilityIcon size={48} className="text-white" />
                <motion.div
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    scale: [0.8, 1.5, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <AccessibilityIcon size={48} className="text-white opacity-30" />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <AccessibilityIcon size={48} className="text-white" />
            </motion.div>
          )}
        </div>
      ),
      expandedContent: (
        <>
          <h3 className="text-xl font-semibold mb-2">Inclusive Design</h3>
          <p className="mb-4">Ensuring our products are usable by people with diverse abilities and needs.</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Core Principles</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>WCAG 2.1 AA compliance minimum</li>
                <li>Keyboard navigability</li>
                <li>Screen reader compatibility</li>
                <li>Color contrast ratios (4.5:1 minimum)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Testing Requirements</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Automated testing</li>
                <li>Manual keyboard testing</li>
                <li>Screen reader validation</li>
                <li>User testing with diverse abilities</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ]
} 