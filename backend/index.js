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
import orderRoutes from "./routes/orderRoute.js";
import orderItemRoutes from "./routes/orderItemRoute.js";
import cartRoutes from "./routes/cartRoute.js";

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

// Custom middleware to conditionally parse the body
app.use((req, res, next) => {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
        // Use formidable for multipart/form-data
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }
            req.body = fields; // Attach parsed fields to req.body
            req.files = files; // Attach parsed files to req.files
            next();
        });
    } else {
        // Use express.json() or express.urlencoded() for other content types
        express.json()(req, res, next);
    }
});



app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orderItems', orderItemRoutes);
app.use('/api/cart', cartRoutes);

app.listen(port, () => {
    console.log(`server is running on ${process.env.PORT}`);
})
