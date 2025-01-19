import Category from '../models/categoryModel.js';
import Subcategory from '../models/subCategoryModel.js'; // Import Subcategory model

// Create a new category
const createCategory = async (req, res) => {
    try {
        console.log(req.body); 

        const { category_name } = req.body; // Updated to match schema field

        if (!category_name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const existingCategory = await Category.findOne({ category_name });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await new Category({ category_name }).save();
        res.status(201).json(category); // Use 201 for resource creation

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    try {
        const { category_name } = req.body; // Updated to match schema field
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        category.category_name = category_name;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if the category has associated subcategories
        const subcategories = await Subcategory.find({ category_id: categoryId });
        if (subcategories.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category with associated subcategories' });
        }

        await category.deleteOne();
        res.json({ message: 'Category deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single category by ID
const readCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export { createCategory, updateCategory, deleteCategory, getAllCategories, readCategory };