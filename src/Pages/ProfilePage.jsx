import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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

      <div className="bg-white shadow-lg rounded-xl p-6 border border-[#eac1bb]/50">
        
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
            {user.businessName}
          </p>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-[#8a4d55]/70 text-sm">Phone Number</p>
            <p className="text-xl text-[#8a4d55] font-semibold">
              {user.phone}
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
    </div>
  );
};

export default ProfilePage;
