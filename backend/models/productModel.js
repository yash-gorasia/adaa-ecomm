import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    styleCode: { type: String, required: true },
    description: { type: String },
    MRP: { type: Number, required: true },
    discount: { type: Number },
    CurrentPrice: { type: Number },
    reviews: { type: Schema.Types.ObjectId, ref: 'Review' },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory_id: { type: Schema.Types.ObjectId, ref: 'Subcategory' }, // Optional
    color: { type: String, required: true },
    FabricCare: { type: String },
    Pattern: { type: String },
    type: { type: String },
    Fabric: { type: String },
    lengthType: { type: String },
    idealFor: { type: String },
    style: { type: String },
    neck: { type: String },
    sleeve: { type: String },
    brand: { type: String },
    tags: { type: String },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;