"use client"

import React, { useRef } from "react"
import { motion } from "framer-motion"
import { DesignSystemItem } from "./DesignSystemItem"
import { useDesignSystem } from "./useDesignSystem"
import { getDesignSystemItems } from "./itemData"
import type { DesignSystemProps } from "./types"

export function DesignSystemGrid({
  initialCenterItem,
  entranceAnimation = false,
  scrollProgress = 0,
  logoBounds,
  initialScrollValue
}: DesignSystemProps = {}) {
  const {
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
    getEntrancePosition,
    getEntranceScale,
    getEntranceOpacity,
    getBoxShadow,
    getLogoInitialPosition,
    getPositionOffset,
    setHoveredItem
  } = useDesignSystem({
    initialCenterItem,
    entranceAnimation,
    scrollProgress,
    logoBounds,
    initialScrollValue
  })

  const items = getDesignSystemItems()
  
  // Get grid positions for each item
  const getGridPosition = (itemId: string) => {
    switch (itemId) {
      case "framework":
        return "col-start-1 col-end-2 row-start-1 row-end-2";
      case "voice":
        return "col-start-2 col-end-3 row-start-1 row-end-2";
      case "typography":
        return "col-start-3 col-end-4 row-start-1 row-end-2";
      case "color":
        return "col-start-1 col-end-2 row-start-2 row-end-3";
      case "logo": // Center item
        return "col-start-2 col-end-3 row-start-2 row-end-3";
      case "iconography":
        return "col-start-3 col-end-4 row-start-2 row-end-3";
      case "imagery":
        return "col-start-1 col-end-2 row-start-3 row-end-4";
      case "motion":
        return "col-start-2 col-end-3 row-start-3 row-end-4";
      case "accessibility": // Bottom-right item
        return "col-start-3 col-end-4 row-start-3 row-end-4";
      default:
        return "";
    }
  }

  return (
    <div
      className="w-full h-screen bg-white flex items-center justify-center overflow-hidden"
      ref={containerRef}
      onWheel={handleWheel}
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
        {items.map((item) => (
          <DesignSystemItem
            key={item.id}
            item={item}
            isCenter={item.id === centerItem}
            isExpanded={expandedItem === item.id}
            isHovered={hoveredItem === item.id}
            getExpansionScale={getExpansionScale}
            getItemOpacity={getItemOpacity}
            getItemSize={getItemSize}
            getZIndex={getZIndex}
            getEntrancePosition={getEntrancePosition}
            getEntranceScale={getEntranceScale}
            getEntranceOpacity={getEntranceOpacity}
            getBoxShadow={getBoxShadow}
            getLogoInitialPosition={getLogoInitialPosition}
            getPositionOffset={getPositionOffset}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(item.id)}
            gridPosition={getGridPosition(item.id)}
            scrollAmount={scrollAmount}
            entranceAnimation={entranceAnimation}
            hasInitialized={hasInitialized}
            isExpanding={isExpanding}
            centerItem={centerItem}
          />
        ))}
      </div>
    </div>
  )
} 