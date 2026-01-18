import Image from "next/image";
import Link from "next/link";
import React from "react";
import ChangePassword from "./changePassword";
import SignoutButton from "./SignoutButton";
import { Users } from "lucide-react";

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
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/customers"
          className="flex items-center gap-2 px-4 py-1 rounded-md border border-solid border-main-color text-sm text-main-color hover:bg-gray-100"
        >
          <Users size={18} />
          Kunden
        </Link>
        <ChangePassword />
        <SignoutButton />
      </div>
    </div>
  );
};

export default Navbar;
