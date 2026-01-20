// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck, Heart, Code, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-dark-bg transition-colors duration-300 overflow-hidden">
      
      {/* 1️⃣ HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center max-w-3xl mx-auto">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
             <span className="text-brand-orange font-bold tracking-wider text-sm uppercase mb-4 inline-block">The Future of Food</span>
             <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
               More Than Just <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-600">Food Delivery.</span>
             </h1>
             <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
               Swirls isn't just about moving food from A to B. We are building the world's first <span className="text-gray-900 dark:text-white font-bold">Mood-First Food Platform</span>, powered by intelligent algorithms that understand what you crave before you do.
             </p>
           </motion.div>
        </div>
      </div>

      {/* 2️⃣ WHAT MAKES US DIFFERENT (GRID) */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* CARD 1: AI CHEF */}
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-white dark:bg-[#1A1C23] rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
               <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles size={28} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">AI Mood Chef 🤖</h3>
               <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Don't know what to eat? Tell us "I'm sad" or "Post-workout", and our AI recommends the perfect comfort food or protein meal. No other app does this.
               </p>
            </motion.div>

            {/* CARD 2: LIVE TRACKING */}
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-white dark:bg-[#1A1C23] rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl group-hover:bg-brand-orange/20 transition-all"></div>
               <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-brand-orange rounded-2xl flex items-center justify-center mb-6">
                  <Zap size={28} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Real-Time Sync ⚡</h3>
               <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Powered by Firebase Firestore, our order tracking is instantaneous. From "Cooking" to "Delivered", you see updates the millisecond they happen.
               </p>
            </motion.div>

            {/* CARD 3: PARTNER GROWTH */}
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-white dark:bg-[#1A1C23] rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
               <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck size={28} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Partner First 🤝</h3>
               <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  We empower local cloud kitchens with a dedicated Admin Dashboard to manage menus, orders, and analytics seamlessly.
               </p>
            </motion.div>
         </div>
      </div>

      {/* 3️⃣ TECH STACK SECTION (Great for Portfolio) */}
      <div className="bg-black text-white py-20 px-6 mb-20">
         <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12 flex items-center justify-center gap-3">
               <Code className="text-brand-orange" /> Built with Modern Tech
            </h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
               <div className="flex flex-col items-center gap-2">
                  <span className="font-bold text-xl">React.js</span>
                  <span className="text-xs text-gray-400">Frontend</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="font-bold text-xl">Firebase</span>
                  <span className="text-xs text-gray-400">Database & Auth</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="font-bold text-xl">Tailwind CSS</span>
                  <span className="text-xs text-gray-400">Styling</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="font-bold text-xl">Framer Motion</span>
                  <span className="text-xs text-gray-400">Animations</span>
               </div>
            </div>
         </div>
      </div>

      {/* 4️⃣ FOUNDER STORY */}
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 mb-20">
         <div className="w-full md:w-1/2">
            <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" 
               className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
               alt="Team"
            />
         </div>
         <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Built by Students, <br/>For Foodies.</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
               Swirls started as a college project with a simple question: 
               <em className="text-gray-800 dark:text-gray-200"> "Why do food apps only ask WHAT we want to eat, but never HOW we feel?"</em>
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
               We bridged that gap. Today, Swirls is a fully functional platform connecting hungry users with the best local kitchens, wrapped in a beautiful, dark-mode-first experience.
            </p>
            <div className="flex gap-4">
               <a href="https://github.com/" target="_blank" rel="noreferrer" className="px-6 py-3 bg-gray-200 dark:bg-white/10 rounded-xl font-bold text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                  View on GitHub
               </a>
            </div>
         </div>
      </div>

      {/* 5️⃣ CTA */}
      <div className="text-center px-6">
         <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Hungry yet?</h2>
         <Link to="/menu">
            <button className="px-10 py-4 bg-brand-orange text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform hover:shadow-orange-500/30">
               Check the Menu
            </button>
         </Link>
      </div>

    </div>
  );
};

export default About;