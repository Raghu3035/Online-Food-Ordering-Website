🍔 Intelligent Food Ordering System with AI Personalization
📌 Overview

The Intelligent Food Ordering System is a full-stack web application designed to enhance the traditional food ordering experience by integrating AI-based interaction, automation, and seamless user workflows. The system allows users to browse restaurants, order food, make secure payments, and interact with an intelligent chatbot for recommendations.

This project focuses on improving user convenience, personalization, and system scalability using modern web technologies.

🚀 Features
🔐 Authentication System
User registration and login
Secure password hashing
JWT-based authentication
Forgot password with email reset link (Gmail integration)
🔍 Search & Browse
Search for restaurants and food items
View restaurant menus
Dynamic filtering and selection
🛒 Cart Management
Add items to cart
Remove/update items dynamically
Real-time cart updates
🤖 AI Chatbot (Key Feature)
Interactive chatbot powered by OpenAI API
Provides food recommendations
Helps users navigate the system
Smart ordering:
Using the keyword “order + item name”
Automatically selects top-rated food item
Adds it directly to the cart
💳 Payment Integration
Stripe payment gateway (Test Mode)
Secure checkout process
Address and order confirmation
📦 Order Management
Place and track orders
View order history
Order status updates (Processing → Delivered)
⭐ Review System
Users can review food after delivery
Feedback mechanism for improvement
📧 Email Notifications
Order confirmation emails
Password reset emails
Gmail authentication integration
🛠️ Tech Stack
Frontend
React.js
Backend
Node.js
Express.js
Database
MongoDB (MongoDB Compass)
APIs & Integrations
OpenAI API (Chatbot)
Stripe API (Payment Gateway)
Gmail Authentication (Email Services)
🧱 System Architecture

The project follows a RESTful API architecture with MVC pattern:

Frontend (React) → User Interface
Backend (Node.js/Express) → Business Logic
Database (MongoDB) → Data Storage
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2️⃣ Backend Setup
cd backend
npm install
npm start
3️⃣ Frontend Setup
cd frontend
npm install
npm start
🔑 Environment Variables

Create a .env file in the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
🔄 Application Workflow
User registers or logs in
Searches for food or restaurants
Interacts with chatbot (optional)
Adds items to cart
Proceeds to checkout
Makes payment via Stripe
Receives order confirmation email
Tracks order in “My Orders”
Reviews food after delivery
💡 Key Highlights
Full-stack scalable architecture
AI-powered chatbot integration
Smart food recommendation system
Secure authentication and payment handling
Real-world application design
⚠️ Limitations
Chatbot is dependent on API usage (cost & latency)
Stripe is in test mode
Limited personalization (can be enhanced with ML models)
📜 License
This project is for academic and educational purposes.

⭐ If you like this project, don’t forget to star the repo!
