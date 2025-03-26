import HeroSection from '@/components/hero-section'
import WeddingDetails from '@/components/wedding-details'
import RsvpForm from '@/components/rsvp-form'
import Gallery from '@/components/gallery'
import FloatingElements from '@/components/floating-elements'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 to-blue-100">
      <FloatingElements />
      <HeroSection />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <WeddingDetails />

        <section id="rsvp" className="my-20 scroll-mt-16">
          <h2 className="mb-8 text-center font-serif text-3xl font-medium text-emerald-800 md:text-4xl">
            Join Our Celebration
          </h2>
          <div className="mx-auto max-w-2xl">
            <RsvpForm />
          </div>
        </section>

        <section id="gallery" className="my-20 scroll-mt-16">
          <h2 className="mb-8 text-center font-serif text-3xl font-medium text-emerald-800 md:text-4xl">
            Our Journey
          </h2>
          <Gallery />
        </section>

        <footer className="mt-20 border-t border-emerald-200 py-8 text-center text-emerald-700">
          <p className="mb-2 font-serif italic">
            "To see with eyes unclouded by hate."
          </p>
          <p className="text-sm">
            © {new Date().getFullYear()} • Designed with love
          </p>
        </footer>
      </div>
    </main>
  )
}
