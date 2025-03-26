"use client"

import { useEffect, useRef, useState } from "react"
import { Lock, DropletIcon as Dropbox } from "lucide-react"

export default function DesignSystemNew() {
    const [scrollPosition, setScrollPosition] = useState(0)
    const colorBoxRef = useRef<HTMLDivElement>(null)
    const initialColorBoxSize = useRef({ width: 0, height: 0 })

    useEffect(() => {
        if (colorBoxRef.current) {
            initialColorBoxSize.current = {
                width: colorBoxRef.current.offsetWidth,
                height: colorBoxRef.current.offsetHeight,
            }
        }

        const handleScroll = () => {
            setScrollPosition(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Calculate expansion factor based on scroll position
    const expansionFactor = Math.min(1 + scrollPosition / 500, 1.5)

    return (
        <div className="min-h-screen w-full bg-white p-4">

            <div className="flex space-x-2">

                <div className="flex flex-col space-y-2 py-3 w-1/4 h-screen">
                    {/* Framework - Dark Blue */}
                    <div className=" bg-[#2c3e50] p-6 rounded-md flex h-full flex-col justify-between">
                        <h2 className="text-white text-3xl font-light">Framework</h2>
                        <div className="relative ml-40 h-40">
                            <div className="absolute w-3 h-3 bg-white rounded-full top-0 left-0"></div>
                            <div className="absolute w-3 h-3 bg-white rounded-full bottom-0 left-0"></div>
                            <div className="absolute w-3 h-3 bg-white rounded-full top-1/2 right-1/4 transform -translate-y-1/2"></div>
                            <div className="absolute w-[1px] h-[120px] bg-white top-0 left-[6px] rotate-[30deg] origin-top"></div>
                            <div className="absolute w-[1px] h-[120px] bg-white bottom-0 left-[6px] rotate-[-30deg] origin-bottom"></div>
                        </div>
                    </div>

                    {/* Voice & Tone - Yellow */}
                    <div className="bg-[#f1c40f] p-8 my-4 rounded-md flex h-full flex-col justify-between">
                        <h2 className="text-[#8B5A00] text-3xl font-light">Voice & Tone</h2>
                        <div className="flex justify-between">
                            <span className="text-[#8B5A00] text-8xl"></span>
                            <span className="text-[#8B5A00] text-8xl"></span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center py-4 w-1/2 h-screen">

                    <div className="flex w-full h-full space-x-3">
                        {/* Logo - Light Blue */}
                        <div className="bg-[#5cceee] p-8 w-2/5 rounded-md flex flex-col justify-between">
                            <h2 className="text-[#2c3e50] text-3xl font-light">Logo</h2>
                            <div className="flex justify-center items-center h-40">
                                <Dropbox className="w-20 h-20 text-[#2c3e50]" />
                            </div>
                        </div>
                        {/* Typography - Orange-Red */}
                        <div className="bg-[#e74c3c] p-8 w-3/5 rounded-md flex flex-col justify-between">
                            <h2 className="text-[#2c3e50] text-3xl font-light">Typography</h2>
                            <div className="flex justify-center items-center h-40">
                                <span className="text-[#2c3e50] text-8xl font-bold">Aa</span>
                            </div>
                        </div>

                    </div>

                    {/* Dropbox Small Logo - Blue */}
                    <div className="flex h-16 w-16 items-center bg-[#3498db] p-2 rounded-md justify-center">
                        <Dropbox className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex w-full h-full space-x-3">
                        {/* Color - Orange (Expandable) */}
                        <div
                            ref={colorBoxRef}
                            className=" bg-[#f39c12] p-8 rounded-md flex w-2/5 flex-col justify-between transition-all duration-300 ease-in-out"
                            style={{
                                transform: `scale(${expansionFactor})`,
                                transformOrigin: "center",
                                zIndex: scrollPosition > 50 ? 10 : 0,
                            }}
                        >
                            <h2 className="text-[#2c3e50] text-3xl font-light">Color</h2>
                            <div className="flex items-center justify-center h-full">
                                <div className="relative">
                                    <div className="absolute w-16 h-16 bg-[#8B5A00] rounded-md top-0 left-0"></div>
                                    <div className="absolute w-16 h-16 bg-[#8B5A00] rounded-md top-16 left-16 opacity-80"></div>
                                </div>
                            </div>
                        </div>
                        {/* Iconography - Green */}
                        <div className="bg-[#a4de02] p-8 rounded-md flex w-3/5 flex-col justify-between">
                            <h2 className="text-[#2c3e50] text-3xl font-light">Iconography</h2>
                            <div className="flex justify-center items-center h-40">
                                <Lock className="w-20 h-20 text-[#2c3e50]" />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col space-y-2 py-3 w-1/4 h-screen">
                    {/* Imagery - Burgundy */}
                    <div className="bg-[#9b2c5e] p-6 rounded-md flex flex-col justify-between">
                        <h2 className="text-[#f8d0c8] text-3xl font-light">Imagery</h2>
                        <div className="flex justify-end items-center h-40 pr-6">
                            <div className="w-32 h-32 bg-[#ffb6c1] rounded-md relative">
                                <div className="absolute w-4 h-4 bg-[#e84393] rounded-full top-4 left-4"></div>
                                <div
                                    className="absolute h-16 bg-[#e84393] rounded-full bottom-0 left-0 right-0"
                                    style={{
                                        borderTopLeftRadius: "50px",
                                        borderTopRightRadius: "50px",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Motion - Light Purple */}
                    <div className="bg-[#d2b4de] p-6 rounded-md flex flex-col justify-between">
                        <h2 className="text-[#2c3e50] text-3xl font-light">Motion</h2>
                        <div className="relative h-40">
                            <div className="absolute w-3 h-3 bg-[#6c3483] rounded-full top-0 right-0"></div>
                            <div className="absolute w-3 h-3 bg-[#6c3483] rounded-full top-0 left-0"></div>
                            <div className="absolute w-3 h-3 bg-[#6c3483] rounded-full bottom-0 left-0"></div>
                            <div className="absolute w-[1px] h-[40px] bg-[#6c3483] top-[1.5px] right-[1.5px]"></div>
                            <div className="absolute w-[120px] h-[1px] bg-[#6c3483] top-[1.5px] left-[1.5px]"></div>
                            <div className="absolute w-[120px] h-[1px] bg-[#6c3483] bottom-[1.5px] left-[1.5px]"></div>
                            <div className="absolute w-[120px] h-[80px] border-[1px] border-[#6c3483] border-t-0 border-l-0 bottom-[40px] left-[1.5px] rounded-br-full"></div>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    )
}

