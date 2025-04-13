import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-md mx-auto px-4 py-6 font-light text-center">
        <div className="mb-6 px-2 py-1 border border-black rounded-3xl text-sm uppercase inline-block bg-white">
          About
        </div>
        <p className="mb-6">
          In a world that moves fast and forgets faster, this is a space to
          remember.
        </p>
        <p className="mb-6">
          A visual archive for the things you love: the ones you carry, wear,
          hold, and live with.
        </p>
        <p className="mb-6">
          Here, you can upload photos of your belongings, write notes, and
          revisit the everyday objects that shape you. With each entry, you
          record small fragments of shared life, creating a visual collection of
          memory.
        </p>
        <p className="mb-6">
          See what stays close, what begins to fade, and where your things have
          been along the way.
        </p>
        <p className="mb-6">To be loved is to be changed.</p>
        <p className="mb-10">
          How have you changed your things — and now have your things changed
          you?
        </p>
        <div className="mt-10">
          <img src="/logo.svg" alt="Logo" className="w-16 mx-auto rounded-sm" />
        </div>
      </main>
    </div>
  );
}
