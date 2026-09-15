"use client";

import { MapPin, Navigation, Plane, Train, Car, Info } from "lucide-react";

export default function MapSection() {
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15647.568461740924!2d76.0152431!3d11.3364402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6415ef41cdbb7%3A0xa6ebbbad7f6e0766!2sSt.%20Sebastian's%20Church%2C%20Koodaranji!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  const googleMapsDirections =
    "https://www.google.com/maps/dir/?api=1&destination=St.+Sebastian's+Church,+Koodaranji";
  const appleMapsDirections =
    "http://maps.apple.com/?daddr=St.+Sebastian's+Church,+Koodaranji";

  return (
    <section id="location" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-300/40 text-xs font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-widest">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>Location & Directions</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          St. Sebastian's Church, Koodaranji
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base font-light">
          Find your way to our wedding venue nestled in the beautiful hills of Koodaranji.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Map Iframe Embed */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden glass-card border border-amber-300/40 shadow-xl min-h-[380px] relative">
          <iframe
            title="St. Sebastian's Church Koodaranji Location Map"
            src={mapEmbedUrl}
            className="w-full h-full min-h-[380px] border-0 filter opacity-90 hover:opacity-100 transition-opacity"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Venue Info & Navigation CTAs */}
        <div className="p-8 rounded-3xl glass-card border border-amber-300/40 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Navigation className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-foreground">
              Getting Here
            </h3>

            <div className="space-y-3 text-xs text-muted-foreground font-light">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground font-semibold">Address:</strong> St. Sebastian's Church, Koodaranji P.O., Kozhikode District, Kerala 673604
                </span>
              </p>

              <div className="pt-2 border-t border-border space-y-2">
                <p className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                  <Plane className="w-3.5 h-3.5 text-rose-500" />
                  Nearest Airport:
                </p>
                <p className="pl-5">Calicut International Airport (CCJ) ~ 42 km</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                  <Train className="w-3.5 h-3.5 text-amber-600" />
                  Nearest Railway Station:
                </p>
                <p className="pl-5">Kozhikode Main Railway Station (CLT) ~ 38 km</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <a
              href={googleMapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Google Maps</span>
            </a>

            <a
              href={appleMapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl glass border border-amber-300/40 text-foreground font-semibold text-xs hover:bg-amber-100/30 transition-all flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4 text-rose-500" />
              <span>Open Apple Maps</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
