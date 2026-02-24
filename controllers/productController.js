const Product = require("../models/Product");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("cat_id", "name")
            .populate("brand_id", "brand_name")
            .sort({ create_update: -1 });

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("cat_id", "name")
            .populate("brand_id", "brand_name");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
