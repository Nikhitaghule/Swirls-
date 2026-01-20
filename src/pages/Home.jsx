// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Star, ShieldCheck, Truck, ChefHat, MapPin } from 'lucide-react';

const Home = () => {
  
  // 🍔 MOCK CATEGORIES (Like Swiggy/Zomato)
  const categories = [
    { name: "Pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop" },
    { name: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop" },
    { name: "Biryani", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=200&auto=format&fit=crop" },
    { name: "Chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=200&auto=format&fit=crop" },
    { name: "Healthy", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop" },
    { name: "Dessert", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=200&auto=format&fit=crop" },
    { name: "Rolls", img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=200&auto=format&fit=crop" },
  ];

  // 🔥 TRENDING ITEMS
  const trending = [
    { name: "Truffle Pizza", price: "450", rating: "4.8", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500" },
    { name: "Spicy Burger", price: "249", rating: "4.5", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500" },
    { name: "Choco Lava", price: "120", rating: "4.9", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      
      {/* 1️⃣ HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/20 border border-brand-orange text-brand-orange text-sm font-bold mb-4">
               🚀 Fastest Delivery in Town
             </span>
             <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
               Taste the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400">Extraordinary</span>
             </h1>
             <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
               From gourmet burgers to comforting desserts, we deliver culinary masterpieces straight to your doorstep within minutes.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/menu">
                  <button className="px-8 py-4 bg-brand-orange hover:bg-orange-600 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-brand-orange/30 flex items-center gap-2">
                    Order Now <ArrowRight size={20} />
                  </button>
                </Link>
                <Link to="/about">
                  <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold text-lg transition-all backdrop-blur-md">
                    View Story
                  </button>
                </Link>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2️⃣ CATEGORIES SCROLL (Swiggy Style) */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">What's on your mind?</h2>
         <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {categories.map((cat, i) => (
               <Link to="/menu" key={i} className="flex-shrink-0 group cursor-pointer">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-transparent group-hover:border-brand-orange transition-all duration-300 shadow-md">
                     <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <p className="text-center mt-3 font-bold text-gray-700 dark:text-gray-300 group-hover:text-brand-orange transition-colors">{cat.name}</p>
               </Link>
            ))}
         </div>
      </section>

      {/* 3️⃣ TRENDING NOW */}
      <section className="py-16 px-6 bg-white dark:bg-[#1A1C23]">
        <div className="max-w-7xl mx-auto">
           <div className="flex justify-between items-end mb-10">
              <div>
                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Now 🔥</h2>
                 <p className="text-gray-500 mt-2">Most ordered items this week</p>
              </div>
              <Link to="/menu" className="text-brand-orange font-bold hover:underline">See all &rarr;</Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trending.map((item, i) => (
                 <motion.div whileHover={{ y: -10 }} key={i} className="bg-gray-50 dark:bg-dark-bg rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 cursor-pointer group">
                    <div className="h-48 overflow-hidden relative">
                       <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                       <div className="absolute top-3 right-3 bg-white dark:bg-black/60 text-black dark:text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-yellow-400"/> {item.rating}
                       </div>
                    </div>
                    <div className="p-6">
                       <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
                       <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-bold text-brand-orange">₹{item.price}</span>
                          <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-brand-orange hover:text-white transition-colors">
                             <ArrowRight size={16} />
                          </button>
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* 4️⃣ WHY CHOOSE US */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Swirls?</h2>
            <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full"></div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1C23] shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-white/5">
               <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock size={32} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Super Fast Delivery</h3>
               <p className="text-gray-500">We promise delivery within 30 minutes, or your food is free. Speed is our superpower.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1C23] shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-white/5">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={32} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">100% Safe & Hygienic</h3>
               <p className="text-gray-500">Our kitchens adhere to the strictest hygiene standards. Safety first, always.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1C23] shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-white/5">
               <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ChefHat size={32} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Master Chefs</h3>
               <p className="text-gray-500">Every dish is crafted by experienced chefs who are passionate about flavor.</p>
            </div>
         </div>
      </section>

      {/* 5️⃣ PARTNER BANNER */}
      <section className="py-20 px-6">
         <div className="max-w-6xl mx-auto bg-gradient-to-r from-gray-900 to-black rounded-3xl p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10 max-w-xl text-center md:text-left">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Partner with Swirls</h2>
               <p className="text-gray-400 mb-8 text-lg">Own a restaurant? Join our network and reach thousands of new customers today.</p>
               <Link to="/partner-register">
                  <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                     Register Your Kitchen
                  </button>
               </Link>
            </div>
            
            <div className="relative z-10 mt-8 md:mt-0">
               <div className="w-64 h-64 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Truck size={64} className="text-brand-orange" />
               </div>
            </div>
         </div>
      </section>

      {/* 6️⃣ FOOTER */}
      <footer className="bg-white dark:bg-[#0d0d0d] pt-16 pb-8 border-t border-gray-200 dark:border-white/5">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
               <h2 className="text-3xl font-bold text-brand-orange mb-4" style={{ fontFamily: '"Chewy", cursive' }}>Swirls.</h2>
               <p className="text-gray-500 text-sm leading-relaxed">
                  Delivering happiness, one meal at a time. The best food delivery app in town.
               </p>
            </div>
            
            <div>
               <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
               <ul className="space-y-3 text-sm text-gray-500">
                  <li><Link to="/about" className="hover:text-brand-orange">About Us</Link></li>
                  <li><Link to="/partner-register" className="hover:text-brand-orange">Team</Link></li>
                  <li><Link to="/menu" className="hover:text-brand-orange">Careers</Link></li>
               </ul>
            </div>
            
            <div>
               <h4 className="font-bold text-gray-900 dark:text-white mb-6">Contact</h4>
               <ul className="space-y-3 text-sm text-gray-500">
                  <li>Help & Support</li>
                  <li>Partner with us</li>
                  <li>Ride with us</li>
               </ul>
            </div>

            <div>
               <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
               <ul className="space-y-3 text-sm text-gray-500">
                  <li>Terms & Conditions</li>
                  <li>Cookie Policy</li>
                  <li>Privacy Policy</li>
               </ul>
            </div>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">© 2024 Swirls Technologies Pvt. Ltd.</p>
            <div className="flex gap-4">
               {/* Social Icons Placeholder */}
               <div className="w-8 h-8 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-brand-orange hover:text-white transition-all"><MapPin size={14}/></div>
            </div>
         </div>
      </footer>

    </div>
  );
};

export default Home;