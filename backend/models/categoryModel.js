import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    category_name: { type: String, required: true, unique: true },
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
export default Category;