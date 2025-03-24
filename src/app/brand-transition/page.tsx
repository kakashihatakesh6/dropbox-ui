import BrandTransition from "@/components/BrandTransition";

export default function BrandTransitionPage() {
  return (
    <main className="relative">
      <BrandTransition 
        scrollHeight={400}
        completionThreshold={0.85}
        fadeInRate={2.2}
        pointerEventThreshold={0.35}
      />
    </main>
  );
} 