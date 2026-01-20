// src/firebase/seed.js
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "./config";

// Advanced Menu Data
const menuItems = [
  {
    name: "Truffle Mushroom Swirl",
    price: 450,
    category: "Pizza",
    rating: 4.8,
    isVegetarian: true,
    spiciness: 1, // 1-5 scale for AI filter
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000",
    description: "Wild mushrooms, truffle oil, mozzarella, and thyme on a sourdough crust."
  },
  {
    name: "Fiery Peri-Peri Chicken",
    price: 380,
    category: "Burgers",
    rating: 4.5,
    isVegetarian: false,
    spiciness: 4,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000",
    description: "Grilled chicken breast, spicy peri-peri sauce, jalapeños, and crisp lettuce."
  },
  {
    name: "Midnight Chocolate Lava",
    price: 220,
    category: "Desserts",
    rating: 4.9,
    isVegetarian: true,
    spiciness: 0,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1000",
    description: "Molten dark chocolate cake served with vanilla bean ice cream."
  },
  {
    name: "Spicy Paneer Wrap",
    price: 290,
    category: "Wraps",
    rating: 4.2,
    isVegetarian: true,
    spiciness: 3,
    image: "https://images.unsplash.com/photo-1564949204041-3effdbdb044e?q=80&w=1000",
    description: "Cottage cheese cubes tossed in szechuan sauce, wrapped in whole wheat roti."
  }
];

export const seedDatabase = async () => {
  try {
    const menuRef = collection(db, "menu");
    // Loop through and add each item
    for (const item of menuItems) {
      await addDoc(menuRef, item);
      console.log(`Added: ${item.name}`);
    }
    alert("Database Seeded Successfully! You can delete the seed button now.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};