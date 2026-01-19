import Image from "next/image";
import Link from "next/link";
import React from "react";
import ChangePassword from "./changePassword";
import SignoutButton from "./SignoutButton";
import { Users } from "lucide-react";

const Navbar = () => {
  return (
    <div className="mb-1 w-full bg-white shadow-md">
      <div className="mx-auto flex items-center gap-1 max-w-7xl px-4 md:px-6 lg:px-8 py-0.5">
        {/* Logo Section */}
        <div className="flex items-center mr-auto">
          <Image
            src="/assets/Nazar-Logo.png"
            alt="Logo"
            width={280}
            height={190}
            className="object-contain max-h-14 w-auto opacity-80"
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
    </div>
  );
};

export default Navbar;
