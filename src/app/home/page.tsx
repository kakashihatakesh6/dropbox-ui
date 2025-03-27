"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Quote,
  DropletIcon as Dropbox,
  Type,
  Lock,
  Palette,
  ImageIcon,
  Wand2,
  Network,
  MessageSquareQuote,
  ImageIcon as LogoIcon,
  TextIcon,
  Unlock,
  CircleDashed,
  Mountain,
  Sparkles,
  Star,
  Asterisk,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="w-full h-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4 h-full">
        {/* Framework */}
        <GridItem
          title="Framework"
          bgColor="bg-[#2c3e50]"
          textColor="text-white"
          defaultIcon={<Network className="w-12 h-12 stroke-[1.5]" />}
          hoverIcon={<Box className="w-12 h-12 stroke-[1.5]" />}
          className="md:col-span-3 md:row-span-2"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="relative w-32 h-32">
              <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute top-0 left-0 w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M0,0 L50,50 L0,100" stroke="white" strokeWidth="1" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </GridItem>

        {/* Voice & Tone */}
        <GridItem
          title="Voice & Tone"
          bgColor="bg-[#f1c40f]"
          textColor="text-[#8B6914]"
          defaultIcon={<Quote className="w-12 h-12 stroke-[1.5]" />}
          hoverIcon={<MessageSquareQuote className="w-12 h-12 stroke-[1.5]" />}
          className="md:col-span-6"
        >
          <div className="absolute inset-0 flex items-center justify-between p-8 opacity-70">
            <span className="text-[#8B6914] text-8xl">&ldquo;</span>
            <span className="text-[#8B6914] text-8xl">&rdquo;</span>
          </div>
        </GridItem>

        {/* Logo */}
        <GridItem
          title="Logo"
          bgColor="bg-[#48dbfb]"
          textColor="text-[#0a3d47]"
          defaultIcon={<Dropbox className="w-12 h-12 stroke-[1.5]" />}
          hoverIcon={<LogoIcon className="w-12 h-12 stroke-[1.5]" />}
          className="md:col-span-3 md:row-span-2"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Dropbox className="w-12 h-12 text-[#0a6e80]" />
          </div>
        </GridItem>

        {/* Typography */}
        <GridItem
          title="Typography"
          bgColor="bg-[#ff7f50]"
          textColor="text-[#7a2e19]"
          defaultIcon={<Type className="w-12 h-12 stroke-[1.5]" />}
          hoverIcon={<TextIcon className="w-12 h-12 stroke-[1.5]" />}
          className="md:col-span-3"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#7a2e19] text-8xl font-bold">Aa</span>
          </div>
        </GridItem>

        {/* Small Accent Box */}
        <SmallGridItem
          bgColor="bg-[#9b59b6]"
          textColor="text-white"
          defaultIcon={<Star className="w-4 h-4 stroke-[1.5]" />}
          hoverIcon={<Asterisk className="w-4 h-4 stroke-[1.5]" />}
          className="md:col-span-1"
        />

        {/* Iconography */}
        <GridItem
          title="Iconography"
          bgColor="bg-[#b8e994]"
          textColor="text-[#2c6e31]"
          defaultIcon={<Lock className="w-12 h-12 stroke-[1.5]" />}
          hoverIcon={<Unlock className="w-12 h-12 stroke-[1.5]" />}
          className="md:col-span-2"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-16 h-16 text-[#2c6e31]" />
          </div>
        </GridItem>

        {/* Color */}
        <GridItem
          title="Color"
          bgColor="bg-[#ff9f43]"
          textColor="text-[#774212]"
          defaultIcon={<Palette className="w-12 h-12 stroke-[1.5]" />}
          hoverIcon={<CircleDashed className="w-12 h-12 stroke-[1.5]" />}
          className="md:col-span-5 md:row-span-2"
        >
          <div className="absolute bottom-10 right-10 flex flex-col gap-2">
            <div className="w-16 h-16 bg-[#b25819] rounded-md"></div>
            <div className="w-16 h-16 bg-[#b25819] rounded-full ml-16"></div>
          </div>
        </GridItem>

        {/* Imagery */}
        <GridItem
          title="Imagery"
          bgColor="bg-[#a5324a]"
          textColor="text-[#f8c3cd]"
          defaultIcon={<ImageIcon className="w-12 h-12 stroke-[1.5]" />}
          hoverIcon={<Mountain className="w-12 h-12 stroke-[1.5]" />}
          className="md:col-span-4"
        >
          <div className="absolute bottom-10 right-10">
            <div className="w-32 h-32 bg-[#f8c3cd] rounded-md overflow-hidden">
              <div className="w-6 h-6 bg-[#d44d6e] rounded-full absolute top-6 left-6"></div>
              <div className="absolute bottom-0 w-full h-16">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path d="M0,50 Q25,0 50,25 Q75,50 100,15 L100,50 L0,50 Z" fill="#d44d6e" />
                </svg>
              </div>
            </div>
          </div>
        </GridItem>

        {/* Motion */}
        <GridItem
          title="Motion"
          bgColor="bg-[#d8b5e8]"
          textColor="text-[#5d2a7e]"
          defaultIcon={<Wand2 className="w-12 h-12 stroke-[1.5]" />}
          hoverIcon={<Sparkles className="w-12 h-12 stroke-[1.5]" />}
          className="md:col-span-3"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#5d2a7e] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#5d2a7e] rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#5d2a7e] rounded-full"></div>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M100,0 C60,40 40,60 0,100" stroke="#5d2a7e" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </GridItem>
      </div>
    </div>
  )
}

interface GridItemProps {
  title: string
  bgColor: string
  textColor: string
  defaultIcon: React.ReactNode
  hoverIcon: React.ReactNode
  children?: React.ReactNode
  className?: string
}

function GridItem({ title, bgColor, textColor, defaultIcon, hoverIcon, children, className = "" }: GridItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative overflow-hidden rounded-lg p-6 min-h-[200px] ${bgColor} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className={`text-2xl font-bold ${textColor} z-10 relative`}>{title}</h2>

      <div className="absolute top-6 right-6 transition-all duration-300 ease-in-out">
        <div className={`transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}>
          {defaultIcon}
        </div>
        <div
          className={`absolute top-0 left-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          {hoverIcon}
        </div>
      </div>

      {children}
    </div>
  )
}

interface SmallGridItemProps {
  bgColor: string
  textColor: string
  defaultIcon: React.ReactNode
  hoverIcon: React.ReactNode
  className?: string
}

function SmallGridItem({ bgColor, textColor, defaultIcon, hoverIcon, className = "" }: SmallGridItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative overflow-hidden rounded-lg w-[70px] h-[70px] flex items-center justify-center ${bgColor} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: "70px", height: "70px", alignSelf: "center", justifySelf: "center" }}
    >
      <div className="transition-all duration-300 ease-in-out">
        <div className={`transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"} ${textColor}`}>
          {defaultIcon}
        </div>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"} ${textColor}`}
        >
          {hoverIcon}
        </div>
      </div>
    </div>
  )
}

