const Cart = require('../models/cartModel');
const FoodItem = require('../models/foodItem');
const Restaurant = require('../models/restaurant');

// Add item to cart
async function addItemToCart(req, res) {
  const { userId, foodItemId, restaurantId, quantity } = req.body;
  
  try {
    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    let cart = await Cart.findOne({ user: userId });
    
    if (cart) {
      // If cart exists but from different restaurant, clear it
      if (cart.restaurant.toString() !== restaurantId) {
        await Cart.deleteOne({ _id: cart._id });
        cart = new Cart({
          user: userId,
          restaurant: restaurantId,
          items: [{ foodItem: foodItemId, quantity: quantity }]
        });
      } else {
        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
          item => item.foodItem.toString() === foodItemId
        );
        
        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          cart.items.push({ foodItem: foodItemId, quantity: quantity });
        }
      }
    } else {
      cart = new Cart({
        user: userId,
        restaurant: restaurantId,
        items: [{ foodItem: foodItemId, quantity: quantity }]
      });
    }

    await cart.save();
    
    const populatedCart = await Cart.findOne({ user: userId })
      .populate({ path: 'items.foodItem', select: 'name price images' })
      .populate({ path: 'restaurant', select: 'name' });

    res.status(200).json({
      message: 'Cart updated',
      cart: populatedCart
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error
    });
  }
}

// Update cart item quantity
async function updateCartItemQuantity(req, res) {
  const { userId, foodItemId, quantity } = req.body;
  
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'No cart found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.foodItem.toString() === foodItemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Food item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    const populatedCart = await Cart.findOne({ user: userId })
      .populate({ path: 'items.foodItem', select: 'name price images' })
      .populate({ path: 'restaurant', select: 'name' });

    res.status(200).json({
      message: 'Cart item quantity updated',
      cart: populatedCart
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error
    });
  }
}

// Delete cart item
async function deleteCartItem(req, res) {
  const { userId, foodItemId } = req.body;
  
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'No cart found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.foodItem.toString() === foodItemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Food item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    
    if (cart.items.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ message: 'Cart deleted' });
    } else {
      await cart.save();
      const populatedCart = await Cart.findOne({ user: userId })
        .populate({ path: 'items.foodItem', select: 'name price images' })
        .populate({ path: 'restaurant', select: 'name' });
      
      res.status(200).json({
        message: 'Cart item deleted',
        cart: populatedCart
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error
    });
  }
}

// Get cart items
async function getCartItem(req, res) {
  const userId = req.user;
  
  try {
    const cart = await Cart.findOne({ user: userId })
      .populate({ path: 'items.foodItem', select: 'name price images' })
      .populate({ path: 'restaurant', select: 'name' });

    if (!cart) {
      return res.status(404).json({ message: 'No cart found' });
    }

    res.status(200).json({
      status: 'success',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error
    });
  }
}

module.exports = {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItem
};
