import Image from "next/image";
import Link from "next/link";
import React from "react";
import ChangePassword from "./changePassword";
import SignoutButton from "./SignoutButton";
import { Users } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full bg-white shadow-sm">
      <div className="mx-auto flex items-center justify-between max-w-7xl px-4 md:px-6 lg:px-8 py-2">
        {/* Logo Section */}
        <div className="flex items-center">
          <Image
            src="/assets/Nazar-Logo.png"
            alt="Logo"
            width={320}
            height={220}
            className="object-contain h-16 md:h-20 w-auto"
            priority
          />
        </div>

        {/* Action Buttons Section - Always horizontal */}
        <div className="flex flex-row items-center gap-2">
          <Link
            href="/admin/customers"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-main-color text-sm text-main-color hover:bg-main-color/10 transition-colors"
          >
            <Users size={16} />
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
