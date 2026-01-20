// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, orderBy, query, doc, updateDoc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, Store, Eye, MapPin, Plus, Trash2, Image as ImageIcon, Edit3, Zap, TrendingUp, DollarSign, Activity, Shield, UserPlus, Settings, X, Phone, User } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'partners', 'menu', 'analytics', 'settings'
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // --- MENU FORM STATE ---
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Pizza', description: '', tags: '' });
  const [itemImage, setItemImage] = useState("");
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- NEW ADMIN STATE ---
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  // 🔥 FETCH LIVE DATA
  useEffect(() => {
    const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snap) => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubPartners = onSnapshot(query(collection(db, "partners"), orderBy("joinedAt", "desc")), (snap) => setPartners(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubMenu = onSnapshot(collection(db, "menu"), (snap) => setMenuItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubAdmins = onSnapshot(collection(db, "admins"), (snap) => setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubOrders(); unsubPartners(); unsubMenu(); unsubAdmins(); };
  }, []);

  // --- ACTIONS ---
  const updateOrderStatus = async (orderId, currentStatus) => {
    const statusFlow = { "Pending": "Cooking", "Cooking": "Out for Delivery", "Out for Delivery": "Delivered" };
    const nextStatus = statusFlow[currentStatus];
    if (nextStatus) { await updateDoc(doc(db, "orders", orderId), { status: nextStatus }); toast.success(`Updated to ${nextStatus}`); }
  };

  const handlePartnerAction = async (pid, status) => { await updateDoc(doc(db, "partners", pid), { status }); toast.success(`Partner ${status}!`); setSelectedPartner(null); };
  
  const handleImageUpload = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setItemImage(reader.result); reader.readAsDataURL(file); } };
  
  const handleAddItem = async (e) => { e.preventDefault(); setIsSubmitting(true); try { await addDoc(collection(db, "menu"), { ...newItem, price: Number(newItem.price), image: itemImage, tags: newItem.tags.split(','), createdAt: new Date() }); toast.success("Item Added!"); setNewItem({ name: '', price: '', category: 'Pizza', description: '', tags: '' }); setItemImage(""); } catch(e){toast.error("Error adding item")} finally { setIsSubmitting(false); } };
  
  const handleDeleteItem = async (id) => { if(window.confirm("Delete?")) await deleteDoc(doc(db, "menu", id)); };

  const handleRestoreDemo = async () => {
    if(!window.confirm("Load 6 demo items?")) return;
    setIsSubmitting(true);
    const demoItems = [
        { id: "demo_1", name: "Truffle Mushroom Swirl", price: 450, category: "Pizza", description: "Wild mushrooms, truffle oil...", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop", tags: ["pizza", "cheese", "comfort", "sad"] },
        { id: "demo_2", name: "Fiery Peri-Peri Burger", price: 249, category: "Burger", description: "Crispy fried chicken...", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop", tags: ["spicy", "burger", "angry", "hot"] },
        { id: "demo_3", name: "Avocado Power Bowl", price: 320, category: "Salad", description: "Fresh kale, quinoa...", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop", tags: ["healthy", "gym", "diet", "vegan"] },
        { id: "demo_4", name: "Belgian Chocolate Lava", price: 180, category: "Dessert", description: "Warm molten dark chocolate...", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1000&auto=format&fit=crop", tags: ["sweet", "chocolate", "sad", "date"] },
        { id: "demo_5", name: "Creamy Alfredo Pasta", price: 390, category: "Pasta", description: "Rich white sauce...", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1000&auto=format&fit=crop", tags: ["pasta", "comfort", "date", "white sauce"] },
        { id: "demo_6", name: "The Weekend Platter", price: 999, category: "Combo", description: "Assorted sliders...", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop", tags: ["party", "combo", "friends", "share"] }
    ];
    try { for (const item of demoItems) await setDoc(doc(db, "menu", item.id), item); toast.success("Demo Loaded!"); } catch (error) { toast.error("Failed"); } finally { setIsSubmitting(false); }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if(!newAdmin.email || !newAdmin.password) return;
    try { await addDoc(collection(db, "admins"), newAdmin); toast.success("New Admin Assigned! 🛡️"); setNewAdmin({ name: '', email: '', password: '' }); } catch(err) { toast.error("Failed"); }
  };

  const handleDeleteAdmin = async (id) => { if(window.confirm("Revoke access?")) await deleteDoc(doc(db, "admins", id)); };

  // 📊 ANALYTICS DATA PREP
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const statusCounts = orders.reduce((acc, order) => { acc[order.status] = (acc[order.status] || 0) + 1; return acc; }, {});
  const pieData = Object.keys(statusCounts).map(status => ({ name: status, value: statusCounts[status] }));
  const COLORS = ['#FFBB28', '#FF8042', '#00C49F', '#0088FE'];
  const itemCounts = {};
  orders.forEach(order => { order.items.forEach(item => { itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity; }); });
  const barData = Object.keys(itemCounts).map(name => ({ name: name.split(" ")[0], count: itemCounts[name] })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="min-h-screen pt-24 px-6 pb-20 max-w-7xl mx-auto relative transition-colors duration-300">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div><h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1></div>
        <div className="bg-white dark:bg-white/5 p-1.5 rounded-2xl flex gap-1 shadow-sm border overflow-x-auto">
          {['orders', 'partners', 'menu', 'analytics', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl font-bold text-sm capitalize whitespace-nowrap transition-all ${activeTab === tab ? 'bg-brand-orange text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {tab === 'settings' ? 'Admins 🛡️' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* === 1. ORDERS TAB === */}
      {activeTab === 'orders' && (
        <div className="grid gap-6">
          {orders.map((order) => (
            <motion.div layout key={order.id} className="glass-panel p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1C23] shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-brand-orange/30 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-500">#{order.id.slice(0, 6)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'Pending' ? 'text-yellow-500 border-yellow-500 bg-yellow-500/10' : order.status === 'Delivered' ? 'text-green-500 border-green-500 bg-green-500/10' : 'text-blue-500 border-blue-500 bg-blue-500/10'}`}>{order.status}</span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{order.customer.name}</h3>
                <div className="text-sm text-gray-400 mb-2 flex items-center gap-1"><MapPin size={14}/> {order.customer.address}</div>
                <div className="flex flex-wrap gap-2">{order.items.map((i, idx) => (<span key={idx} className="text-xs bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">{i.quantity}x {i.name}</span>))}</div>
              </div>
              <button onClick={() => updateOrderStatus(order.id, order.status)} className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
                {order.status === "Pending" ? <><Clock size={18}/> Cook</> : order.status === "Cooking" ? <><Package size={18}/> Ship</> : <><CheckCircle size={18}/> Done</>}
              </button>
            </motion.div>
          ))}
          {orders.length === 0 && <div className="text-center py-20 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">No active orders right now.</div>}
        </div>
      )}

      {/* === 2. PARTNERS TAB === */}
      {activeTab === 'partners' && (
        <div className="grid gap-6">
          {partners.map((partner) => (
            <motion.div layout key={partner.id} className="glass-panel p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1C23] shadow-lg flex justify-between items-center">
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange"><Store size={32} /></div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">{partner.businessName}</h3>
                  <p className="text-gray-500 text-sm mb-2">Owner: {partner.ownerName}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${partner.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{partner.status}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPartner(partner)} className="bg-gray-100 dark:bg-white/10 hover:bg-brand-orange hover:text-white text-gray-700 dark:text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"><Eye size={18} /> Review</button>
            </motion.div>
          ))}
          {partners.length === 0 && <div className="text-center py-20 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">No partner applications yet.</div>}
        </div>
      )}

      {/* === 3. MENU MANAGER TAB === */}
      {activeTab === 'menu' && (
        <div className="space-y-10">
          <div className="flex justify-between items-end"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Menu Items</h2><button onClick={handleRestoreDemo} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all"><Zap size={16} /> Load Demo Data</button></div>
          <div className="bg-white dark:bg-[#1A1C23] p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3"><div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange"><Plus size={24} /></div> Add New Food Item</h3>
            <form onSubmit={handleAddItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input required placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2B2D33] p-4 rounded-xl dark:text-white border outline-none focus:border-brand-orange"/>
                <input required type="number" placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2B2D33] p-4 rounded-xl dark:text-white border outline-none focus:border-brand-orange"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2B2D33] p-4 rounded-xl dark:text-white border outline-none"><option value="Pizza">Pizza</option><option value="Burger">Burger</option><option value="Salad">Salad</option><option value="Dessert">Dessert</option><option value="Pasta">Pasta</option><option value="Combo">Combo</option></select>
                <input required placeholder="Tags (spicy, gym)" value={newItem.tags} onChange={e => setNewItem({...newItem, tags: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2B2D33] p-4 rounded-xl dark:text-white border outline-none focus:border-brand-orange"/>
              </div>
              <textarea required placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2B2D33] p-4 rounded-xl dark:text-white border outline-none h-32"/>
              <div className="flex gap-4"><input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" /><button type="button" onClick={() => fileInputRef.current.click()} className="flex-1 py-4 border-2 border-dashed rounded-xl text-gray-500">Upload Image</button>{itemImage && <img src={itemImage} className="w-32 h-24 object-cover rounded-xl"/>}</div>
              <button disabled={isSubmitting} className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold">Add to Menu</button>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{menuItems.map((item) => (<div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-[#1A1C23] border shadow-sm"><img src={item.image} className="w-20 h-20 rounded-xl object-cover"/><div className="flex-1"><h3 className="font-bold dark:text-white">{item.name}</h3><p className="text-brand-orange">₹{item.price}</p></div><button onClick={() => handleDeleteItem(item.id)} className="text-red-500"><Trash2/></button></div>))}</div>
        </div>
      )}

      {/* === 4. ANALYTICS TAB (UPDATED WITH PARTNERS CARD) === */}
      {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
              {/* KEY METRICS GRID (4 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 1. REVENUE */}
                  <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-white/20 rounded-xl"><DollarSign size={24}/></div>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">+12%</span>
                      </div>
                      <p className="opacity-80 text-sm">Total Revenue</p>
                      <h3 className="text-4xl font-bold">₹{totalRevenue.toLocaleString()}</h3>
                  </div>

                  {/* 2. ORDERS */}
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-700 rounded-3xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-white/20 rounded-xl"><Activity size={24}/></div>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">Live</span>
                      </div>
                      <p className="opacity-80 text-sm">Total Orders</p>
                      <h3 className="text-4xl font-bold">{orders.length}</h3>
                  </div>

                  {/* 3. PARTNERS (NEW) */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-700 rounded-3xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-white/20 rounded-xl"><Store size={24}/></div>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">Growing</span>
                      </div>
                      <p className="opacity-80 text-sm">Kitchen Partners</p>
                      <h3 className="text-4xl font-bold">{partners.length}</h3>
                  </div>

                  {/* 4. TOP ITEM */}
                  <div className="bg-gradient-to-br from-purple-500 to-pink-700 rounded-3xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-white/20 rounded-xl"><TrendingUp size={24}/></div>
                      </div>
                      <p className="opacity-80 text-sm">Top Selling</p>
                      <h3 className="text-2xl font-bold truncate">{barData[0]?.name || "N/A"}</h3>
                  </div>
              </div>

              {/* CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg h-80"><h3 className="font-bold dark:text-white mb-4">Top Items</h3><ResponsiveContainer><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" opacity={0.1}/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="count" fill="#D97706"/></BarChart></ResponsiveContainer></div>
                  <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg h-80"><h3 className="font-bold dark:text-white mb-4">Order Status</h3><ResponsiveContainer><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div>
              </div>
          </div>
      )}

      {/* === 5. SETTINGS / ADMINS TAB === */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#1A1C23] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"><UserPlus className="text-brand-orange" /> Assign New Admin</h3>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                    <input required placeholder="Name" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2B2D33] p-3 rounded-xl dark:text-white border outline-none focus:border-brand-orange" />
                    <input required type="email" placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2B2D33] p-3 rounded-xl dark:text-white border outline-none focus:border-brand-orange" />
                    <input required type="text" placeholder="Password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2B2D33] p-3 rounded-xl dark:text-white border outline-none focus:border-brand-orange" />
                    <button className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all">Grant Access</button>
                </form>
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2"><Shield className="text-green-500" /> Active Admins</h3>
                {admins.map(admin => (
                    <div key={admin.id} className="bg-white dark:bg-[#1A1C23] p-4 rounded-xl border flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange font-bold">{admin.name ? admin.name[0] : "A"}</div><div><p className="font-bold dark:text-white">{admin.name}</p><p className="text-xs text-gray-500">{admin.email}</p></div></div>
                        <button onClick={() => handleDeleteAdmin(admin.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* PARTNER REVIEW MODAL */}
      <AnimatePresence>
        {selectedPartner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setSelectedPartner(null)}>
            <motion.div className="bg-white dark:bg-[#1A1C23] w-full max-w-lg rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
               <div className="flex justify-between items-start mb-6"><div><h2 className="text-2xl font-bold dark:text-white">{selectedPartner.businessName}</h2><p className="text-gray-500 text-sm">ID: {selectedPartner.id}</p></div><button onClick={() => setSelectedPartner(null)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full"><X size={20} className="dark:text-white" /></button></div>
               <div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl"><p className="text-xs uppercase mb-1 text-gray-500"><User size={12}/> Owner</p><p className="font-bold dark:text-white">{selectedPartner.ownerName}</p></div><div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl"><p className="text-xs uppercase mb-1 text-gray-500"><Phone size={12}/> Contact</p><p className="font-bold dark:text-white">{selectedPartner.phone || "N/A"}</p></div></div>
               <div className="mb-6"><p className="text-xs uppercase mb-2 text-gray-500">Address</p><p className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl text-sm dark:text-gray-300">{selectedPartner.address}</p></div>
               <div className="mb-8"><p className="text-xs uppercase mb-3 text-gray-500">Photos</p>{selectedPartner.images ? <div className="grid grid-cols-3 gap-2">{selectedPartner.images.map((img, i) => <img key={i} src={img} className="h-20 w-full object-cover rounded-lg border dark:border-white/10" />)}</div> : <p>No images</p>}</div>
               <div className="flex gap-4"><button onClick={() => handlePartnerAction(selectedPartner.id, "Rejected")} className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl font-bold">Reject</button><button onClick={() => handlePartnerAction(selectedPartner.id, "Approved")} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold">Approve</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default AdminDashboard;