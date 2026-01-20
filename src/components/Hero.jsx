// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const foodImages = [
  // 1. Pizza
  "https://png.pngtree.com/png-clipart/20230412/original/pngtree-modern-kitchen-food-boxed-cheese-lunch-pizza-png-image_9048155.png",
  // 2. Fried Chicken
  "https://static.vecteezy.com/system/resources/previews/021/952/448/original/southern-fried-chicken-fried-chicken-transparent-background-png.png", 
  // 3. ✅ FIXED: New Reliable Burger Image
  "https://png.pngtree.com/png-clipart/20221001/original/pngtree-fast-food-big-ham-burger-png-image_8648590.png"
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Rotating Food Logic (every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % foodImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
        
        {/* Left Content */}
        <div className="space-y-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2"
          >
            <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
            <span className="text-sm font-medium text-brand-orange">Fastest Delivery in Town 🚀</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Taste the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-yellow">
              Extraordinary
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
            Where culinary artistry meets convenience. We craft exceptional dining experiences and deliver them straight to your doorstep within minutes.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/menu">
              <button className="bg-gradient-to-r from-brand-orange to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-brand-orange/25 transition-all flex items-center gap-2 group">
                Order Now 
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <Link to="/about">
              <button className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-300 dark:border-white/20 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                View Story
              </button>
            </Link>
          </div>
        </div>

        {/* Right Image (Rotating) */}
        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
            {/* Glow */}
            <div className="absolute w-[300px] h-[300px] bg-brand-orange/20 rounded-full blur-[100px] animate-pulse" />
            
            <AnimatePresence mode='wait'>
              <motion.img 
                key={currentImage}
                src={foodImages[currentImage]} 
                alt="Delicious Food"
                initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 20 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-contain drop-shadow-2xl relative z-10"
              />
            </AnimatePresence>

            {/* Floating Review Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 md:bottom-10 left-0 bg-white dark:bg-dark-card p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100 dark:border-white/10 z-20"
            >
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">😋</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">50k+ Happy</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Customers</p>
              </div>
            </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Hero;