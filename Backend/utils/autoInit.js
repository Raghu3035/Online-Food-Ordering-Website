const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const FoodItem = require('../models/foodItem');
const Restaurant = require('../models/restaurant');

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

// Check if database needs initialization
const checkDatabaseStatus = async () => {
  try {
    const foodItemsCount = await FoodItem.countDocuments();
    const restaurantsCount = await Restaurant.countDocuments();
    
    return {
      needsInit: foodItemsCount === 0 || restaurantsCount === 0,
      foodItemsCount,
      restaurantsCount
    };
  } catch (error) {
    console.error('Error checking database status:', error);
    return { needsInit: true, foodItemsCount: 0, restaurantsCount: 0 };
  }
};

// Initialize database automatically
const autoInitializeDatabase = async () => {
  try {
    console.log('🔍 Checking database status...');
    
    const status = await checkDatabaseStatus();
    
    if (status.needsInit) {
      console.log('📊 Database needs initialization...');
      console.log(`   Current food items: ${status.foodItemsCount}`);
      console.log(`   Current restaurants: ${status.restaurantsCount}`);
      
      // Load JSON data
      const { foodItems, restaurants } = loadJSONData();
      
      if (foodItems.length === 0 || restaurants.length === 0) {
        console.log('⚠️ No data found in JSON files, skipping initialization');
        return;
      }
      
      console.log(`🌱 Auto-initializing database with ${foodItems.length} food items and ${restaurants.length} restaurants...`);
      
      // Seed restaurants first
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
      
      // Get the first restaurant as default for items without restaurant
      const defaultRestaurantId = restaurantMap.values().next().value;
      console.log(`🏪 Using default restaurant ID: ${defaultRestaurantId}`);
      
      // Seed food items with proper restaurant linking
      let seededCount = 0;
      let itemsWithoutRestaurant = 0;
      
      for (const item of foodItems) {
        // Find corresponding restaurant
        let restaurantId = restaurantMap.get(item.restaurant?.$oid);
        
        // If no restaurant found, use default restaurant
        if (!restaurantId) {
          restaurantId = defaultRestaurantId;
          itemsWithoutRestaurant++;
        }
        
        if (!restaurantId) {
          console.warn(`⚠️ No restaurant available for item: ${item.name}, skipping...`);
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
          restaurant: restaurantId, // Ensure this is properly set
          menu: null,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
        });
        
        await newFoodItem.save();
        seededCount++;
      }
      
      console.log(`✅ Seeded ${seededCount} food items`);
      if (itemsWithoutRestaurant > 0) {
        console.log(`📝 Assigned default restaurant to ${itemsWithoutRestaurant} items`);
      }
      console.log('🎉 Database auto-initialization completed successfully!');
    } else {
      console.log('✅ Database is already initialized and ready');
      console.log(`   Food items: ${status.foodItemsCount}`);
      console.log(`   Restaurants: ${status.restaurantsCount}`);
    }
  } catch (error) {
    console.error('❌ Database auto-initialization failed:', error);
    console.error('The chatbot will still work with JSON fallback');
  }
};

module.exports = { autoInitializeDatabase }; 