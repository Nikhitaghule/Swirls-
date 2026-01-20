// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sun, Moon, User, ShieldCheck, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = useCartStore((state) => state.cartCount());
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();

  // Check login state & Role from LocalStorage
  const userName = localStorage.getItem("userName");
  const userPhoto = localStorage.getItem("userPhoto");
  const userRole = localStorage.getItem("role"); // 'admin' or 'user'

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); // Redirect to Login Page
    window.location.reload(); 
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}>
      
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-40">
        
        {/* 🍕 LOGO WITH BOUNCING SLICE 🍕 */}
        <Link to="/home" className="flex items-end gap-1 group">
          <span className="text-4xl text-brand-orange drop-shadow-sm tracking-wide transition-colors" style={{ fontFamily: '"Chewy", cursive' }}>
            Swirls
          </span>
          
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mb-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10C3 10 5 3 12 3C19 3 21 10 21 10" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="#FBBF24"/>
              <path d="M3 10L12 22L21 10H3Z" fill="#FACC15" stroke="#D97706" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2" fill="#EF4444"/>
              <circle cx="9" cy="8" r="1.5" fill="#EF4444"/>
              <circle cx="15" cy="8" r="1.5" fill="#EF4444"/>
            </svg>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center text-sm font-bold tracking-widest text-gray-600 dark:text-gray-300">
          <Link to="/home" className="hover:text-brand-orange transition-colors">HOME</Link>
          <Link to="/menu" className="hover:text-brand-orange transition-colors">MENU</Link>
          <Link to="/about" className="hover:text-brand-orange transition-colors">OUR STORY</Link>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-white/20 mx-2"></div>

          {/* 🔒 ADMIN BUTTON (Visible ONLY if role is 'admin') */}
          {userRole === "admin" && (
            <Link to="/admin-dashboard">
              <button className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 border border-red-500/20 px-4 py-2 rounded-full transition-all">
                 <ShieldCheck size={18} />
                 <span>ADMIN PANEL</span>
              </button>
            </Link>
          )}

          {/* DYNAMIC USER PROFILE SECTION */}
          {userName ? (
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/5">
               {/* Click Profile Pic to go to Profile Page */}
               <Link to="/profile">
                   <img 
                     src={userPhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                     alt="Profile" 
                     className="w-8 h-8 rounded-full border border-brand-orange cursor-pointer hover:scale-110 transition-transform"
                   />
               </Link>
               
               <div className="flex flex-col leading-tight">
                 <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hello</span>
                 <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[80px]">
                   {userName.split(" ")[0]}
                 </span>
               </div>
               
               <button 
                 onClick={handleLogout} 
                 className="ml-2 p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-colors"
                 title="Logout"
               >
                 <LogOut size={14} />
               </button>
            </div>
          ) : (
            // Fallback (Should typically not happen in protected routes)
            <Link to="/" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
              <User size={18} />
              <span>LOGIN</span>
            </Link>
          )}

          {/* THEME TOGGLE */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-yellow-400 hover:scale-110 transition-transform ml-2"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* CART */}
          <Link to="/cart" className="relative p-2 bg-gray-200 dark:bg-white/10 rounded-full hover:bg-brand-orange hover:text-white transition-all text-gray-800 dark:text-white">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-yellow text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-900 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-dark-bg/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 p-6 flex flex-col space-y-4 text-center shadow-xl">
           <Link to="/home" onClick={() => setIsOpen(false)} className="text-gray-900 dark:text-white text-lg font-medium">Home</Link>
           <Link to="/menu" onClick={() => setIsOpen(false)} className="text-gray-900 dark:text-white text-lg font-medium">Menu</Link>
           <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-900 dark:text-white text-lg font-medium">About</Link>
           
           <div className="h-px w-full bg-gray-200 dark:bg-white/10 my-2"></div>
           
           {/* Admin Mobile Link */}
           {userRole === "admin" && (
             <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="text-red-500 text-lg font-bold flex justify-center gap-2 items-center">
               <ShieldCheck size={20} /> Admin Panel
             </Link>
           )}

           {userName ? (
             <div className="flex flex-col gap-3">
               <Link to="/profile" onClick={() => setIsOpen(false)} className="text-brand-orange font-bold text-lg">My Profile</Link>
               <button onClick={handleLogout} className="text-red-500 font-bold flex items-center justify-center gap-2">
                 <LogOut size={18} /> Logout
               </button>
             </div>
           ) : (
             <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-900 dark:text-white text-lg font-medium flex justify-center gap-2 items-center">
               <User size={20} /> Login
             </Link>
           )}

           <div className="h-px w-full bg-gray-200 dark:bg-white/10 my-2"></div>

           <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="text-gray-500 dark:text-gray-300 font-bold">
             Switch Theme ({theme === 'dark' ? 'Light' : 'Dark'})
           </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;