import React, { useState } from "react";
import OTPModal from "../Components/OTPModal.jsx";
import UserFormModal from "../Components/UserFormModal.jsx";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [openOTP, setOpenOTP] = useState(false);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="./assets/BgVideo.mov"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-white text-4xl md:text-6xl font-semibold drop-shadow-xl animate-fadeIn">
          Discover Elegant Jewellery
        </h1>

        <p className="text-white/90 max-w-2xl mt-4 md:text-lg text-sm animate-fadeIn animation-delay-300">
          Explore our premium handcrafted jewellery collection—where luxury meets timeless
          craftsmanship. Shine with elegance every day.
        </p>

        {/* See Products Button */}
        <button
          onClick={() => setOpenOTP(true)}
          className="mt-8 px-8 py-3 bg-[#eac1bb]/80 text-[#8a4d55] 
          rounded-full text-lg font-medium backdrop-blur-lg hover:bg-[#eac1bb] 
          transition-all duration-300 shadow-lg animate-fadeIn animation-delay-500"
        >
          See Products
        </button>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={openOTP}
        onClose={() => setOpenOTP(false)}
        onOtpVerified={(phone) => {
          setVerifiedPhone(phone);   // store the verified number
          setOpenOTP(false);         // close OTP modal
          setOpenUserForm(true);     // open profile modal
        }}
      />

      {/* UserForm Modal */}
      <UserFormModal
        isOpen={openUserForm}
        onClose={() => setOpenUserForm(false)}
        phone={verifiedPhone}       // pass verified phone
        onSuccess={() => {
          setOpenUserForm(false);
          navigate("/product");     // redirect after profile form submit
        }}
      />

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 1s ease forwards;
        }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }

        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
