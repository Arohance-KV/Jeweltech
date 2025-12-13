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
    navigate("/");
  };

  if (loading) {
    return (
      <div className="pt-28 text-center text-[#8a4d55] text-xl">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-28 text-center text-[#8a4d55] text-xl">
        No user logged in.
      </div>
    );
  }

  return (
    <div className="pt-28 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-[#8a4d55] mb-6 text-center">
        Profile Information
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading profile: {error}
        </div>
      )}

      {/* Approval Status Banner */}
      {userStatus === "pending_details" && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg mb-6 border border-yellow-300">
          ⏳ <strong>Pending Approval:</strong> Your profile is awaiting admin approval. You'll have full access once approved.
        </div>
      )}

      {userStatus === "active" && (
        <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-6 border border-green-300">
          ✓ <strong>Approved:</strong> Your profile is approved. You have full access.
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-6 border border-[#eac1bb]/50 mb-6">
        
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

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full py-3 bg-red-500 text-white rounded-full text-lg font-semibold shadow-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
