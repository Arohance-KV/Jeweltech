import React from "react";
import { FiInstagram, FiFacebook, FiPhone, FiMail } from "react-icons/fi";

// Constants
const CURRENT_YEAR = new Date().getFullYear();
const PHONE_NUMBER = "+91 98765 43210";
const EMAIL = "support@rpjtw.com";
const BRAND_NAME = "RP-JTW";

const BRAND_DESCRIPTION = 
  "Premium Jewellery Collection crafted with precision and passion. We deliver elegance, trust, and timeless designs.";

const QUICK_LINKS = [
  { label: "Catalog", href: "#" },
  { label: "Categories", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Contact", href: "#" },
];

// Reusable Components
const BrandSection = () => (
  <div className="text-center lg:text-left">
    <h2 className="text-xl sm:text-2xl lg:text-2xl font-semibold tracking-wider text-[#8a4d55]">
      {BRAND_NAME}
    </h2>
    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#8a4d55]/80 leading-relaxed max-w-xs mx-auto lg:mx-0">
      {BRAND_DESCRIPTION}
    </p>
  </div>
);

const QuickLinksSection = () => (
  <div className="text-center lg:text-left">
    <h3 className="text-lg sm:text-xl lg:text-xl font-semibold mb-3 sm:mb-4 text-[#8a4d55]">
      Quick Links
    </h3>
    <ul className="space-y-2 text-[#8a4d55]/90 text-sm sm:text-base">
      {QUICK_LINKS.map((link, idx) => (
        <li key={idx} className="hover:text-[#8a4d55] cursor-pointer transition-colors duration-200">
          {link.label}
        </li>
      ))}
    </ul>
  </div>
);

const ContactSection = () => (
  <div className="text-center lg:text-left">
    <h3 className="text-lg sm:text-xl lg:text-xl font-semibold mb-3 sm:mb-4 text-[#8a4d55]">
      Contact
    </h3>
    <div className="space-y-3 sm:space-y-4 text-[#8a4d55]/90 text-sm sm:text-base">
      <p className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 hover:text-[#8a4d55] cursor-pointer transition-colors duration-200">
        <FiPhone className="text-base sm:text-lg shrink-0" /> 
        <span>{PHONE_NUMBER}</span>
      </p>
      <p className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 hover:text-[#8a4d55] cursor-pointer transition-colors duration-200">
        <FiMail className="text-base sm:text-lg shrink-0" /> 
        <span>{EMAIL}</span>
      </p>
      <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-5 mt-4 sm:mt-5">
        <a 
          href="#" 
          className="text-base sm:text-lg cursor-pointer hover:opacity-60 transition-opacity duration-200 flex shrink-0"
          aria-label="Instagram"
        >
          <FiInstagram />
        </a>
        <a 
          href="#" 
          className="text-base sm:text-lg cursor-pointer hover:opacity-60 transition-opacity duration-200 flex shrink-0"
          aria-label="Facebook"
        >
          <FiFacebook />
        </a>
      </div>
    </div>
  </div>
);

const CopyrightSection = () => (
  <div className="text-center text-[#8a4d55]/70 text-xs sm:text-sm">
    © {CURRENT_YEAR} {BRAND_NAME}. All Rights Reserved.
  </div>
);

// Main Footer Component
const Footer = () => {
  return (
    <footer className="w-full bg-[#f5d3cd]/60 backdrop-blur-md py-8 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-10 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand Section - Full width on mobile, spans 1 column on desktop */}
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandSection />
          </div>
          
          {/* Quick Links - Centered on mobile, left on desktop */}
          <div>
            <QuickLinksSection />
          </div>
          
          {/* Contact Section - Centered on mobile, left on desktop */}
          <div>
            <ContactSection />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#c7928e]/40 my-8 sm:my-10 lg:my-12"></div>

        {/* Bottom Section */}
        <CopyrightSection />
      </div>
    </footer>
  );
};

export default Footer;