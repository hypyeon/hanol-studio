import React, { useState } from 'react';
import { businessHours, contactSections } from '../data/contact';
import ScrollTransition from '../components/ScrollTransition';
import { Files, Mail, MessagesSquare } from 'lucide-react';
import GoogleMapComponent from '../components/Map';
import CopyableText from '../components/CopyableText';
import { motion } from 'framer-motion';
import Toggle from '../components/Toggle';

export default function Contact() {
  const tabs = ['location', 'contact'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // DELETE THIS ONCE UP AND RUNNING
  const DemoNotice = ({ text }) => (
    <p className="text-[11px] italic opacity-60 font-sans tracking-wide mb-6 text-hanol-red/80">
      * {text}
    </p>
  );
  // DELETE ^ ONCE UP AND RUNNING
  
  return (
    <main className="h-dvh md:portrait:min-h-full landscape:h-lvh pt-26 landscape:pt-36 md:portrait:pt-40 pb-24 px-8 md:px-16 landscape:max-w-7xl mx-auto flex flex-col landscape:flex-row landscape:gap-16 md:portrait:justify-center md:portrait:gap-24 md:items-start md:justify-center">
      <ScrollTransition />
      
      <Toggle 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        portrait={"md:portrait:hidden"}
      />

      <section className={`${activeTab === 'location' ? 'block' : 'hidden'} w-full landscape:w-2/5 space-y-8 landscape:space-y-12`}>
        <h2 className="hidden md:portrait:block landscape:block text-[10px] uppercase tracking-[0.4em] opacity-60 mb-6 border-b border-hanol-charcoal/30 pb-1.5 lg:portrait:text-[12px]">
          Business Hours
        </h2>

        {/* DELETE THIS ONCE UP AND RUNNING */}
        <DemoNotice text="This is not actual open hour info or address — demo for future opening." /> 
        {/* DELETE ^ ONCE UP AND RUNNING */}

        <div className="flex flex-col gap-4 md:portrait:flex-row justify-between">
          <div className="md:portrait:h-36 lg:portrait:h-full md:portrait:flex flex-col justify-between space-y-4 md:portrait:w-[88%] lg:portrait:w-[50%] lg:portrait:gap-12">
            <div className="space-y-1 lg:portrait:space-y-4">
              {businessHours.map((item, index) => (
                <div key={index} className="flex justify-between items-baseline text-[13.5px] sm:text-sm lg:portrait:text-[16px]">
                  <span className="opacity-90 font-primary md:tracking-wider">{item.day}</span>
                  <span className={`${item.closed ? "text-hanol-red opacity-70 font-primary" : "opacity-70 text-[11.5px] sm:text-[12px] md:text-sm lg:portrait:text-[14px]"}`}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
            <div className="hidden md:portrait:block text-right uppercase opacity-60 tracking-wider text-sm">
              <CopyableText 
                text={"11790 SW Barnes Rd, Portland, OR 97225"} />
            </div>
          </div>
          {/* DELETE DIV ONCE UP AND RUNNING */}
          <div className="pointer-events-none">
            <GoogleMapComponent />
          </div>
        </div>
      </section>
      
      <div className={`${activeTab === 'contact' ? 'block' : 'hidden'} md:block w-full landscape:w-2/5`}>
        <h2 className="hidden md:portrait:block landscape:block text-[10px] uppercase tracking-[0.4em] opacity-60 mb-6 border-b border-hanol-charcoal/30 pb-1.5 lg:portrait:text-[12px]">
          Contact Info
        </h2>

        {/* DELETE THIS ONCE UP AND RUNNING */}
        <DemoNotice text="This is not actual contact info — only a demo for future opening." />
        {/* DELETE ^ ONCE UP AND RUNNING */}
        
        <div className="max-w-md lg:portrait:max-w-[62%]">
          <div className="leading-1 mb-8">
            <span className={`font-logo text-hanol-charcoal lowercase leading-none faked-bold tracking-[2px] mr-0.75`}>
              hanol
            </span>
            <span className="opacity-50 font-sans text-sm">
              studio is appointment-only and run by a solo artist.
              Due to the nature of services, phone calls are generally not available during business hours.
              Please use text or email below for the quickest response. 
            </span>
          </div>
          {contactSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="group mb-6">
                <h3 className="text-md font-primary mb-1 font-medium flex items-center-safe">
                  {Icon && (
                    <Icon 
                      size={18} 
                      strokeWidth={1.5} 
                      className="text-hanol-red opacity-70 mr-1.5" 
                    />
                  )}
                  {section.title}
                </h3>
                {section.link ? (
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    <p className="text-sm leading-relaxed opacity-50 font-sans">
                      {section.content}
                    </p>
                    <a href={section.link} className="inline-block text-sm tracking-[2px] transition-all duration-300 font-primary underline underline-offset-2 decoration-dotted">
                      {section.linkText}
                    </a>
                    <p className="text-sm leading-relaxed opacity-50 font-sans">
                      {section.content2}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed opacity-50 font-sans">
                    {section.content}
                  </p>
                )}
              </div>
            )
          })}
          <div className="flex justify-between -mt-2">
            {/* DELETE "CURSER-NOT-ALLOWED" ONCE UP AND RUNNING,
            CHANGE DIV TO A TAG */}
            <div 
              href="mailto:hanolstudio.or@gmail.com"
              aria-disabled
              className="cursor-not-allowed border rounded-xl border-hanol-charcoal/40 px-4 landscape:px-6 md:portrait:px-6 py-3 font-primary text-[14px] w-[48%] text-center flex justify-between lg:portrait:justify-center items-center leading-tight text-hanol-charcoal/70 tracking-wider"
            >
              <span className="min-w-[22%] lg:portrait:min-w-[18%]">
                <Mail
                  strokeWidth={1.5}
                  className="m-auto text-hanol-charcoal/50 w-4 landscape:w-5"
                />
              </span>
              <span>Pre-booking Consultation</span>
            </div>
            {/* DELETE "CURSER-NOT-ALLOWED" ONCE UP AND RUNNING,
            CHANGE DIV TO A TAG */}
            <div 
              href="sms:3095584795"
              className="cursor-not-allowed border rounded-xl border-hanol-charcoal/40 px-4 landscape:px-6 md:portrait:px-6 py-3 font-primary text-[14px] w-[48%] text-center flex justify-between lg:portrait:justify-center items-center leading-tight text-hanol-charcoal/70 tracking-wider"
            >
              <span className="min-w-[22%] lg:portrait:min-w-[18%]">
                <MessagesSquare
                  strokeWidth={1.5}
                  className="m-auto text-hanol-charcoal/50 w-4 landscape:w-5"
                />
              </span>
              <span>General Inquiries</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}