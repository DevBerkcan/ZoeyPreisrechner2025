import React from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const SignoutButton = () => {
  return (
    <button
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-main-color text-sm text-main-color hover:bg-main-color/10 transition-colors"
      onClick={() => signOut()}
    >
      <Image
        src="/assets/logout-icon.png"
        alt="logout icon"
        width={18}
        height={18}
        className="object-contain"
      />
      <span className="hidden sm:inline">Abmelden</span>
    </button>
  );
};

export default SignoutButton;
