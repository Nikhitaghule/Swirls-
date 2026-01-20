// src/pages/Menu.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Sparkles, X, RefreshCw } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const Menu = () => {
  const { addToCart } = useCartStore();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [aiMode, setAiMode] = useState(false);
  const [aiMessage, setAiMessage] = useState(""); 
  const [aiResponse, setAiResponse] = useState("Tell me how you're feeling...");

  // 🔥 HIGH QUALITY DEMO DATA (Loads if Database is Empty)
  const demoMenu = [
    { 
      id: "demo_1", 
      name: "Truffle Mushroom Swirl", 
      price: 450, 
      category: "Pizza", 
      description: "Wild mushrooms, truffle oil, mozzarella, and thyme on a sourdough crust.", 
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop",
      tags: ["pizza", "cheese", "comfort", "sad"]
    },
    { 
      id: "demo_2", 
      name: "Fiery Peri-Peri Burger", 
      price: 249, 
      category: "Burger", 
      description: "Crispy fried chicken dunked in spicy peri-peri sauce with jalapenos.", 
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
      tags: ["spicy", "burger", "angry", "hot"]
    },
    { 
      id: "demo_3", 
      name: "Avocado Power Bowl", 
      price: 320, 
      category: "Salad", 
      description: "Fresh kale, quinoa, cherry tomatoes, avocado, and lime vinaigrette.", 
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
      tags: ["healthy", "gym", "diet", "vegan"]
    },
    { 
      id: "demo_4", 
      name: "Belgian Chocolate Lava", 
      price: 180, 
      category: "Dessert", 
      description: "Warm molten dark chocolate cake served with vanilla bean ice cream.", 
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1000&auto=format&fit=crop",
      tags: ["sweet", "chocolate", "sad", "date"]
    },
    { 
      id: "demo_5", 
      name: "Creamy Alfredo Pasta", 
      price: 390, 
      category: "Pasta", 
      description: "Rich white sauce pasta with broccoli, olives, and parmesan cheese.", 
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1000&auto=format&fit=crop",
      tags: ["pasta", "comfort", "date", "white sauce"]
    },
    { 
      id: "demo_6", 
      name: "The Weekend Platter", 
      price: 999, 
      category: "Combo", 
      description: "Assorted sliders, wings, fries, and dips. Perfect for groups!", 
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
      tags: ["party", "combo", "friends", "share"]
    }
  ];

  // Fetch Menu from Firebase
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menu"));
        const menuData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // If Database is empty, use the beautiful Demo Menu
        if (menuData.length === 0) {
            setItems(demoMenu);
            setFilteredItems(demoMenu);
        } else {
            setItems(menuData);
            setFilteredItems(menuData);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        // Fallback on error
        setItems(demoMenu);
        setFilteredItems(demoMenu);
      }
    };
    fetchMenu();
  }, []);

  // 🤖 SMART AI FILTERING LOGIC
  const handleAiSearch = (e) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const lowerMsg = aiMessage.toLowerCase();
    let moodFilter = items;
    let responseText = "Here is what I found for you!";

    // 1. SAD / COMFORT
    if (lowerMsg.includes("sad") || lowerMsg.includes("upset") || lowerMsg.includes("cry") || lowerMsg.includes("comfort")) {
        moodFilter = items.filter(i => 
           (i.description && i.description.toLowerCase().includes("cheese")) ||
           (i.name && i.name.toLowerCase().includes("chocolate")) ||
           (i.category === "Pizza") ||
           (i.category === "Dessert") ||
           (i.tags && i.tags.includes("sad"))
        );
        responseText = "Aww, don't be sad! 🥺 Here is some warm, cheesy comfort food and sweet treats.";
    } 
    // 2. HEALTHY / GYM
    else if (lowerMsg.includes("gym") || lowerMsg.includes("diet") || lowerMsg.includes("healthy") || lowerMsg.includes("protein")) {
        moodFilter = items.filter(i => 
            (i.category === "Salad") || 
            (i.description && i.description.toLowerCase().includes("healthy")) ||
            (i.tags && i.tags.includes("gym"))
        );
        responseText = "Stay strong! 💪 Here are some high-protein, clean options.";
    }
    // 3. SPICY / ANGRY
    else if (lowerMsg.includes("angry") || lowerMsg.includes("spicy") || lowerMsg.includes("hot")) {
        moodFilter = items.filter(i => 
            (i.description && i.description.toLowerCase().includes("spicy")) || 
            (i.name && i.name.toLowerCase().includes("chilli")) ||
            (i.tags && i.tags.includes("spicy"))
        );
        responseText = "Feeling fiery? 🔥 These spicy dishes match your energy!";
    }
    // 4. BROKE / CHEAP
    else if (lowerMsg.includes("broke") || lowerMsg.includes("cheap") || lowerMsg.includes("budget")) {
        moodFilter = items.filter(i => i.price < 300); 
        responseText = "I got you! 💸 Here are some delicious meals that won't break the bank.";
    }
    // 5. DATE / ROMANTIC
    else if (lowerMsg.includes("date") || lowerMsg.includes("love")) {
        moodFilter = items.filter(i => i.category === "Dessert" || i.category === "Pasta" || (i.tags && i.tags.includes("date")));
        responseText = "Ooh, fancy! ❤️ Here are some elegant dishes perfect for date night.";
    }
    // 6. GENERIC KEYWORD SEARCH
    else {
        moodFilter = items.filter(i => 
            i.name.toLowerCase().includes(lowerMsg) || 
            (i.description && i.description.toLowerCase().includes(lowerMsg))
        );
        responseText = `I searched specifically for "${aiMessage}". Hope this hits the spot!`;
    }

    setFilteredItems(moodFilter);
    setAiResponse(responseText);
  };

  const resetMenu = () => {
    setFilteredItems(items);
    setAiMessage("");
    setAiResponse("Tell me how you're feeling...");
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Our <span className="text-brand-orange">Menu</span>
                </h1>
                <p className="text-gray-500 mt-2">Find your next favorite meal.</p>
            </div>

            <button 
                onClick={() => { setAiMode(!aiMode); resetMenu(); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${
                    aiMode 
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white scale-105" 
                    : "bg-white dark:bg-white/10 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 hover:border-brand-orange"
                }`}
            >
                {aiMode ? <X size={20}/> : <Sparkles size={20} className={aiMode ? "" : "text-brand-orange"} />}
                {aiMode ? "Close AI Chef" : "Ask AI Chef"}
            </button>
        </div>

        {/* 🤖 AI INTERFACE */}
        <AnimatePresence>
            {aiMode && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className="mb-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6 rounded-3xl shadow-2xl text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        {/* AI Response Bubble */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="bg-white/10 p-3 rounded-full">
                                <Sparkles className="text-yellow-300" />
                            </div>
                            <div className="bg-white/10 px-6 py-3 rounded-r-2xl rounded-bl-2xl">
                                <p className="text-lg font-medium">{aiResponse}</p>
                            </div>
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleAiSearch} className="flex gap-3">
                            <input 
                                type="text" autoFocus
                                placeholder="e.g. I am sad, I need cheap food..." 
                                className="flex-1 bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:bg-black/50 transition-all"
                                value={aiMessage}
                                onChange={(e) => setAiMessage(e.target.value)}
                            />
                            <button className="bg-white text-purple-900 font-bold px-6 py-3 rounded-xl hover:bg-purple-100 transition-colors">
                                Send
                            </button>
                        </form>

                        {/* Suggestions */}
                        <div className="mt-4 flex gap-2 flex-wrap text-sm text-purple-200/60">
                            <span>Try saying:</span>
                            <span className="border border-white/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-white/10" onClick={() => setAiMessage("I am sad")}>"I am sad"</span>
                            <span className="border border-white/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-white/10" onClick={() => setAiMessage("Gym diet")}>"Gym diet"</span>
                            <span className="border border-white/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-white/10" onClick={() => setAiMessage("Date night")}>"Date night"</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* 🏷️ SECTION TITLE */}
        {aiMode && filteredItems.length < items.length && (
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    ✨ AI Chef Recommends:
                </h2>
                <button onClick={resetMenu} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange">
                    <RefreshCw size={16} /> Show Full Menu
                </button>
            </div>
        )}

        {/* 🍕 MENU GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
                <motion.div 
                layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                key={item.id} 
                className="glass-panel rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-brand-orange/10 transition-all bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 group"
                >
                <div className="h-48 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md">
                    {item.category}
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                    <span className="text-brand-orange font-bold text-lg">₹{item.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{item.description}</p>
                    
                    <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                    <Plus size={18} /> Add to Cart
                    </button>
                </div>
                </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
                <p className="text-xl text-gray-500 mb-4">No items found for "{aiMessage}". 😔</p>
                <button onClick={resetMenu} className="bg-brand-orange text-white px-6 py-2 rounded-full font-bold">
                    View Full Menu
                </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Menu;