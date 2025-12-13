import React, { useState, useEffect } from "react";
import OTPModal from "../Components/OTPModal.jsx";
import UserFormModal from "../Components/UserFormModal.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../Slices/userSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userStatus } = useSelector((state) => state.user);
  const accessToken = localStorage.getItem("accessToken");

  const [openOTP, setOpenOTP] = useState(false);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [verifiedData, setVerifiedData] = useState({
    isdCode: "",
    phone: "",
    accessToken: null,
    userStatus: null,
  });
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Fetch user profile on mount to check approval status
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchProfile());
    }
  }, [dispatch, accessToken]);

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
          Explore our premium handcrafted jewellery collectionâ€"where luxury meets timeless
          craftsmanship. Shine with elegance every day.
        </p>

        {/* See Products Button */}
        <button
          onClick={() => {
            if (userStatus === "active" || userStatus === "approved") {
              // User already approved - go directly to products
              navigate("/product");
            } else if (accessToken && userStatus) {
              // User has token and profile fetch completed - check status
              if (userStatus === "pending" || userStatus === "pending_details") {
                navigate("/profile");
              } else {
                navigate("/product");
              }
            } else if (accessToken) {
              // Token exists but profile still loading - fetch it
              dispatch(fetchProfile());
            } else {
              // New user - show OTP modal
              setOpenOTP(true);
            }
          }}
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
        onOtpVerified={(data) => {
          setVerifiedData(data);
          setOpenOTP(false);
          
          // Check user status after OTP verification
          if (data.userStatus === "active" || data.userStatus === "approved") {
            // User already approved - go directly to products immediately
            navigate("/product");
          } else if (data.userStatus === "pending_details") {
            // User needs to complete profile details
            setOpenUserForm(true);
          } else if (data.userStatus === "pending") {
            // User profile submitted, awaiting admin approval
            setShowApprovalModal(true);
          }
        }}
      />

      {/* UserForm Modal */}
      <UserFormModal
        isOpen={openUserForm}
        onClose={() => setOpenUserForm(false)}
        phone={verifiedData.phone}
        isdCode={verifiedData.isdCode}
        accessToken={verifiedData.accessToken}
        userStatus={verifiedData.userStatus}
        onSuccess={() => {
          setOpenUserForm(false);
          setShowApprovalModal(true); // Show approval message
        }}
      />

      {/* Approval Pending Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/95 w-full max-w-md rounded-3xl shadow-2xl p-8 text-center border border-[#f3d4cd]">
            <h2 className="text-3xl font-semibold text-[#8a4d55] mb-4">
              â³ Pending Approval
            </h2>
            <p className="text-[#8a4d55]/80 mb-6">
              {verifiedData.userStatus === "pending"
                ? "Your profile is awaiting admin approval. You'll be able to access products once approved."
                : "Your profile has been submitted for admin approval. You'll be able to access products once approved."}
            </p>
            <button
              onClick={() => {
                setShowApprovalModal(false);
                navigate("/profile");
              }}
              className="w-full mt-4 py-3 bg-[#eac1bb] text-[#8a4d55] rounded-full text-lg shadow-md hover:bg-[#d9a9a0]"
            >
              Go to Profile
            </button>
          </div>
        </div>
      )}

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