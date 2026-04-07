const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FoodItem = require('../models/foodItem');
const Restaurant = require('../models/restaurant');
const Cart = require('../models/cartModel');

const OPENROUTER_API_KEY = process.env.OPENAI_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'qwen/qwen3-coder';

// Load database data
const loadDatabaseData = () => {
  try {
    const foodItemsPath = path.join(__dirname, '../../Database/Internship.fooditems.json');
    const restaurantsPath = path.join(__dirname, '../../Database/Internship.restaurants.json');
    const menusPath = path.join(__dirname, '../../Database/Internship.menus.json');

    const foodItems = JSON.parse(fs.readFileSync(foodItemsPath, 'utf8'));
    const restaurants = JSON.parse(fs.readFileSync(restaurantsPath, 'utf8'));
    const menus = JSON.parse(fs.readFileSync(menusPath, 'utf8'));

    return { foodItems, restaurants, menus };
  } catch (error) {
    console.error('Error loading database data:', error);
    return { foodItems: [], restaurants: [], menus: [] };
  }
};

// Function to search for food items in database
const searchFoodItem = async (itemName) => {
  try {
    // Search in MongoDB first
    const foodItem = await FoodItem.findOne({
      name: { $regex: new RegExp(itemName, 'i') }
    }).populate('restaurant');
    
    if (foodItem) {
      // If the food item doesn't have a restaurant, try to assign one
      if (!foodItem.restaurant) {
        // Find the first available restaurant
        const defaultRestaurant = await Restaurant.findOne();
        if (defaultRestaurant) {
          foodItem.restaurant = defaultRestaurant._id;
          await foodItem.save();
          console.log(`📝 Assigned default restaurant to ${foodItem.name}`);
        }
      }
      
      return {
        found: true,
        item: foodItem,
        source: 'database'
      };
    }
    
    // If not found in MongoDB, search in JSON file
    const databaseData = loadDatabaseData();
    const jsonItem = databaseData.foodItems.find(item => 
      item.name.toLowerCase().includes(itemName.toLowerCase())
    );
    
    if (jsonItem) {
      return {
        found: true,
        item: jsonItem,
        source: 'json'
      };
    }
    
    return { found: false };
  } catch (error) {
    console.error('Error searching for food item:', error);
    return { found: false };
  }
};

// Function to add item to cart
const addToCart = async (userId, foodItem, quantity = 1) => {
  try {
    // Validate inputs
    if (!userId || userId === 'guest') {
      return { 
        success: false, 
        message: 'Please log in to add items to cart. Guest users cannot add items to cart.' 
      };
    }

    if (!foodItem || !foodItem.item) {
      return { success: false, message: 'Invalid food item data' };
    }

    // For database items, use the cart system
    if (foodItem.source === 'database') {
      // Check if food item has restaurant data
      if (!foodItem.item.restaurant) {
        // Try to find a default restaurant
        const defaultRestaurant = await Restaurant.findOne();
        if (defaultRestaurant) {
          foodItem.item.restaurant = defaultRestaurant._id;
          await foodItem.item.save();
          console.log(`📝 Assigned default restaurant to ${foodItem.item.name} for cart`);
        } else {
          return { 
            success: false, 
            message: 'This item is not associated with a restaurant. Please try a different item.' 
          };
        }
      }

      // Use the existing cart system
      const cart = await Cart.findOne({ user: userId });
      
      if (cart) {
        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
          item => item.foodItem.toString() === foodItem.item._id.toString()
        );
        
        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          cart.items.push({ foodItem: foodItem.item._id, quantity: quantity });
        }
        await cart.save();
      } else {
        // Create new cart - ensure restaurant field is set
        const newCart = new Cart({
          user: userId,
          restaurant: foodItem.item.restaurant, // This should be the restaurant ObjectId
          items: [{ foodItem: foodItem.item._id, quantity: quantity }]
        });
        
        // Validate the cart before saving
        const validationError = newCart.validateSync();
        if (validationError) {
          console.error('Cart validation error:', validationError);
          return { 
            success: false, 
            message: 'Unable to create cart due to missing restaurant information. Please try again.' 
          };
        }
        
        await newCart.save();
      }
      
      return { success: true, message: 'Item added to cart successfully!' };
    } else {
      // For JSON items, provide helpful message
      return { 
        success: false, 
        message: `Found "${foodItem.item.name}" (₹${foodItem.item.price}) in our menu! Please add it to your cart manually.` 
      };
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, message: `Error adding item to cart: ${error.message}` };
  }
};

