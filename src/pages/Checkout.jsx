// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, CheckCircle, User, Phone, Mail } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Success

  // User details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'COD'
  });

  // 🧠 AUTO-FILL USER DATA IF LOGGED IN
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      setFormData(prev => ({ ...prev, name: userName }));
    }
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 💾 SAVE ORDER TO FIREBASE
      await addDoc(collection(db, "orders"), {
        customer: formData,
        items: cart,
        total: totalPrice + 60, // Including delivery fees
        status: "Pending", // Default status
        createdAt: new Date(),
        userEmail: formData.email 
      });

      setStep(2); // Show Success Screen
      clearCart();
      
      // Redirect to Profile after 3 seconds
      setTimeout(() => navigate('/profile'), 3000);

    } catch (error) {
      console.error(error);
      toast.error("Order Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step === 1) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl font-bold text-gray-400">Your cart is empty!</h2>
            <button onClick={() => navigate('/menu')} className="mt-4 text-brand-orange hover:underline font-bold">Go to Menu</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-20 max-w-5xl mx-auto transition-colors duration-300">
      
      {step === 1 ? (
        // === STEP 1: CHECKOUT FORM ===
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: FORM */}
            <form onSubmit={handleOrder} className="space-y-6">
              
              {/* DELIVERY DETAILS CARD */}
              <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                    <MapPin className="text-brand-orange"/> Delivery Details
                </h2>
                
                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="relative">
                    <User className="absolute top-4 left-4 text-gray-400" size={20} />
                    <input 
                        required 
                        placeholder="Full Name" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        className="w-full bg-gray-50 dark:bg-[#2B2D33] border border-gray-200 dark:border-gray-600 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange transition-all placeholder-gray-400"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <Mail className="absolute top-4 left-4 text-gray-400" size={20} />
                    <input 
                        required 
                        type="email" 
                        placeholder="Email (For Order Tracking)" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        className="w-full bg-gray-50 dark:bg-[#2B2D33] border border-gray-200 dark:border-gray-600 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange transition-all placeholder-gray-400"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <Phone className="absolute top-4 left-4 text-gray-400" size={20} />
                    <input 
                        required 
                        type="tel" 
                        placeholder="Phone Number" 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        className="w-full bg-gray-50 dark:bg-[#2B2D33] border border-gray-200 dark:border-gray-600 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange transition-all placeholder-gray-400"
                    />
                  </div>

                  {/* Address Textarea */}
                  <textarea 
                    required 
                    placeholder="Full Address (Street, House No, Landmark)" 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="w-full h-32 bg-gray-50 dark:bg-[#2B2D33] border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange transition-all placeholder-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* PAYMENT METHOD CARD */}
              <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <CreditCard className="text-brand-orange"/> Payment Method
                </h2>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, paymentMethod: 'COD'})} 
                    className={`flex-1 p-4 rounded-xl border-2 font-bold transition-all ${formData.paymentMethod === 'COD' ? 'border-brand-orange text-brand-orange bg-brand-orange/10' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}
                  >
                    Cash on Delivery
                  </button>
                  <button 
                    type="button" 
                    onClick={() => toast.info("Online Payment coming soon!")} 
                    className="flex-1 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed bg-gray-50 dark:bg-white/5"
                  >
                    UPI / Card
                  </button>
                </div>
              </div>

              <button disabled={loading} className="w-full bg-gradient-to-r from-brand-orange to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-brand-orange/30 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100">
                {loading ? "Placing Order..." : `Pay ₹${totalPrice + 60}`}
              </button>
            </form>

            {/* RIGHT COLUMN: SUMMARY */}
            <div className="h-fit bg-gray-50 dark:bg-[#1A1C23] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 overflow-hidden">
                            <img src={item.image} alt="" className="w-full h-full object-cover"/>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.quantity}x {item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-white/10 pt-4 space-y-2 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{totalPrice}</span></div>
                <div className="flex justify-between text-brand-orange"><span>Delivery Fee</span><span>₹40</span></div>
                <div className="flex justify-between text-brand-orange"><span>Platform Fee</span><span>₹20</span></div>
                <div className="h-px bg-gray-200 dark:bg-white/10 my-2"></div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white mt-2"><span>Total</span><span>₹{totalPrice + 60}</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // === STEP 2: SUCCESS ANIMATION ===
        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30">
              <CheckCircle className="text-white w-12 h-12" />
            </div>
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Order Placed! 🎉</h2>
          <p className="text-gray-500 mb-8 text-lg">Your food is being prepared.<br/>Redirecting to your profile...</p>
        </div>
      )}
      
      <ToastContainer position="bottom-center" theme="dark" />
    </div>
  );
};

export default Checkout;