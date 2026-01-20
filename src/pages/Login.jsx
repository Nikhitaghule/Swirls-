// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { ShoppingBag } from 'lucide-react'; // Added Icon for logo

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // If already logged in, skip login page
  useEffect(() => {
    if (localStorage.getItem("userName")) {
      navigate('/home');
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      toast.success(`Welcome, ${user.displayName}!`);

      // 💾 SAVE USER SESSION
      localStorage.setItem("userName", user.displayName);
      localStorage.setItem("userPhoto", user.photoURL);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("role", "user"); // Explicitly set role

      setTimeout(() => {
        navigate('/home'); // 👈 Redirect to Home, not Menu
        window.location.reload(); 
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-900 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="glass-panel p-10 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl relative z-10 bg-black/40 backdrop-blur-xl">
        
        {/* Logo Animation */}
        <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-brand-orange to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-orange/20 animate-bounce-slow">
                <ShoppingBag className="text-white" size={32} />
            </div>
        </div>

        <h2 className="text-4xl font-bold text-center mb-2 text-white">Swirls</h2>
        <p className="text-center text-gray-400 mb-8">Order delicious food instantly.</p>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-gray-500 text-sm mb-2">Restaurant Owner?</p>
            <Link to="/admin-login">
                <button className="text-brand-orange font-bold hover:underline text-sm">
                    Admin Login &rarr;
                </button>
            </Link>
        </div>
      </div>
      <ToastContainer position="bottom-center" theme="dark" />
    </div>
  );
};

export default Login;