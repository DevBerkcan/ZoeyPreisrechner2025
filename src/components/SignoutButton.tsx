import React from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const SignoutButton = () => {
  return (
    <button
      className="flex items-center gap-2 px-4 py-1 rounded-md border border-solid border-main-color text-sm text-main-color hover:bg-gray-100"
      onClick={() => signOut()}
    >
      <Image
        src="/assets/logout-icon.png"
        alt="logout icon"
        width={25}
        height={27}
        className="object-contain"
      />
      Abmelden
    </button>
  );
};

export default SignoutButton;
