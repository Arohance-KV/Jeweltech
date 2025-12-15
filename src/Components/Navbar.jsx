import React, { useState, useCallback } from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OTPModal from "../Components/OTPModal.jsx";
import UserFormModal from "../Components/UserFormModal.jsx";
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

// Reusable Components
const CartBadge = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <span className="absolute -top-2 -right-3 sm:-right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow font-semibold">
      {count > 99 ? "99+" : count}
    </span>
  );
};

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

// Main Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items || []);
  const { userStatus } = useSelector((state) => state.user);
  const count = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const [openOTP, setOpenOTP] = useState(false);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [verifiedData, setVerifiedData] = useState({
    isdCode: "",
    phone: "",
    accessToken: null,
    userStatus: null,
  });

  const handleProfileClick = useCallback(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setOpenOTP(true);
    } else if (
      userStatus === USER_STATUSES.ACTIVE ||
      userStatus === USER_STATUSES.APPROVED
    ) {
      navigate("/profile");
    } else if (
      userStatus === USER_STATUSES.PENDING ||
      userStatus === USER_STATUSES.PENDING_DETAILS
    ) {
      navigate("/profile");
    } else {
      dispatch(fetchProfile());
      navigate("/profile");
    }
  }, [userStatus, navigate, dispatch]);

  const handleOtpVerified = useCallback((data) => {
    setVerifiedData(data);
    setOpenOTP(false);

    if (
      data.userStatus === USER_STATUSES.ACTIVE ||
      data.userStatus === USER_STATUSES.APPROVED
    ) {
      navigate("/profile");
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
    <div className="w-full flex justify-center pt-3 sm:pt-6 px-3 sm:px-4 fixed top-0 left-0 z-50">
      <div className="w-full max-w-6xl h-14 sm:h-16 bg-[#eac1bb]/70 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-[#8a4d55] font-semibold text-base sm:text-lg lg:text-xl tracking-wider cursor-pointer hover:opacity-80 transition"
        >
          RP-JTW
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-4 sm:gap-6 text-[#8a4d55] text-lg sm:text-2xl">
          {/* Cart Icon */}
          <Link to="/cart" className="relative hover:opacity-70 transition">
            <FiShoppingCart className="cursor-pointer" />
            <CartBadge count={count} />
          </Link>

          {/* Profile Icon */}
          <button
            onClick={handleProfileClick}
            className="hover:opacity-70 transition cursor-pointer"
            aria-label="Profile"
          >
            <FiUser />
          </button>
        </div>
      </div>

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
        verifiedData={verifiedData}
        onGoToProfile={handleGoToProfile}
      />
    </div>
  );
};

export default Navbar;