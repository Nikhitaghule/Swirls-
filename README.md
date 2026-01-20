# 🍕 Swirls - AI-Powered Food Delivery Platform

**Swirls** is a full-stack food delivery application that goes beyond simple ordering. It features a unique **"AI Mood Chef"** that recommends food based on how the user is feeling, real-time order tracking, and a comprehensive ecosystem for Customers, Restaurant Partners, and Admins.

![Project Screenshot](https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop)

## 🚀 Key Features

### 👤 Customer App
* **AI Mood Chef:** A smart recommendation engine that suggests meals based on mood (e.g., "Sad", "Gym", "Party").
* **Real-Time Tracking:** Live order status updates using Firebase Firestore listeners.
* **Cart & Checkout:** Fully functional cart with persistent state and delivery address management.
* **User Profile:** Order history with search functionality and status tracking.

### 🏢 Restaurant Partner Portal
* **Digital Onboarding:** Multi-step registration form for new kitchens.
* **Application Tracking:** Real-time status check (Pending/Approved/Rejected) for applicants.

### 🛡️ Admin Dashboard
* **Live Operations:** View and manage incoming orders (Cooking -> Out for Delivery -> Delivered).
* **Menu Manager:** Add, edit, or delete food items dynamically.
* **Partner Management:** Review and approve/reject kitchen applications.
* **Analytics:** Visual charts for Revenue, Order Volume, and Top Selling Items.
* **Role Management:** Assign and revoke Admin access.

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Database & Auth:** Firebase (Firestore, Authentication)
* **State Management:** Zustand
* **Charts:** Recharts
* **Icons:** Lucide React

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/swirls-delivery.git](https://github.com/your-username/swirls-delivery.git)
    cd swirls-delivery
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Firebase Setup**
    * Create a project on [Firebase Console](https://console.firebase.google.com/).
    * Enable **Authentication** (Google & Email/Password).
    * Enable **Firestore Database**.
    * Copy your config keys into `src/firebase/config.js`.

4.  **Run the App**
    ```bash
    npm run dev
    ```


*