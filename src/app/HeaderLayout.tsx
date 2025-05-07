"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const buttonStyles = "bg-transparent hover:bg-white/10 text-white font-extralight hover:text-white py-2 px-4 border border-white/50 hover:border-white/80 rounded transition-all";

function Header() {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 absolute top-0 left-0 right-0 z-10 bg-[#D9D9D9]/42 border-b border-white/20">
      <div className="flex items-center gap-8">
        <h1 className="text-white text-2xl font-[100]">LocalsGo</h1>
      </div>
      
      <div className="flex gap-4">
        <SignedOut>
          <SignUpButton mode="modal">
            <button
              className={buttonStyles}
              aria-label="Join LocalsGo"
            >
              Join Us
            </button>
          </SignUpButton>
          
          <SignInButton mode="modal">
            <button
              className={buttonStyles}
              aria-label="Sign In to your account"
            >
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        
        <SignedIn>
          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox: "text-white",
                userButtonOuterIdentifier: "text-white font-extralight",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
}

export default function HeaderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Header />}
      {children}
    </>
  );
}
