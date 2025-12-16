import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, logout } from "../Slices/userSlice";
import { useNavigate } from "react-router-dom";
import { FiClock, FiCheck, FiRefreshCw, FiPackage, FiLogOut } from "react-icons/fi";

// Status Configuration
const STATUS_CONFIG = {
  pending_details: {
    pending: {
      label: "Pending Approval",
      badgeBg: "bg-yellow-100",
      badgeText: "text-yellow-800",
      borderColor: "border-yellow-300",
      icon: <FiClock className="text-lg" />,
    },
  },
  pending: {
    label: "Pending Approval",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
    borderColor: "border-yellow-300",
    icon: <FiClock className="text-lg" />,
  },
  active: {
    label: "Approved",
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
    borderColor: "border-green-300",
    icon: <FiCheck className="text-lg" />,
  },
  approved: {
    label: "Approved",
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
    borderColor: "border-green-300",
    icon: <FiCheck className="text-lg" />,
  },
};

const DEFAULT_STATUS = {
  label: "Unknown",
  badgeBg: "bg-gray-100",
  badgeText: "text-gray-800",
  borderColor: "border-gray-300",
  icon: <FiClock className="text-lg" />,
};

// Reusable Components
const ProfileField = ({ label, value }) => (
  <div>
    <p className="text-[#8a4d55]/70 text-xs sm:text-sm mb-1">{label}</p>
    <p className="text-lg sm:text-xl text-[#8a4d55] font-semibold wrap-break-word">
      {value}
    </p>
  </div>
);

const ProfileRow = ({ children, className = "" }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 ${className}`}>
    {children}
  </div>
);

const ActionButton = ({ icon: Icon, label, onClick, disabled = false, variant = "blue" }) => {
  const variants = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70",
    red: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-3 sm:py-3 text-white rounded-full text-sm sm:text-base lg:text-lg font-semibold shadow-md transition active:scale-95 flex items-center justify-center gap-2 ${variants[variant]}`}
    >
      <Icon className="text-lg" />
      {label}
    </button>
  );
};

const LoadingSkeleton = () => (
  <div className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 max-w-4xl mx-auto">
    <div className="text-center sm:text-left mb-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#8a4d55]">
        Profile Information
      </h1>
    </div>

    <div className="flex justify-center sm:justify-end mb-6 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-full w-32"></div>
    </div>

    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200 mb-6 animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-11 sm:h-12 bg-gray-200 rounded-full"></div>
      ))}
    </div>
  </div>
);

// Main Component
const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userStatus, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  const handleRefresh = () => {
    dispatch(fetchProfile());
  };

  const handleViewProducts = () => {
    navigate("/product");
  };

  const isApproved = userStatus === "active" || userStatus === "approved";
  const statusConfig = STATUS_CONFIG[userStatus] || DEFAULT_STATUS;

  if (loading) return <LoadingSkeleton />;

  if (!user) {
    return (
      <div className="pt-20 sm:pt-24 md:pt-28 px-4 text-center text-[#8a4d55] text-lg sm:text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="text-center sm:text-left mb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#8a4d55]">
          Profile Information
        </h1>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center sm:justify-end mb-6">
        <div
          className={`px-3 sm:px-4 py-2 rounded-full ${statusConfig.badgeBg} ${statusConfig.badgeText} font-semibold text-xs sm:text-sm whitespace-nowrap flex items-center gap-2`}
        >
          {statusConfig.icon}
          <span>{statusConfig.label}</span>
        </div>
      </div>

      

      {/* Profile Card */}
      <div className={`bg-white shadow-lg rounded-xl p-4 sm:p-6 border ${statusConfig.borderColor} mb-6`}>
        {/* Row 1 - First & Last Name */}
        <ProfileRow>
          <ProfileField label="First Name" value={user.firstName} />
          <ProfileField label="Last Name" value={user.lastName} />
        </ProfileRow>

        {/* Row 2 - Business Name */}
        <div className="mb-4 sm:mb-6">
          <ProfileField label="Business Name" value={user.buisnessName} />
        </div>

        {/* GST Number (Optional) */}
        {user.gstNumber && (
          <div className="mb-4 sm:mb-6">
            <ProfileField label="GST Number" value={user.gstNumber} />
          </div>
        )}

        {/* Row 3 - Phone & City */}
        <ProfileRow>
          <ProfileField label="Phone Number" value={user.phoneNumber || user.phone} />
          <ProfileField label="City" value={user.city} />
        </ProfileRow>

        {/* Row 4 - State */}
        <div>
          <ProfileField label="State" value={user.state} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <ActionButton
          icon={FiRefreshCw}
          label="Refresh Status"
          onClick={handleRefresh}
          variant="blue"
        />
        <ActionButton
          icon={FiPackage}
          label="View Products"
          onClick={handleViewProducts}
          disabled={!isApproved}
          variant="green"
        />
        <ActionButton
          icon={FiLogOut}
          label="Logout"
          onClick={handleLogout}
          variant="red"
        />
      </div>
    </div>
  );
};

export default ProfilePage;