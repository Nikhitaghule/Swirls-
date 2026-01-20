// src/pages/PartnerRegister.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Store, User, MapPin, Upload, CheckCircle, ArrowRight, ChefHat, DollarSign, TrendingUp, Phone, Search, AlertCircle } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // Added query imports
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PartnerRegister = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('register'); // 'register' or 'status'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Register Form Data
  const [formData, setFormData] = useState({
    businessName: '', address: '', cuisine: 'Multi-Cuisine', ownerName: '', phone: '', email: '', description: ''
  });
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  // Status Check Data
  const [statusEmail, setStatusEmail] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(null); // null, 'Pending', 'Approved', 'Rejected'

  // --- HANDLERS ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) return toast.error("Max 3 images");
    files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setImages(prev => [...prev, reader.result]);
        reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "partners"), { ...formData, images, status: "Pending Approval", joinedAt: new Date() });
      setStep(3);
      setTimeout(() => navigate('/'), 4000);
    } catch (error) { toast.error("Failed. Try again."); } finally { setLoading(false); }
  };

  // 🔍 CHECK STATUS LOGIC
  const checkStatus = async (e) => {
    e.preventDefault();
    if(!statusEmail) return;
    setLoading(true);
    setApplicationStatus(null);
    
    try {
        const q = query(collection(db, "partners"), where("email", "==", statusEmail));
        const snapshot = await getDocs(q);
        
        if(snapshot.empty) {
            toast.error("No application found for this email.");
            setApplicationStatus('NotFound');
        } else {
            // Get the status of the most recent application
            const data = snapshot.docs[0].data();
            setApplicationStatus(data.status); // 'Pending Approval', 'Approved', 'Rejected'
        }
    } catch(err) {
        toast.error("Error checking status");
    } finally {
        setLoading(false);
    }
  };

  const inputClasses = "w-full bg-gray-50 dark:bg-[#2B2D33] border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange transition-all placeholder-gray-400";

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-dark-bg transition-colors px-6">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          Partner with <span className="text-brand-orange">Swirls</span>
        </h1>
        
        {/* VIEW SWITCHER */}
        <div className="flex justify-center gap-4 mb-8">
            <button 
                onClick={() => setView('register')} 
                className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'register' ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'}`}
            >
                Register Kitchen
            </button>
            <button 
                onClick={() => setView('status')} 
                className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'status' ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'}`}
            >
                Check Status
            </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1A1C23] p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10">
          
          {/* === VIEW 1: REGISTER === */}
          {view === 'register' && (
             <>
               {step === 1 && (
                 <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Step 1: Restaurant Details</h2>
                    <div className="space-y-4">
                        <input required name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Restaurant Name" className={inputClasses} />
                        <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="Full Address" className={`${inputClasses} min-h-[100px]`} />
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Official Email (Important for Status)" className={inputClasses} />
                    </div>
                    <button className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform">Next Step</button>
                 </form>
               )}
               {step === 2 && (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Step 2: Owner & Docs</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input required name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Owner Name" className={inputClasses} />
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className={inputClasses} />
                    </div>
                    <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-brand-orange text-gray-500">
                        <Upload className="mx-auto mb-2"/> Click to Upload Photos (Max 3)
                        <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    </div>
                    {images.length > 0 && <div className="flex gap-2">{images.map((src,i)=><img key={i} src={src} className="w-16 h-16 rounded object-cover"/>)}</div>}
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 dark:bg-white/10 font-bold py-4 rounded-xl dark:text-white">Back</button>
                        <button disabled={loading} className="flex-[2] bg-brand-orange text-white font-bold py-4 rounded-xl">{loading ? "Submitting..." : "Submit Application"}</button>
                    </div>
                 </form>
               )}
               {step === 3 && (
                 <div className="text-center py-10">
                    <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-4"/>
                    <h2 className="text-3xl font-bold dark:text-white">Received! 🎉</h2>
                    <p className="text-gray-500 mt-2">Use the "Check Status" tab to see updates.</p>
                 </div>
               )}
             </>
          )}

          {/* === VIEW 2: CHECK STATUS === */}
          {view === 'status' && (
             <div className="space-y-6">
                 <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Track Application</h2>
                    <p className="text-gray-500 text-sm">Enter the email you used to register.</p>
                 </div>

                 <form onSubmit={checkStatus} className="flex gap-3">
                    <input 
                        type="email" 
                        required 
                        value={statusEmail}
                        onChange={e => setStatusEmail(e.target.value)}
                        placeholder="e.g. kitchen@swirls.com" 
                        className={inputClasses}
                    />
                    <button disabled={loading} className="bg-brand-orange text-white px-6 rounded-xl font-bold">
                        {loading ? "..." : <Search/>}
                    </button>
                 </form>

                 {/* RESULT DISPLAY */}
                 {applicationStatus && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-2xl border text-center ${
                        applicationStatus === 'Approved' ? 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' :
                        applicationStatus === 'Rejected' ? 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' :
                        applicationStatus === 'NotFound' ? 'bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400' :
                        'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400'
                    }`}>
                        {applicationStatus === 'Approved' && (
                            <>
                                <CheckCircle className="w-12 h-12 mx-auto mb-2"/>
                                <h3 className="text-xl font-bold">Congratulations! 🥳</h3>
                                <p>Your kitchen is <span className="font-bold">APPROVED</span>.</p>
                                <p className="text-xs mt-2 opacity-80">Welcome to the Swirls Family.</p>
                            </>
                        )}
                        {applicationStatus === 'Pending Approval' && (
                            <>
                                <TrendingUp className="w-12 h-12 mx-auto mb-2"/>
                                <h3 className="text-xl font-bold">Under Review ⏳</h3>
                                <p>Your application is currently <span className="font-bold">PENDING</span>.</p>
                                <p className="text-xs mt-2 opacity-80">Our team usually responds within 24 hours.</p>
                            </>
                        )}
                         {applicationStatus === 'Rejected' && (
                            <>
                                <AlertCircle className="w-12 h-12 mx-auto mb-2"/>
                                <h3 className="text-xl font-bold">Application Update</h3>
                                <p>Status: <span className="font-bold">REJECTED</span></p>
                                <p className="text-xs mt-2 opacity-80">Contact support for more details.</p>
                            </>
                        )}
                        {applicationStatus === 'NotFound' && (
                            <p className="font-bold">No application found with this email.</p>
                        )}
                    </motion.div>
                 )}
             </div>
          )}

        </motion.div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default PartnerRegister;