import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import formidable from "express-formidable";

//utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import subcategoryRoutes from "./routes/subcategoryRoute.js";

dotenv.config();

const port = process.env.PORT || 8000

connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Allow request from frontend
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(formidable());


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);


app.listen(port, () => {
    console.log(`server is running on ${process.env.PORT}`);
})
