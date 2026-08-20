import { TrendingUp, MapPin, Truck } from 'lucide-react';

/**
 * LiveLoadTicker — an infinite horizontal-scrolling strip of "sample loads."
 *
 * The intent is to convey *activity* — that Rai is actively moving freight —
 * without making any unverifiable real-time claim. The strip is labeled
 * "Sample loads" at every breakpoint and the rates shown are realistic
 * mid-market values for each lane. We are NOT claiming these are live broker
 * offers; we are showing the kind of result a driver should expect.
 *
 * Implementation:
 *   - Pure CSS marquee (see `.marquee-track` / `.marquee-region` in
 *     globals.css): one track holding two copies of the loads, translated
 *     from 0 → -50% per loop. Because the second copy starts exactly where
 *     the first ends (the track's trailing padding mirrors the inter-copy
 *     gap), the loop is seamless — the eye never catches a "snap" point.
 *   - `.marquee-region:hover` / `:focus-within` pauses the animation so
 *     users can actually read a card, and the global
 *     `prefers-reduced-motion` rule disables the animation entirely.
 *   - All sample data is deterministic (no Math.random()) so SSR matches
 *     the client.
 *   - The labeled wrapper carries role="marquee" + aria-label; the second
 *     copy is aria-hidden and individual cards are presentational, so
 *     screen readers hear one concise, honestly-labeled strip rather than
 *     a list of actionable items.
 */

const SAMPLE_LOADS = [
  { origin: 'Dallas, TX', dest: 'Atlanta, GA', miles: 875, rate: '$2,450', equipment: 'Dry Van' },
  { origin: 'Chicago, IL', dest: 'Denver, CO', miles: 1003, rate: '$2,890', equipment: 'Reefer' },
  { origin: 'Los Angeles, CA', dest: 'Phoenix, AZ', miles: 372, rate: '$1,180', equipment: 'Flatbed' },
  { origin: 'Houston, TX', dest: 'Memphis, TN', miles: 567, rate: '$1,620', equipment: 'Dry Van' },
  { origin: 'Miami, FL', dest: 'Charlotte, NC', miles: 727, rate: '$2,100', equipment: 'Box Truck' },
  { origin: 'Seattle, WA', dest: 'Salt Lake City, UT', miles: 832, rate: '$2,340', equipment: 'Reefer' },
  { origin: 'Newark, NJ', dest: 'Columbus, OH', miles: 537, rate: '$1,540', equipment: 'Dry Van' },
  { origin: 'Detroit, MI', dest: 'Nashville, TN', miles: 530, rate: '$1,490', equipment: 'Flatbed' },
];

export default function LiveLoadTicker() {
  return (
    <div
      className="marquee-region bg-navy-950 py-4 border-y border-white/10"
      role="marquee"
      aria-label="Sample dispatched loads"
    >
      {/* Mobile: compact disclosure badge sits above the strip so small
          screens still see the "sample" framing without covering cards. */}
      <div className="md:hidden px-4 pb-3">
        <SampleBadge />
      </div>

      <div className="relative overflow-hidden">
        {/* Desktop: disclosure badge overlaps the strip's left edge. */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 hidden md:block">
          <SampleBadge />
        </div>

        {/* Functional fade masks on left/right edges so cards fade in/out smoothly */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-navy-950 to-transparent z-[5] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-navy-950 to-transparent z-[5] pointer-events-none" />

        {/* Marquee track: two copies of the loads; `pr-3` mirrors the gap so
            the -50% translation lands exactly on the second copy's start. */}
        <div className="marquee-track flex w-max gap-3 pr-3">
          <div className="flex gap-3 shrink-0">
            {SAMPLE_LOADS.map((load, idx) => (
              <LoadCard key={`a-${idx}`} load={load} />
            ))}
          </div>
          {/* Duplicate copy needed for the seamless loop — hidden from
              screen readers so content isn't announced twice. */}
          <div className="flex gap-3 shrink-0" aria-hidden="true">
            {SAMPLE_LOADS.map((load, idx) => (
              <LoadCard key={`b-${idx}`} load={load} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SampleBadge() {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-navy-950 rounded-md border border-white/10">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
      </span>
      <span className="font-display text-[11px] font-bold text-white/80 uppercase tracking-wider">
        Sample loads
      </span>
    </span>
  );
}

function LoadCard({ load }: { load: (typeof SAMPLE_LOADS)[number] }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 bg-navy-900 rounded-md border border-white/10 whitespace-nowrap"
      role="presentation"
    >
      <div className="flex items-center gap-1.5 text-white/80 text-sm">
        <MapPin className="w-3.5 h-3.5 text-primary-500" />
        <span className="font-medium">{load.origin}</span>
        <span className="text-white/30 mx-0.5">→</span>
        <span className="font-medium">{load.dest}</span>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-white/50 text-xs border-l border-white/10 pl-3">
        <Truck className="w-3 h-3" />
        <span>{load.equipment}</span>
      </div>
      <div className="hidden md:block text-white/50 text-xs border-l border-white/10 pl-3">
        {load.miles} mi
      </div>
      <div className="flex items-center gap-1 text-green-400 font-bold text-sm border-l border-white/10 pl-3">
        <TrendingUp className="w-3 h-3" />
        <span>{load.rate}</span>
      </div>
    </div>
  );
}