// Function to process order commands
const processOrderCommand = async (message, userId) => {
  // Check if message contains "order" keyword
  const orderMatch = message.toLowerCase().match(/order\s+(.+)/);
  if (!orderMatch) return null;
  
  const itemName = orderMatch[1].trim();
  
  // Search for the food item
  const searchResult = await searchFoodItem(itemName);
  
  if (searchResult.found) {
    // Add to cart
    const cartResult = await addToCart(userId, searchResult, 1);
    
    if (cartResult.success) {
      return {
        type: 'order_success',
        message: `✅ Successfully added "${searchResult.item.name}" (₹${searchResult.item.price}) to your cart!`,
        item: searchResult.item,
        showViewCartButton: true
      };
    } else {
      return {
        type: 'order_info',
        message: cartResult.message,
        item: searchResult.item
      };
    }
  } else {
    return {
      type: 'order_not_found',
      message: `Sorry, I couldn't find "${itemName}" in our menu. Please check the spelling or try a different item.`
    };
  }
};

// Create context from database data
const createDatabaseContext = (data) => {
  const { foodItems, restaurants, menus } = data;
  
  let context = `You are a helpful and friendly food ordering assistant. Your responses should be:

1. **Structured and User-Friendly**: Use clear sections, bullet points, and emojis
2. **Informative**: Provide relevant details about food items, restaurants, and menus
3. **Helpful**: Guide users to make informed decisions
4. **Professional yet Friendly**: Be warm and welcoming

Here's the available data:

🍽️ FOOD ITEMS (${foodItems.length} items):
${foodItems.map(item => `• ${item.name} - ₹${item.price} - ⭐${item.ratings}/5 - ${item.description.substring(0, 100)}...`).join('\n')}

🏪 RESTAURANTS (${restaurants.length} restaurants):
${restaurants.map(restaurant => `• ${restaurant.name} - ${restaurant.isVeg ? '🥬 Veg' : '🍖 Non-Veg'} - ⭐${restaurant.ratings}/5 (${restaurant.numOfReviews} reviews) - 📍${restaurant.address}`).join('\n')}

📋 MENU CATEGORIES:
${menus.map(menu => menu.menu.map(category => `• ${category.category} (${category.items.length} items)`).join('\n')).join('\n')}

**Response Guidelines:**
- Use emojis to make responses engaging (🍕, 🍔, ⭐, 💰, etc.)
- Structure information with clear headings and bullet points
- Include prices, ratings, and key details
- Be encouraging and helpful
- If asked about specific items, provide detailed information
- If asked about recommendations, suggest based on ratings and popularity
- If users want to order, tell them they can say "order [item name]" to add items to cart`;

  return context;
};

// Format the bot response to be more user-friendly
const formatBotResponse = (response) => {
  // Add emojis and structure to common responses
  const formattedResponse = response
    .replace(/restaurants/gi, '🏪 Restaurants')
    .replace(/food items/gi, '🍽️ Food Items')
    .replace(/menu/gi, '📋 Menu')
    .replace(/price/gi, '💰 Price')
    .replace(/rating/gi, '⭐ Rating')
    .replace(/vegetarian/gi, '🥬 Vegetarian')
    .replace(/non-vegetarian/gi, '🍖 Non-Vegetarian')
    .replace(/delicious/gi, '😋 Delicious')
    .replace(/popular/gi, '🔥 Popular')
    .replace(/best/gi, '🏆 Best')
    .replace(/recommend/gi, '💡 Recommend');

  return formattedResponse;
};

exports.chatWithBot = async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if this is an order command
    const orderResult = await processOrderCommand(message, userId);
    
    if (orderResult) {
      // Return order-specific response
      return res.json({
        reply: orderResult.message,
        type: orderResult.type,
        item: orderResult.item,
        showViewCartButton: orderResult.showViewCartButton || false
      });
    }

    // Load database data
    const databaseData = loadDatabaseData();
    const context = createDatabaseContext(databaseData);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Online Food Ordering Chatbot',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: message }
        ],
        max_tokens: 400,
        temperature: 0.8,
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data.error || 'OpenRouter API error' });
    }

    const botReply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    
    if (botReply) {
      const formattedReply = formatBotResponse(botReply);
      res.json({ reply: formattedReply });
    } else {
      res.json({ 
        reply: `🤖 Hi there! I'm your food ordering assistant! 

I can help you with:
• 🍽️ Food items and their details
• 🏪 Restaurant information and ratings  
• 💰 Prices and menu categories
• ⭐ Recommendations based on ratings
• 🥬 Vegetarian/Non-vegetarian options
• 🛒 Order items by saying "order [item name]"

What would you like to know about our delicious food options? 😊` 
      });
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an issue. Please try again! ��' 
    });
  }
}; 