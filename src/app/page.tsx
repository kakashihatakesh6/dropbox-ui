import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-24 h-24 mx-auto mb-6">
          <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
            <path d="M63.246 0L0 41.625l43.766 35.22 64.764-39.812-45.284-37.033zm129.728 0L147.69 37.033l64.762 39.812 43.768-35.22L193.735 0h-.761zm-129.728 115.6L0 74.336l43.766-35.033 64.764 39.626-45.284 36.672zm129.728 0L147.69 73.93l64.762-39.626 43.768 35.032-63.52 41.264zm-65.202 42.627l-45.046-36.848-45.285 36.848 45.285 37.22 45.046-37.22z" fill="#0061FF" />
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#0061FF]">
          Dropbox Brand System
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-gray-600">
          Experience our interactive scroll animation that transforms from the Dropbox interface
          to our comprehensive design system.
        </p>
        
        <Link
          href="/brand-transition"
          className="inline-block bg-[#0061FF] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0052DB] transition-colors"
        >
          Start Experience
        </Link>
      </div>
    </main>
  );
} 