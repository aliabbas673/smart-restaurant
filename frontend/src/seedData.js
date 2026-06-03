import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const menuItems = [
  { name: "Chicken Soup", description: "Hot & spicy chicken broth", price: 250, category: "Starters", emoji: "🍲", available: true },
  { name: "Spring Rolls", description: "Crispy veggie rolls", price: 200, category: "Starters", emoji: "🥟", available: true },
  { name: "Garlic Bread", description: "Toasted with butter & garlic", price: 150, category: "Starters", emoji: "🍞", available: true },
  { name: "Chicken Wings", description: "Spicy grilled wings", price: 350, category: "Starters", emoji: "🍗", available: true },
  { name: "French Onion Soup", description: "Classic creamy onion soup", price: 280, category: "Starters", emoji: "🧅", available: true },
  { name: "Grilled Chicken", description: "Tender grilled chicken breast", price: 850, category: "Main Course", emoji: "🍗", available: true },
  { name: "Beef Steak", description: "Juicy beef with sauce", price: 1200, category: "Main Course", emoji: "🥩", available: true },
  { name: "Pasta Alfredo", description: "Creamy white sauce pasta", price: 650, category: "Main Course", emoji: "🍝", available: true },
  { name: "Fish & Chips", description: "Crispy fish with fries", price: 750, category: "Main Course", emoji: "🐟", available: true },
  { name: "Chicken Cordon Bleu", description: "Stuffed chicken with cheese", price: 950, category: "Main Course", emoji: "🍽️", available: true },
  { name: "Zinger Burger", description: "Crispy chicken burger", price: 450, category: "Fast Food", emoji: "🍔", available: true },
  { name: "Pizza Margherita", description: "Classic tomato & cheese", price: 650, category: "Fast Food", emoji: "🍕", available: true },
  { name: "Crispy Fries", description: "Golden crispy fries", price: 200, category: "Fast Food", emoji: "🍟", available: true },
  { name: "Shawarma", description: "Spicy chicken wrap", price: 400, category: "Fast Food", emoji: "🌯", available: true },
  { name: "Hot Dog", description: "Classic beef hot dog", price: 300, category: "Fast Food", emoji: "🌭", available: true },
  { name: "Chicken Biryani", description: "Aromatic rice with chicken", price: 450, category: "Desi Food", emoji: "🍛", available: true },
  { name: "Mutton Karahi", description: "Spicy mutton karahi", price: 1200, category: "Desi Food", emoji: "🫕", available: true },
  { name: "Daal Makhani", description: "Creamy black lentils", price: 350, category: "Desi Food", emoji: "🍚", available: true },
  { name: "Nihari", description: "Slow cooked beef stew", price: 500, category: "Desi Food", emoji: "🥘", available: true },
  { name: "Chicken Handi", description: "Creamy chicken handi", price: 750, category: "Desi Food", emoji: "🍲", available: true },
  { name: "Seekh Kabab", description: "Spicy minced meat kabab", price: 550, category: "Desi Food", emoji: "🍢", available: true },
  { name: "BBQ Platter", description: "Mixed BBQ for 2", price: 1500, category: "BBQ", emoji: "🔥", available: true },
  { name: "Chicken Tikka", description: "Marinated grilled chicken", price: 800, category: "BBQ", emoji: "🍖", available: true },
  { name: "Mutton Boti", description: "Tender mutton pieces", price: 950, category: "BBQ", emoji: "🥓", available: true },
  { name: "Reshmi Kabab", description: "Soft creamy kabab", price: 700, category: "BBQ", emoji: "🍢", available: true },
  { name: "Cola", description: "Chilled soft drink", price: 100, category: "Drinks", emoji: "🥤", available: true },
  { name: "Fresh Juice", description: "Seasonal fresh juice", price: 200, category: "Drinks", emoji: "🧃", available: true },
  { name: "Lassi", description: "Sweet or salty lassi", price: 150, category: "Drinks", emoji: "🥛", available: true },
  { name: "Green Tea", description: "Healthy herbal tea", price: 120, category: "Drinks", emoji: "🍵", available: true },
  { name: "Mocktail", description: "Refreshing fruit mocktail", price: 280, category: "Drinks", emoji: "🍹", available: true },
  { name: "Gulab Jamun", description: "Soft sweet dumplings", price: 150, category: "Desserts", emoji: "🍮", available: true },
  { name: "Ice Cream", description: "3 scoops of your choice", price: 200, category: "Desserts", emoji: "🍨", available: true },
  { name: "Kheer", description: "Traditional rice pudding", price: 180, category: "Desserts", emoji: "🍧", available: true },
  { name: "Brownie", description: "Warm chocolate brownie", price: 250, category: "Desserts", emoji: "🍫", available: true },
  { name: "Fruit Trifle", description: "Layered fruit dessert", price: 220, category: "Desserts", emoji: "🍓", available: true },
];

export const seedMenuData = async () => {
  const menuRef = collection(db, "menu_items");
  for (const item of menuItems) {
    await addDoc(menuRef, item);
  }
  alert("✅ Saare items Firebase mein add ho gaye!");
};