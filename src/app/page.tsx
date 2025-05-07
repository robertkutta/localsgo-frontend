import { FaInstagram, FaTwitter, FaFacebook, FaGoogle, FaEnvelope } from 'react-icons/fa';
import { SignUpButton, SignInButton } from '@clerk/nextjs';

const smButton = "w-full bg-white/20 hover:bg-white/40 text-white font-extralight py-2 px-6 rounded-full transition-all text-lg flex items-center justify-center gap-2";

export default function Home() {
  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: 'url("/coffee-workspace.jpg")' }}
    >
      <main className="flex-grow p-8 flex flex-col items-center justify-start pt-22">
        <div className="mb-6">
          <h1 className="font-dm-sans text-5xl font-bold text-white text-center">Find your perfect trip</h1>
        </div>
        <div>
          <p className="font-dm-sans text-2xl font-thin text-white text-center">Discover the best of wherever you are,<br />curated by locals</p>
        </div>

        <div className="mt-20 flex flex-col gap-4 w-full max-w-sm">
          <SignInButton mode="modal">
            <button className={smButton}>
              <FaGoogle /> Continue with Google
            </button>
          </SignInButton>
          <SignInButton mode="modal">
            <button className={smButton}>
              <FaFacebook /> Continue with Facebook
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className={smButton}>
              <FaEnvelope /> Sign up with Email
            </button>
          </SignUpButton>

          <div className="mt-2 text-center">
            <SignInButton mode="modal">
              <button className="text-white font-extralight hover:text-white/80 transition-colors underline">
                Already have an account?
              </button>
            </SignInButton>
          </div>
        </div>
      </main>
      <footer className="p-4 relative flex items-center justify-center border-t border-white/20 bg-[#D9D9D9]/42">
        <div className="absolute left-4 flex gap-4">
          <a href="#" className="text-white hover:text-white/80 transition-colors">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="text-white hover:text-white/80 transition-colors">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-white hover:text-white/80 transition-colors">
            <FaFacebook size={20} />
          </a>
        </div>
        <p className="text-xs text-white font-extralight">©LocalsGo 2025. All rights reserved.</p>
      </footer>
    </div>
  );
}
