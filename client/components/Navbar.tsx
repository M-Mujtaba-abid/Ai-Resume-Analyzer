"use client"
import React, { useState, useEffect } from 'react';
import { ModeToggle } from './ModeToggle';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // lucide-react icons use kar rahe hain

const Navbar = ({ isLoggedIn = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jab mobile menu khula ho to scroll lock kar dein
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Solutions', href: '#features' },
    { name: 'Technology', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg border-b border-border py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <Link href={'/'} className="flex items-center gap-2 group z-[110]">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground italic">
              ResuScan<span className="text-blue-600">.AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-10 font-semibold text-foreground/70 text-sm uppercase tracking-wider">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-blue-600 transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          {/* Actions & Hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <ModeToggle />
              {isLoggedIn ? (
                <button className="bg-card text-foreground px-5 py-2.5 rounded-xl font-bold border border-border hover:bg-border transition-colors">
                  Logout
                </button>
              ) : (
                <>
                  <Link href={'/login'} className="text-foreground/80 font-bold px-4 py-2 hover:text-blue-600 transition-colors">
                    Sign In
                  </Link>
                  <Link href={'/register'} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger Button (Mobile Only) */}
            <button 
              className="md:hidden p-2 text-foreground z-[110]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

      {/* --- MOBILE MENU OVERLAY --- */}
<div className={`fixed inset-0 w-full h-[100dvh] bg-background/98 backdrop-blur-2xl z-[999] md:hidden transition-all duration-500 ease-in-out ${
  isMobileMenuOpen 
    ? 'translate-y-0 opacity-100' 
    : '-translate-y-full opacity-0 pointer-events-none'
}`}>
  
  {/* Inner Container: Isme scroll handle hoga */}
  <div className="relative w-full h-full flex flex-col overflow-y-auto overflow-x-hidden">
    
    {/* Close Button Area (Hamein hamesha top-right par close button chahiye hota hai) */}
    <div className="flex justify-end p-6">
       <button 
         onClick={() => setIsMobileMenuOpen(false)}
         className="p-2 text-foreground"
       >
         <X size={32} />
       </button>
    </div>

    {/* Content Area */}
    <div className="flex flex-col items-center justify-start flex-grow px-6 pb-20 space-y-10 text-center">
      
      {/* Branding inside Menu */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20">
          R
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground italic">
          ResuScan<span className="text-blue-600">.AI</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col space-y-8 w-full">
        {navLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href} 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-4xl font-extrabold text-foreground hover:text-blue-600 transition-all active:scale-95 tracking-tighter"
          >
            {link.name}
          </a>
        ))}
      </div>
      
      {/* Divider */}
      <div className="w-full max-w-[250px] border-t border-border pt-10">
         <div className="flex flex-col items-center gap-8">
            <ModeToggle />
            
            {isLoggedIn ? (
              <button className="w-full bg-card text-foreground py-5 rounded-2xl font-bold border border-border shadow-md active:scale-95 transition-transform">
                Logout Account
              </button>
            ) : (
              <div className="flex flex-col gap-5 w-full">
                <Link 
                  href={'/login'} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-2xl font-bold text-foreground/70 hover:text-foreground"
                >
                  Sign In
                </Link>
                <Link 
                  href={'/register'} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/30 active:scale-95 transition-transform"
                >
                  Get Started Free
                </Link>
              </div>
            )}
         </div>
      </div>
      
      {/* Footer Text */}
      <p className="text-sm text-slate-500 font-medium pt-4 pb-10">
        Professional Resume Analysis v1.0
      </p>
    </div>
  </div>
</div>
      </nav>
    </>
  );
};

export default Navbar;