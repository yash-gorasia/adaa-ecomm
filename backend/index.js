import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import formidable from "express-formidable";
import path from "path";

//utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import subcategoryRoutes from "./routes/subcategoryRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import orderItemRoutes from "./routes/orderItemRoute.js";
import cartRoutes from "./routes/cartRoute.js";

import uploadRoutes from './routes/uploadRoute.js';

dotenv.config();

const port = process.env.PORT || 8000

connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Allow request from frontend
    credentials: true
}))


// app.use(formidable());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Middleware for handling JSON requests
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orderItems', orderItemRoutes);
app.use('/api/cart', cartRoutes);

app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));

app.listen(port, () => {
    console.log(`server is running on ${process.env.PORT}`);
})
