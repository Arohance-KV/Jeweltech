import React, { useState } from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OTPModal from "../Components/OTPModal.jsx";
import UserFormModal from "../Components/UserFormModal.jsx";
import { fetchProfile } from "../Slices/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart items directly from Redux store
  const cartItems = useSelector((state) => state.cart.items || []);
  const { userStatus } = useSelector((state) => state.user);
  const accessToken = localStorage.getItem("accessToken");

  // Calculate cart count from Redux cart items
  const count = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Modal states
  const [openOTP, setOpenOTP] = useState(false);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [verifiedData, setVerifiedData] = useState({
    isdCode: "",
    phone: "",
    accessToken: null,
    userStatus: null,
  });

  const handleProfileClick = () => {
    if (userStatus === "active" || userStatus === "approved") {
      // User already approved - go directly to profile
      navigate("/profile");
    } else if (accessToken && userStatus) {
      // User has token and profile fetch completed - check status
      if (userStatus === "pending" || userStatus === "pending_details") {
        navigate("/profile");
      } else {
        navigate("/profile");
      }
    } else if (accessToken) {
      // Token exists but profile still loading - fetch it
      dispatch(fetchProfile());
      navigate("/profile");
    } else {
      // New user - show OTP modal
      setOpenOTP(true);
    }
  };

  return (
    <div className="w-full flex justify-center pt-6 px-4 fixed top-0 left-0 z-50">
      <div
        className="w-full max-w-6xl h-16 bg-[#eac1bb]/70 
        backdrop-blur-xl rounded-full shadow-lg 
        flex items-center justify-between px-6 relative"
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-[#8a4d55] font-semibold text-xl tracking-wider cursor-pointer"
        >
          RP-JTW
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-6 text-[#8a4d55] text-2xl relative">
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="cursor-pointer hover:opacity-70 transition" />

            {count > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-500 text-white 
                text-xs w-5 h-5 flex items-center justify-center rounded-full shadow"
              >
                {count}
              </span>
            )}
          </Link>

          {/* Profile Icon - With Auth Logic */}
          <FiUser
            className="cursor-pointer hover:opacity-70 transition"
            onClick={handleProfileClick}
          />
        </div>
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
            // User already approved - go directly to profile immediately
            navigate("/profile");
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
              ⏳ Pending Approval
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
    </div>
  );
};

export default Navbar;