import Image from "next/image";
import Link from "next/link";
import React from "react";
import ChangePassword from "./changePassword";
import SignoutButton from "./SignoutButton";
import { Users, Building2, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { TenantConfig } from "./homepage";

interface NavbarProps {
  tenant?: TenantConfig;
}

const Navbar = ({ tenant }: NavbarProps) => {
  const logoSrc = tenant?.logoUrl || "/assets/Nazar-Logo.png";
  const adminPath = tenant ? `/${tenant.slug}/admin/customers` : "/admin/customers";

  return (
    <div className="w-full bg-background shadow-sm dark:border-b dark:border-border">
      <div className="mx-auto flex items-center justify-between max-w-7xl px-4 md:px-6 lg:px-8 py-2">
        {/* Logo Section */}
        <div className="flex items-center">
          <Image
            src={logoSrc}
            alt={tenant?.name || "Logo"}
            width={800}
            height={480}
            className="object-contain h-20 md:h-24 w-auto"
            priority
          />
        </div>

        {/* Action Buttons Section - Always horizontal */}
        <div className="flex flex-row items-center gap-2">
          <ThemeToggle />
          {!tenant && (
            <Link
              href="/admin/tenants"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-main-color text-sm text-main-color hover:bg-main-color/10 transition-colors"
            >
              <Building2 size={16} />
              <span className="hidden sm:inline">Mandanten</span>
            </Link>
          )}
          <Link
            href={adminPath}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-main-color text-sm text-main-color hover:bg-main-color/10 transition-colors"
          >
            <Users size={16} />
            <span className="hidden sm:inline">Kunden</span>
          </Link>
          {tenant && (
            <Link
              href={`/${tenant.slug}/admin/services`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-main-color text-sm text-main-color hover:bg-main-color/10 transition-colors"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Services</span>
            </Link>
          )}
          <ChangePassword />
          <SignoutButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
