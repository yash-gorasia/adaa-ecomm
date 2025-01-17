import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    MRP: { type: Number, required: true },
    discount: { type: Number },
    CurrentPrice: { type: Number },
    reviews: { type: Schema.Types.ObjectId, ref: 'Review' },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
    stocks: { type: Number, required: true },
    availablesize: { type: String },
    brand: { type: String },
    tags: { type: String },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;