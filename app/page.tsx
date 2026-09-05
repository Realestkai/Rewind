import HeadphoneScroll from "@/components/headphone-scroll"

export default function Home() {
  return (
    <main className="relative bg-[#050505]">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10">
        {/* Logo - Left */}
        <a href="#" className="text-sm font-semibold tracking-tight text-white transition-opacity hover:opacity-70">
          {""}
        </a>

        {/* Nav Links - Center (hidden on mobile) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <a href="#" className="text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white">
            Products
          </a>
          <a href="#" className="text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white">
            Technology
          </a>
          <a href="#" className="text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white">
            About
          </a>
        </div>

        {/* CTA - Right */}
        <button className="rounded-full border border-white/20 bg-transparent px-5 py-2 text-xs font-medium text-white transition-all hover:bg-white hover:text-black">
          Pre-order
        </button>
      </nav>

      {/* Scrollytelling Section */}
      <HeadphoneScroll />

      <section className="relative z-10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
          <div className="mb-16 md:mb-20">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Technology</p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              Engineered for the most demanding ears.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 - Active Noise Cancellation */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10 hover:bg-white/[0.04]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <svg
                  className="h-6 w-6 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Active Noise Cancellation</h3>
              <p className="text-sm leading-relaxed text-white/40">
                -45dB noise reduction with adaptive algorithms that continuously analyze and neutralize ambient sound in
                real-time.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white">-45</span>
                <span className="text-sm text-white/40">dB</span>
              </div>
            </div>

            {/* Feature 2 - Planar Drivers */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10 hover:bg-white/[0.04]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <svg
                  className="h-6 w-6 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.348 14.651a3.75 3.75 0 010-5.302m5.302 0a3.75 3.75 0 010 5.302m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">40mm Planar Drivers</h3>
              <p className="text-sm leading-relaxed text-white/40">
                Ultra-thin diaphragm delivers distortion-free audio across the entire frequency range, from deep bass to
                crystal highs.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white">40</span>
                <span className="text-sm text-white/40">mm</span>
              </div>
            </div>

            {/* Feature 3 - Battery Life */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10 hover:bg-white/[0.04]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <svg
                  className="h-6 w-6 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">All-Day Battery</h3>
              <p className="text-sm leading-relaxed text-white/40">
                60 hours of continuous playback. Quick charge delivers 5 hours of listening from just 10 minutes of
                charging.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white">60</span>
                <span className="text-sm text-white/40">hours</span>
              </div>
            </div>

            {/* Feature 4 - Spatial Audio */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10 hover:bg-white/[0.04]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <svg
                  className="h-6 w-6 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Spatial Audio</h3>
              <p className="text-sm leading-relaxed text-white/40">
                Immersive 360° soundstage with dynamic head tracking. Feel every note positioned precisely in
                three-dimensional space.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white">360</span>
                <span className="text-sm text-white/40">degree</span>
              </div>
            </div>

            {/* Feature 5 - Bluetooth */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10 hover:bg-white/[0.04]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <svg
                  className="h-6 w-6 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Bluetooth 5.3</h3>
              <p className="text-sm leading-relaxed text-white/40">
                Lossless audio codec support with ultra-low latency. Seamlessly connect to multiple devices
                simultaneously.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white">5.3</span>
                <span className="text-sm text-white/40">BT version</span>
              </div>
            </div>

            {/* Feature 6 - Weight */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10 hover:bg-white/[0.04]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <svg
                  className="h-6 w-6 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Featherlight Design</h3>
              <p className="text-sm leading-relaxed text-white/40">
                Aerospace-grade titanium frame weighing just 285g. Designed for all-day comfort without compromising
                durability.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white">285</span>
                <span className="text-sm text-white/40">grams</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/5 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">The Future of Audio</p>
              <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Sound that transcends.</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/40">
                Momo X represents the pinnacle of audio engineering. Combining cutting-edge materials with decades of
                acoustic research.
              </p>
              <button className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
                Order Now — $549
              </button>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm text-white/40">Ships worldwide</p>
              <p className="mt-1 text-2xl font-semibold text-white">Spring 2026</p>
            </div>
          </div>
          <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/30">
            <span>© 2026 Momo Audio</span>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-white/60">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-white/60">
                Terms
              </a>
              <a href="#" className="transition-colors hover:text-white/60">
                Contact
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
