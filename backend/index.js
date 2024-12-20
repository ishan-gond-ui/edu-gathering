// import express, { urlencoded } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.route.js";
// import postRoute from "./routes/post.route.js";
// import messageRoute from "./routes/message.route.js";
// import { app, server } from "./socket/socket.js";
// import path from "path";

// dotenv.config();

// const PORT = process.env.PORT || 3000;

// const __dirname = path.resolve();

// // Middlewares
// app.use(express.json()); // Parse incoming JSON requests
// app.use(cookieParser()); // Parse cookies attached to the client request object
// app.use(urlencoded({ extended: true })); // Parse URL-encoded data with extended query functionality

// const corsOptions = {
//     origin: [process.env.URL, "http://localhost:8000"], // Allow requests from specified origins (local and production)
//     credentials: true, // Allow sending cookies with requests
// };
// app.use(cors(corsOptions)); // Enable CORS with the specified options

// // API Routes
// app.use("/api/v1/user", userRoute); // User-related routes
// app.use("/api/v1/post", postRoute); // Post-related routes
// app.use("/api/v1/message", messageRoute); // Message-related routes

// // Serve static files from the 'frontend/dist' directory
// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// // Fallback to 'index.html' for all other routes
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

// // Start the server and establish database connection
// server.listen(PORT, async () => {
//     try {
//         await connectDB();
//         console.log(`Server running at port ${PORT}`);
//     } catch (err) {
//         console.error("Error connecting to the database:", err.message);
//     }
// });


import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Middlewares
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies attached to the client request object
app.use(urlencoded({ extended: true })); // Parse URL-encoded data with extended query functionality

const corsOptions = {
    origin: [process.env.URL, "http://localhost:8000"], // Allow requests from specified origins (local and production)
    credentials: true, // Allow sending cookies with requests
};
app.use(cors(corsOptions)); // Enable CORS with the specified options

// API Routes
app.use("/api/v1/user", userRoute); // User-related routes
app.use("/api/v1/post", postRoute); // Post-related routes
app.use("/api/v1/message", messageRoute); // Message-related routes

// Serve static files from the 'frontend/dist' directory
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Fallback to 'index.html' for all other routes
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server and establish database connection
server.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server running at port ${PORT}`);
    } catch (err) {
        console.error("Error connecting to the database:", err.message);
    }
});

