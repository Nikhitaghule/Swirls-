// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Query the 'admins' collection for this email
      const q = query(
        collection(db, "admins"), 
        where("email", "==", formData.email)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Admin email not found!");
      }

      // 2. Check Password (Simple check for this project)
      const adminData = snapshot.docs[0].data();
      if (adminData.password !== formData.password) {
        throw new Error("Invalid Password!");
      }

      // 3. Success!
      toast.success(`Welcome, ${adminData.name}! 👨‍🍳`);
      
      localStorage.setItem("userName", adminData.name);
      localStorage.setItem("userEmail", adminData.email);
      localStorage.setItem("role", "admin"); // 👈 Keeps the Navbar logic working

      setTimeout(() => {
          navigate('/admin-dashboard');
          window.location.reload();
      }, 1500);

    } catch (error) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md border border-red-900/30 shadow-2xl bg-[#1a0505]">
        <div className="text-center mb-8">
            <ShieldCheck size={48} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-white">Admin Access</h1>
            <p className="text-red-400/60">Restricted Area</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                <Mail className="text-gray-500" size={20}/>
                <input 
                    type="email" placeholder="Admin Email" 
                    className="w-full bg-transparent p-4 text-white outline-none"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                <Lock className="text-gray-500" size={20}/>
                <input 
                    type="password" placeholder="Password" 
                    className="w-full bg-transparent p-4 text-white outline-none"
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>
            <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                {loading ? "Verifying Access..." : "Access Dashboard"}
            </button>
        </form>
      </div>
      <ToastContainer position="bottom-center" theme="dark" />
    </div>
  );
};

export default AdminLogin;