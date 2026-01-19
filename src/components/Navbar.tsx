import Image from "next/image";
import Link from "next/link";
import React from "react";
import ChangePassword from "./changePassword";
import SignoutButton from "./SignoutButton";
import { Users } from "lucide-react";

const Navbar = () => {
  return (
    <div className="mb-1 flex items-center gap-1 w-full px-2 py-0.5 bg-white shadow-sm">
      {/* Logo Section */}
      <div className="flex grow justify-center py-0.5">
        <Image
          src="/assets/Nazar-Logo.png"
          alt="Logo"
          width={200}
          height={140}
          className="object-contain max-h-10 w-auto"
        />
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-row md:flex-col gap-1 flex-wrap">
        <Link
          href="/admin/customers"
          className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-md border border-solid border-main-color text-xs md:text-sm text-main-color hover:bg-gray-100 transition-colors"
        >
          <Users size={16} className="md:w-[18px] md:h-[18px]" />
          <span className="hidden sm:inline">Kunden</span>
        </Link>
        <ChangePassword />
        <SignoutButton />
      </div>
    </div>
  );
};

export default Navbar;
