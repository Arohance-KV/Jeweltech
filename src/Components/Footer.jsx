import React from "react";
import { FiInstagram, FiFacebook, FiPhone, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f5d3cd]/60 backdrop-blur-md py-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-[#8a4d55]">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-semibold tracking-wider">RP-JTW</h2>
            <p className="mt-3 text-sm text-[#8a4d55]/80 leading-relaxed">
              Premium Jewellery Collection crafted with precision and passion.  
              We deliver elegance, trust, and timeless designs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-[#8a4d55]/90 text-sm">
              <li className="hover:text-[#8a4d55] cursor-pointer">Catalog</li>
              <li className="hover:text-[#8a4d55] cursor-pointer">Categories</li>
              <li className="hover:text-[#8a4d55] cursor-pointer">About Us</li>
              <li className="hover:text-[#8a4d55] cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact</h3>
            <div className="space-y-3 text-[#8a4d55]/90 text-sm">
              <p className="flex items-center gap-3">
                <FiPhone className="text-lg" /> +91 98765 43210
              </p>
              <p className="flex items-center gap-3">
                <FiMail className="text-lg" /> support@rpjtw.com
              </p>
              <div className="flex items-center gap-5 mt-3">
                <FiInstagram className="text-xl cursor-pointer hover:opacity-60" />
                <FiFacebook className="text-xl cursor-pointer hover:opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#c7928e]/40 my-8"></div>

        {/* Bottom Section */}
        <div className="text-center text-[#8a4d55]/70 text-sm">
          © {new Date().getFullYear()} RP-JTW. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
