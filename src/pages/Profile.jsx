// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { User, Package, Clock, MapPin, Search, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';

const Profile = () => {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({ totalSpent: 0, totalOrders: 0 });
  
  // --- PROFILE PHOTO STATE ---
  // Try to get existing photo from local storage first
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem("userPhoto") || "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-fill info from localStorage
  useEffect(() => {
    const lastEmail = localStorage.getItem("lastOrderEmail");
    if(lastEmail) setEmail(lastEmail);
    
    // Ensure state matches local storage on mount
    const currentPhoto = localStorage.getItem("userPhoto");
    if(currentPhoto) setProfilePhoto(currentPhoto);
  }, []);

  // --- PHOTO UPLOAD HANDLER (Base64 Hack) ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limit size to 500KB for localStorage
      if (file.size > 500 * 1024) {
        toast.error("Image too large! Max 500KB.");
        return;
      }

      setUploadingPhoto(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        // 1. Update State so it shows immediately
        setProfilePhoto(base64String);
        // 2. Update LocalStorage so it persists and updates Navbar on reload
        localStorage.setItem("userPhoto", base64String);
        setUploadingPhoto(false);
        toast.success("Profile Photo Updated! 📸");
        // Optional: Reload page so Navbar updates immediately
        // window.location.reload(); 
      };
      reader.readAsDataURL(file);
    }
  };


  const fetchOrders = async (e) => {
    if(e) e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setOrders([]);
    
    try {
      const q = query(collection(db, "orders"), where("userEmail", "==", email));
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Manual Sort: Newest First
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setOrders(data);

      // Calculate Stats
      const spent = data.reduce((acc, curr) => acc + (curr.total || 0), 0);
      setUserStats({ totalSpent: spent, totalOrders: data.length });

      localStorage.setItem("lastOrderEmail", email);

    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Could not find orders.");
    } finally {
      setLoading(false);
    }
  };

  const userName = localStorage.getItem("userName") || "Foodie";

  return (
    <div className="min-h-screen pt-24 px-6 pb-20 max-w-5xl mx-auto transition-colors duration-300">
      
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-brand-orange to-red-500 rounded-3xl p-8 text-white shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0" />

        <div className="flex flex-col md:flex-row items-center gap-6 z-10">
            
            {/* 📸 CLICKABLE PROFILE PHOTO AREA 📸 */}
            <div className="relative group">
                 {/* Hidden File Input */}
                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*"/>
                
                <div 
                    onClick={() => fileInputRef.current.click()}
                    className="w-28 h-28 rounded-full border-4 border-white/30 overflow-hidden relative cursor-pointer shadow-lg hover:border-white transition-all"
                >
                    {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-white/20 flex items-center justify-center">
                            <User size={48} className="text-white/80" />
                        </div>
                    )}

                    {/* Hover Overlay with Camera Icon */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={28} className="text-white" />
                    </div>

                    {/* Loading Spinner */}
                    {uploadingPhoto && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">Hello, {userName.split(" ")[0]}! 👋</h1>
                <p className="opacity-90">Track your delicious journey</p>
            </div>
        </div>
        
        {/* STATS */}
        <div className="flex gap-4 text-center z-10">
            <div className="bg-black/20 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <p className="text-xs opacity-70 uppercase tracking-wider mb-1">Orders</p>
                <p className="text-3xl font-bold">{userStats.totalOrders}</p>
            </div>
            <div className="bg-black/20 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <p className="text-xs opacity-70 uppercase tracking-wider mb-1">Total Spent</p>
                <p className="text-3xl font-bold">₹{userStats.totalSpent}</p>
            </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="glass-panel p-8 rounded-3xl bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 shadow-lg mb-10">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
            <Search className="text-brand-orange" size={20}/> Find My Orders
        </h2>
        <form onSubmit={fetchOrders} className="flex flex-col md:flex-row gap-4">
            <input 
                type="email" 
                placeholder="Enter the email you used at checkout..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-[#2B2D33] border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange transition-all placeholder-gray-400"
            />
            <button className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg">
                {loading ? "Searching..." : "Find Orders"}
            </button>
        </form>
      </div>

      {/* ORDER LIST */}
      <div className="space-y-6">
        {orders.length > 0 ? (
            orders.map((order) => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={order.id} 
                    className="glass-panel p-6 rounded-3xl bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all group"
                >
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-500 dark:text-gray-400">
                                    ID: #{order.id.slice(0, 6)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400' :
                                    order.status === 'Cooking' ? 'bg-orange-100 text-brand-orange border-orange-200 dark:bg-orange-900/30' :
                                    'bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                <Clock size={12}/> {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : "Just now"}
                            </p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{order.total}</p>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Items */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><Package size={12}/> Items</p>
                            <div className="flex flex-wrap gap-2">
                                {order.items.map((item, i) => (
                                    <span key={i} className="text-sm bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5">
                                        {item.quantity}x {item.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Address */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><MapPin size={12}/> Destination</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {order.customer.address}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))
        ) : (
            // EMPTY STATE
            <div className="text-center py-20 px-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No orders found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    {email 
                        ? `We couldn't find any orders for "${email}". Try checking the spelling or placing a new order.` 
                        : "Enter your email above to see your past orders and track current deliveries."}
                </p>
            </div>
        )}
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default Profile;