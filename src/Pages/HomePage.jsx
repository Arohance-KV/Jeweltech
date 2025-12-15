import React, { useState, useEffect, useCallback } from "react";
import OTPModal from "../Components/OTPModal.jsx";
import UserFormModal from "../Components/UserFormModal.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../Slices/userSlice";

// Constants
const USER_STATUSES = {
  ACTIVE: "active",
  APPROVED: "approved",
  PENDING_DETAILS: "pending_details",
  PENDING: "pending",
};

const APPROVAL_MESSAGES = {
  pending: "Your profile is awaiting admin approval. You'll be able to access products once approved.",
  pending_details: "Your profile has been submitted for admin approval. You'll be able to access products once approved.",
};

// Utility Functions
const isUserApproved = (status) => {
  return status === USER_STATUSES.ACTIVE || status === USER_STATUSES.APPROVED;
};

const getNavigation = (userStatus, accessToken, dispatch, setOpenOTP) => {
  if (!accessToken) {
    setOpenOTP(true);
    return;
  }

  if (!userStatus) {
    dispatch(fetchProfile());
    return;
  }

  if (isUserApproved(userStatus)) {
    return "approved";
  } else if (userStatus === USER_STATUSES.PENDING_DETAILS) {
    return "profile";
  } else if (userStatus === USER_STATUSES.PENDING) {
    return "pending";
  }
};

// Reusable Components
const HeroContent = ({ onSeeProducts }) => (
  <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white drop-shadow-xl animate-fadeIn">
      Discover Elegant Jewellery
    </h1>

    <p className="text-white/90 max-w-2xl mt-4 text-xs sm:text-sm md:text-base lg:text-lg animate-fadeIn animation-delay-300">
      Explore our premium handcrafted jewellery collection—where luxury meets timeless
      craftsmanship. Shine with elegance every day.
    </p>

    <button
      onClick={onSeeProducts}
      className="mt-8 px-6 sm:px-8 py-2 sm:py-3 bg-[#eac1bb]/80 text-[#8a4d55] rounded-full text-sm sm:text-base md:text-lg font-medium backdrop-blur-lg hover:bg-[#eac1bb] transition-all duration-300 shadow-lg animate-fadeIn animation-delay-500"
    >
      See Products
    </button>
  </div>
);

const ApprovalModal = ({ isOpen, userStatus, onGoToProfile }) => {
  if (!isOpen) return null;

  const message = APPROVAL_MESSAGES[userStatus] || APPROVAL_MESSAGES.pending;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-4 sm:py-0">
      <div className="bg-white/95 w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-[#f3d4cd]">
        <div className="mb-4">
          <div className="text-4xl sm:text-5xl mb-4">⏳</div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#8a4d55] mb-4">
            Pending Approval
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#8a4d55]/80 mb-6 leading-relaxed">
          {message}
        </p>
        <button
          onClick={onGoToProfile}
          className="w-full mt-4 py-3 bg-[#eac1bb] text-[#8a4d55] rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-[#d9a9a0] transition"
        >
          Go to Profile
        </button>
      </div>
    </div>
  );
};

const VideoBackground = () => (
  <>
    <video
      className="absolute inset-0 w-full h-full object-cover"
      src="./assets/BgVideo.mov"
      autoPlay
      loop
      muted
      playsInline
    />
    <div className="absolute inset-0 bg-black/40"></div>
  </>
);

// Main Component
const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userStatus } = useSelector((state) => state.user);
  const accessToken = localStorage.getItem("accessToken");

  const [openOTP, setOpenOTP] = useState(false);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [verifiedData, setVerifiedData] = useState({
    isdCode: "",
    phone: "",
    accessToken: null,
    userStatus: null,
  });

  // Fetch profile on mount
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchProfile());
    }
  }, [dispatch, accessToken]);

  const handleSeeProducts = useCallback(() => {
    const navigation = getNavigation(
      userStatus,
      accessToken,
      dispatch,
      setOpenOTP,
      setOpenUserForm,
      setShowApprovalModal
    );

    if (navigation === "approved") {
      navigate("/product");
    } else if (navigation === "profile") {
      navigate("/profile");
    } else if (navigation === "pending") {
      setShowApprovalModal(true);
    }
  }, [userStatus, accessToken, dispatch, navigate]);

  const handleOtpVerified = useCallback((data) => {
    setVerifiedData(data);
    setOpenOTP(false);

    if (isUserApproved(data.userStatus)) {
      navigate("/product");
    } else if (data.userStatus === USER_STATUSES.PENDING_DETAILS) {
      setOpenUserForm(true);
    } else if (data.userStatus === USER_STATUSES.PENDING) {
      setShowApprovalModal(true);
    }
  }, [navigate]);

  const handleUserFormSuccess = useCallback(() => {
    setOpenUserForm(false);
    setShowApprovalModal(true);
  }, []);

  const handleGoToProfile = useCallback(() => {
    setShowApprovalModal(false);
    navigate("/profile");
  }, [navigate]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <VideoBackground />

      {/* Hero Content */}
      <HeroContent onSeeProducts={handleSeeProducts} />

      {/* Modals */}
      <OTPModal
        isOpen={openOTP}
        onClose={() => setOpenOTP(false)}
        onOtpVerified={handleOtpVerified}
      />

      <UserFormModal
        isOpen={openUserForm}
        onClose={() => setOpenUserForm(false)}
        phone={verifiedData.phone}
        isdCode={verifiedData.isdCode}
        accessToken={verifiedData.accessToken}
        userStatus={verifiedData.userStatus}
        onSuccess={handleUserFormSuccess}
      />

      <ApprovalModal
        isOpen={showApprovalModal}
        userStatus={verifiedData.userStatus || userStatus}
        onGoToProfile={handleGoToProfile}
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