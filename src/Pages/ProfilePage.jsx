import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, logout } from "../Slices/userSlice";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userStatus, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch user profile when component mounts
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    // Refresh the entire page to reset all states
    window.location.href = "/";
  };

  const handleRefresh = () => {
    dispatch(fetchProfile());
  };

  const handleViewProducts = () => {
    navigate("/product");
  };

  const isApproved = userStatus === "active" || userStatus === "approved";

  const getStatusConfig = () => {
    if (userStatus === "pending_details" || userStatus === "pending") {
      return {
        label: "Pending Approval",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-300",
        badgeBg: "bg-yellow-100",
        badgeText: "text-yellow-800",
        icon: "⏳",
        bannerBg: "bg-yellow-100",
        bannerText: "text-yellow-800",
      };
    } else if (userStatus === "active" || userStatus === "approved") {
      return {
        label: "Approved",
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
        badgeBg: "bg-green-100",
        badgeText: "text-green-800",
        icon: "✓",
        bannerBg: "bg-green-100",
        bannerText: "text-green-800",
      };
    }
    return {
      label: "Unknown",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
      badgeBg: "bg-gray-100",
      badgeText: "text-gray-800",
      icon: "?",
      bannerBg: "bg-gray-100",
      bannerText: "text-gray-800",
    };
  };

  if (loading) {
    return (
      <div className="pt-28 px-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-[#8a4d55]">
            Profile Information
          </h1>
        </div>

        {/* Loading Skeleton */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 mb-6 animate-pulse">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-[#8a4d55]/70 text-sm mb-2">First Name</p>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>

            <div>
              <p className="text-[#8a4d55]/70 text-sm mb-2">Last Name</p>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="mb-4">
            <p className="text-[#8a4d55]/70 text-sm mb-2">Business Name</p>
            <div className="h-6 bg-gray-200 rounded w-40"></div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-[#8a4d55]/70 text-sm mb-2">Phone Number</p>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>

            <div>
              <p className="text-[#8a4d55]/70 text-sm mb-2">Email</p>
              <div className="h-6 bg-gray-200 rounded w-40"></div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[#8a4d55]/70 text-sm mb-2">City</p>
              <div className="h-6 bg-gray-200 rounded w-28"></div>
            </div>

            <div>
              <p className="text-[#8a4d55]/70 text-sm mb-2">State</p>
              <div className="h-6 bg-gray-200 rounded w-28"></div>
            </div>
          </div>

        </div>

        {/* Loading Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-full"></div>
          <div className="h-12 bg-gray-200 rounded-full"></div>
          <div className="h-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-28 text-center text-[#8a4d55] text-xl">
        Loading profile...
      </div>
    );
  }

  const statusConfig = getStatusConfig();

  return (
    <div className="pt-28 px-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-[#8a4d55]">
          Profile Information
        </h1>
        
        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-full ${statusConfig.badgeBg} ${statusConfig.badgeText} font-semibold text-sm flex items-center gap-2`}>
          <span>{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading profile: {error}
        </div>
      )}


      <div className={`bg-white shadow-lg rounded-xl p-6 border ${statusConfig.borderColor} mb-6`}>
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-[#8a4d55]/70 text-sm">First Name</p>
            <p className="text-xl text-[#8a4d55] font-semibold">
              {user.firstName}
            </p>
          </div>

          <div>
            <p className="text-[#8a4d55]/70 text-sm">Last Name</p>
            <p className="text-xl text-[#8a4d55] font-semibold">
              {user.lastName}
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="mb-4">
          <p className="text-[#8a4d55]/70 text-sm">Business Name</p>
          <p className="text-xl text-[#8a4d55] font-semibold">
            {user.buisnessName}
          </p>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-[#8a4d55]/70 text-sm">Phone Number</p>
            <p className="text-xl text-[#8a4d55] font-semibold">
              {user.phoneNumber || user.phone}
            </p>
          </div>

          <div>
            <p className="text-[#8a4d55]/70 text-sm">Email</p>
            <p className="text-xl text-[#8a4d55] font-semibold">
              {user.email}
            </p>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[#8a4d55]/70 text-sm">City</p>
            <p className="text-xl text-[#8a4d55] font-semibold">
              {user.city}
            </p>
          </div>

          <div>
            <p className="text-[#8a4d55]/70 text-sm">State</p>
            <p className="text-xl text-[#8a4d55] font-semibold">
              {user.state}
            </p>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="py-3 bg-blue-500 text-white rounded-full text-lg font-semibold shadow-md hover:bg-blue-600 transition"
        >
          🔄 Refresh Status
        </button>

        {/* View Products Button */}
        <button
          onClick={handleViewProducts}
          disabled={!isApproved}
          className={`py-3 rounded-full text-lg font-semibold shadow-md transition ${
            isApproved
              ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
         View Products
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="py-3 bg-red-500 text-white rounded-full text-lg font-semibold shadow-md hover:bg-red-600 transition"
        >
        Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;