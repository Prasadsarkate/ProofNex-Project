"use client";
import React from "react";

import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { FaHome, FaUserCheck, FaUser, FaSignOutAlt, FaSignInAlt, FaShoppingCart, FaIdBadge } from "react-icons/fa";

export default function ClientHeader() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  React.useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data?.user);
    });
    const handler = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data?.user);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  return (
    <nav className="flex items-center gap-2 sm:gap-3 px-2 py-1 bg-white/80 dark:bg-background/80 rounded-2xl shadow border border-border backdrop-blur-md">
      <Link href="/" className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl font-medium hover:bg-primary/10 transition">
        <FaHome className="text-primary w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      <Link href="/verify" className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl font-medium hover:bg-primary/10 transition">
        <FaIdBadge className="text-primary w-4 h-4" />
        <span className="hidden sm:inline">Verify</span>
      </Link>
      <Link href="/profile" className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl font-medium hover:bg-primary/10 transition">
        <FaUser className="text-primary w-4 h-4" />
        <span className="hidden sm:inline">Profile</span>
      </Link>
      {!isLoggedIn ? (
        <Link href="/login" className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl font-medium hover:bg-primary/10 transition">
          <FaSignInAlt className="text-primary w-4 h-4" />
          <span className="hidden sm:inline">Login</span>
        </Link>
      ) : (
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl font-medium hover:bg-primary/10 transition">
            <FaSignOutAlt className="text-primary w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>
      )}
      {isLoggedIn ? (
        <Link href="/checkout" className="flex items-center gap-1 text-sm rounded-xl bg-accent text-accent-foreground px-3 py-2 font-semibold shadow hover:bg-accent/80 transition">
          <FaShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Cart</span>
        </Link>
      ) : null}
    </nav>
  );
}