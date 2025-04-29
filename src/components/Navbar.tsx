import Image from "next/image";
import React from "react";
import ChangePassword from "./changePassword";
import SignoutButton from "./SignoutButton";

const Navbar = () => {
  return (
    <div className=" mb-4 flex items-center gap-2 w-full px-4 py-2 bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex-grow flex justify-center">
        <Image
          src="/assets/Nazar-Logo.png"
          alt="Logo"
          width={290}
          height={250}
          className="object-contain"
        />
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col  gap-4">
        <SignoutButton />
        <ChangePassword />
      </div>
    </div>
  );
};

export default Navbar;
