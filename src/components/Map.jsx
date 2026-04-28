import React, { useState } from 'react';
import { Files, Check } from 'lucide-react'; 
import CopyableText from './CopyableText';

export default function GoogleMapComponent() {
  const [copied, setCopied] = useState(false);
  const address = "11790 SW Barnes Rd, Portland, OR 97225";
  const temp = "60 NW 114th Ave, Portland, OR 97229";
  const mapSrc = "https://maps.google.com/maps?q=11790%20SW%20Barnes%20Rd,%20Portland%20OR%2097225&t=&z=15&ie=UTF8&iwloc=&output=embed";  
  // Google Maps Search URL
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section>
      <div className="w-full h-80 md:portrait:h-full lg:portrait:w-full rounded-3xl md:rounded-4xl bg-hanol-charcoal/5 group relative overflow-hidden transition-all duration-700">
        <iframe
          title="Hanol Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
          className="grayscale group-hover:grayscale-0 transition-all duration-700 contrast-125 brightness-90 group-hover:brightness-100 portrait:grayscale-20"
        ></iframe>
      </div>
      <div className="flex justify-center mt-6 uppercase opacity-60 tracking-widest md:tracking-widest text-[12.5px] md:text-[13px] md:portrait:hidden">
        <CopyableText text={temp} />
      </div>
    </section>
  );
};