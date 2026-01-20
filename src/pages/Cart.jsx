// src/pages/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 IMPORT THIS
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCartStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 pt-24">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any delicious swirls yet. Head to the menu to satisfy your cravings!</p>
        <Link to="/menu">
          <button className="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/20 transition-all">
            Browse Menu
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
        Your <span className="text-brand-orange">Order</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm"
            >
              {/* Image */}
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-black/20">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-brand-orange font-bold">₹{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-black/30 rounded-lg p-1">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-800 dark:text-white"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-800 dark:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Remove Button */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="h-fit sticky top-28">
          <div className="glass-panel p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold">₹40</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-bold">₹20</span>
              </div>
              <div className="h-px bg-gray-200 dark:bg-white/10 my-4"></div>
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{totalPrice + 60}</span>
              </div>
            </div>

            {/* 👇 THIS IS THE BUTTON THAT WAS BROKEN - NOW FIXED */}
            <Link to="/checkout">
              <button className="w-full bg-gradient-to-r from-brand-orange to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-brand-orange/20 transition-all flex items-center justify-center gap-2 group">
                Proceed to Pay
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;