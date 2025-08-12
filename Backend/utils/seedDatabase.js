const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const FoodItem = require('../models/foodItem');
const Restaurant = require('../models/restaurant');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-ordering');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Load JSON data
const loadJSONData = () => {
  try {
    const foodItemsPath = path.join(__dirname, '../../Database/Internship.fooditems.json');
    const restaurantsPath = path.join(__dirname, '../../Database/Internship.restaurants.json');
    
    const foodItems = JSON.parse(fs.readFileSync(foodItemsPath, 'utf8'));
    const restaurants = JSON.parse(fs.readFileSync(restaurantsPath, 'utf8'));
    
    return { foodItems, restaurants };
  } catch (error) {
    console.error('Error loading JSON data:', error);
    return { foodItems: [], restaurants: [] };
  }
};

// Seed restaurants first
const seedRestaurants = async (restaurants) => {
  try {
    // Clear existing restaurants
    await Restaurant.deleteMany({});
    
    const restaurantMap = new Map();
    
    for (const restaurant of restaurants) {
      const newRestaurant = new Restaurant({
        name: restaurant.name,
        description: restaurant.description || 'Delicious food restaurant',
        address: restaurant.address,
        phone: restaurant.phone || '+91-1234567890',
        email: restaurant.email || 'restaurant@example.com',
        ratings: restaurant.ratings || 4.0,
        numOfReviews: restaurant.numOfReviews || 0,
        isVeg: restaurant.isVeg || false,
        images: restaurant.images || [],
        category: restaurant.category || 'General',
        deliveryTime: restaurant.deliveryTime || '30-45 min',
        deliveryFee: restaurant.deliveryFee || 0,
        minimumOrder: restaurant.minimumOrder || 0,
        isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true
      });
      
      const savedRestaurant = await newRestaurant.save();
      restaurantMap.set(restaurant._id.$oid, savedRestaurant._id);
    }
    
    console.log(`✅ Seeded ${restaurants.length} restaurants`);
    return restaurantMap;
  } catch (error) {
    console.error('Error seeding restaurants:', error);
    return new Map();
  }
};

// Seed food items
const seedFoodItems = async (foodItems, restaurantMap) => {
  try {
    // Clear existing food items
    await FoodItem.deleteMany({});
    
    let seededCount = 0;
    
    for (const item of foodItems) {
      // Find corresponding restaurant
      const restaurantId = restaurantMap.get(item.restaurant?.$oid);
      
      if (!restaurantId) {
        console.warn(`⚠️ Restaurant not found for item: ${item.name}`);
        continue;
      }
      
      const newFoodItem = new FoodItem({
        name: item.name,
        price: item.price,
        description: item.description,
        ratings: item.ratings || 4.0,
        images: item.images || [],
        stock: item.stock || 100,
        numOfReviews: item.numOfReviews || 0,
        reviews: item.reviews || [],
        restaurant: restaurantId,
        menu: null, // Will be set later if needed
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
      });
      
      await newFoodItem.save();
      seededCount++;
    }
    
    console.log(`✅ Seeded ${seededCount} food items`);
  } catch (error) {
    console.error('Error seeding food items:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Load JSON data
    const { foodItems, restaurants } = loadJSONData();
    
    if (foodItems.length === 0 || restaurants.length === 0) {
      console.error('❌ No data found in JSON files');
      process.exit(1);
    }
    
    console.log(`📊 Found ${foodItems.length} food items and ${restaurants.length} restaurants`);
    
    // Seed restaurants first
    const restaurantMap = await seedRestaurants(restaurants);
    
    // Seed food items
    await seedFoodItems(foodItems, restaurantMap);
    
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 