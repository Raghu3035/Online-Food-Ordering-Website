🍽️ Online Food Ordering Website (MERN Stack)

A full-stack Online Food Ordering System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).
This application allows users to browse food items, register/login, add to cart, place orders, and for admins to manage food items and orders.

🧱 Table of Contents
1. 📖 About the Project
2. 🚀 Features
3. 🧰 Tech Stack
4. 📁 Project Structure
5. 🔧 Getting Started
   Requirements
   Environment Setup
6. ▶️ Running the App
7. 🗄️ Database Setup
8. 📡 API Endpoints
9. 🎨 Screenshots
10. 🤝 Contributing
11. 📄 License

📖 About the Project
This repository contains a complete full-stack online food ordering application. It is designed to simulate a real-world online ordering experience where users can browse menus, add items to a cart, and checkout, while administrators can manage products and orders.
The project is built with the MERN Stack:
. Frontend: React.js (or another JavaScript UI)
. Backend: Node.js with Express.js
. Database: MongoDB
. Authentication: JWT
. API: RESTful routes

🚀 Features
✅ User registration & login
✅ View food items & categories
✅ Add items to cart
✅ Place orders & view order history
✅ Admin panel for managing products & orders
✅ JWT-based authentication
✅ Responsive UI for mobile & desktop

🧰 Tech Stack
Layer	Technology
Frontend	React.js (React Router, Context/Redux)
Backend	Node.js, Express.js
Database	MongoDB (Mongoose)
Auth	JSON Web Tokens (JWT)
Styling	CSS / Component library

🔧 Getting Started
📌 Prerequisites
Install the following tools:
Node.js (v14+)
npm or yarn
MongoDB (local or Atlas)

⚙️ Backend Setup
Open terminal and navigate:
cd Online-Food-Ordering-Website/Backend
Install dependencies:
npm install
Create a .env file like:
PORT=5000
MONGO_URI=<Your_MongoDB_URI>
JWT_SECRET=<Your_Secret_Key>

Run the backend:
npm start
⚙️ Frontend Setup
Navigate to frontend:
cd ../Frontend
Install dependencies:
npm install
Create .env if needed (e.g., for API base URL):
REACT_APP_API_URL=http://localhost:5000/api

Start the frontend:
npm start
Frontend app should open at:
http://localhost:3000

🗄️ Database Setup
MongoDB (Atlas or Local)
Create a MongoDB database (e.g., food_ordering_db)
Update your backend .env with MONGO_URI

🤝 Contributing
Thanks for checking out this project! You’re encouraged to contribute improvements.
Fork this repository
Create your feature branch
Commit and push
Open a pull request
