import Product from "../models/productModel.js";
import Size from "../models/sizeModel.js";

// Add a new product
const addProduct = async (req, res) => {
    try {
        const {
            name,
            image,
            description,
            styleCode,
            MRP,
            discount,
            CurrentPrice,
            category_id,
            subcategory_id,
            tags,
            is_active,
            color
        } = req.fields;

        // Reconstruct the sizes array from flattened keys
        const sizes = [];
        for (const key in req.fields) {
            if (key.startsWith('sizes[')) {
                const match = key.match(/sizes\[(\d+)\]\[(\w+)\]/);
                if (match) {
                    const index = match[1]; // e.g., 0, 1
                    const field = match[2]; // e.g., sizeName, stock

                    if (!sizes[index]) {
                        sizes[index] = {}; // Initialize the object if it doesn't exist
                    }

                    sizes[index][field] = req.fields[key]; // Assign the value
                }
            }
        }

        // Clean and convert numeric fields
        const cleanedMRP = parseFloat(MRP.replace(/,/g, ''));
        const cleanedDiscount = parseFloat(discount.replace(/,/g, ''));
        const cleanedCurrentPrice = parseFloat(CurrentPrice.replace(/,/g, ''));

        // Validation
        switch (true) {
            case !name:
                return res.json({ error: "Name is required" });
            case !MRP:
                return res.json({ error: "MRP is required" });
            case !category_id:
                return res.json({ error: "Category ID is required" });
        }

        // Create a new product
        const product = new Product({
            name,
            image,
            description,
            styleCode,
            MRP: cleanedMRP,
            discount: cleanedDiscount,
            CurrentPrice: cleanedCurrentPrice,
            category_id,
            subcategory_id,
            tags,
            is_active,
            color
        });

        // Save the product to the database
        await product.save();

        // Add sizes for the product (if provided)
        if (sizes.length > 0) {
            const sizeDocuments = sizes.map(size => ({
                sizeName: size.sizeName,
                stock: parseInt(size.stock, 10), // Convert stock to a number
                product_id: product._id // Link the size to the product
            }));
            await Size.insertMany(sizeDocuments);
        }

        // Fetch the sizes for the product
        const productSizes = await Size.find({ product_id: product._id });

        // Include the sizes in the response
        const productWithSizes = {
            ...product.toObject(),
            sizes: productSizes
        };

        res.status(201).json(productWithSizes);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
};

// Update product details
const updateProductDetails = async (req, res) => {
    try {
        const {
            name,
            image,
            description,
            styleCode,
            MRP,
            discount,
            CurrentPrice,
            category_id,
            subcategory_id,
            color,
            tags,
            is_active
        } = req.fields;

        const sizes = [];
        for (const key in req.fields) {
            if (key.startsWith('sizes[')) {
                const match = key.match(/sizes\[(\d+)\]\[(\w+)\]/);
                if (match) {
                    const index = match[1]; // e.g., 0, 1
                    const field = match[2]; // e.g., sizeName, stock

                    if (!sizes[index]) {
                        sizes[index] = {}; // Initialize the object if it doesn't exist
                    }

                    sizes[index][field] = req.fields[key]; // Assign the value
                }
            }
        }

        // Clean and convert numeric fields
        const cleanedMRP = parseFloat(MRP.replace(/,/g, ''));
        const cleanedDiscount = parseFloat(discount.replace(/,/g, ''));
        const cleanedCurrentPrice = parseFloat(CurrentPrice.replace(/,/g, ''));

        // Validation
        switch (true) {
            case !name:
                return res.json({ error: "Name is required" });
            case !MRP:
                return res.json({ error: "MRP is required" });
            case !category_id:
                return res.json({ error: "Category ID is required" });
        }

        // Update product fields
        const updatedFields = {
            name,
            image,
            description,
            styleCode,
            MRP: cleanedMRP,
            discount: cleanedDiscount,
            CurrentPrice: cleanedCurrentPrice,
            category_id,
            subcategory_id,
            color,
            tags,
            is_active
        };

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );

        // Update sizes for the product
        if (sizes && sizes.length > 0) {
            // Delete existing sizes for the product
            await Size.deleteMany({ product_id: product._id });

            // Add new sizes
            const sizeDocuments = sizes.map(size => ({
                sizeName: size.sizeName,
                stock: size.stock,
                product_id: product._id
            }));
            await Size.insertMany(sizeDocuments);
        }

        res.status(201).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Remove a product
const removeProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        // Delete associated sizes
        await Size.deleteMany({ product_id: req.params.id });

        res.status(201).json({ message: "Product removed successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch products with search
const fetchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: "i" } },
                    { description: { $regex: req.query.keyword, $options: "i" } },
                    { category: { $regex: req.query.keyword, $options: "i" } },
                    { subcategory: { $regex: req.query.keyword, $options: "i" } },
                    { brand: { $regex: req.query.keyword, $options: "i" } },
                    { tags: { $regex: req.query.keyword, $options: "i" } },
                ],
            }
            : {};

        const products = await Product.find({ ...keyword });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

// Fetch a single product by ID with sizes
const fetchProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const sizes = await Size.find({ product_id: req.params.id });

        if (product) {
            return res.json({ ...product.toObject(), sizes });
        } else {
            res.status(404);
            throw new Error("Product not found");
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Product not found" });
    }
};

// Fetch all products with sizes
const fetchAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate("category_id");
        const productsWithSizes = await Promise.all(products.map(async (product) => {
            const sizes = await Size.find({ product_id: product._id });
            return { ...product.toObject(), sizes };
        }));

        res.json(productsWithSizes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

// Fetch all products by category with sizes
const fetchProductsByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;

        // Validate if the category exists
        const category = await Category.findById(category_id);
        if (!category) {
            res.status(404);
            throw new Error("Category not found");
        }

        // Fetch products by category_id
        const products = await Product.find({ category_id }).populate("category_id");
        const productsWithSizes = await Promise.all(products.map(async (product) => {
            const sizes = await Size.find({ product_id: product._id });
            return { ...product.toObject(), sizes };
        }));

        res.json(productsWithSizes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

// Fetch all products by subcategory with sizes
const fetchProductsBySubcategory = async (req, res) => {
    try {
        const { subcategory_id } = req.params;

        // Validate if the subcategory exists
        const subcategory = await Subcategory.findById(subcategory_id);
        if (!subcategory) {
            res.status(404);
            throw new Error("Subcategory not found");
        }

        // Fetch products by subcategory_id
        const products = await Product.find({ subcategory_id }).populate("subcategory_id");
        const productsWithSizes = await Promise.all(products.map(async (product) => {
            const sizes = await Size.find({ product_id: product._id });
            return { ...product.toObject(), sizes };
        }));

        res.json(productsWithSizes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};


export {
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    fetchProductsByCategory,
    fetchProductsBySubcategory
};