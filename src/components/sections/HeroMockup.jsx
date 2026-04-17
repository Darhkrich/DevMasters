
import './Heromockup.css';

import Image from "next/image";

export default function HeroMockup() {
  return (
    <div className="hm-mockup-wrapper">
      {/* Glowing abstract background shape */}
      <div className="hm-mockup-glow"></div>
      
      {/* Device Stack */}
      <div className="hm-mockup-stack">
        {/* Desktop Monitor (Back Layer) */}
        <div className="hm-mockup hm-mockup-desktop">
          <Image
            src="/desktopnew.png"
            alt="Desktop Preview"
            width={1200}
            height={820}
            priority
            className="hm-mockup-img"
          />
        </div>
        
        {/* Tablet (Middle Layer) – overlapping monitor's lower-right */}
        <div className="hm-mockup hm-mockup-tablet">
          <Image
            src="/download.jpg"
            alt="Tablet Preview"
            width={720}
            height={900}
            className="hm-mockup-img"
          />
        </div>
        
        {/* Phone (Front Layer) – overlapping tablet, slightly in front */}
        <div className="hm-mockup hm-mockup-mobile">
          <Image
            src="/m1.jpg"
            alt="Mobile Preview"
            width={480}
            height={960}
            className="hm-mockup-img"
          />
        </div>
      </div>
    </div>
  );
}