const mongoose = require("mongoose");
const Stock = require("../models/Stock");
const Product = require("../models/Product");


// 🔥 CREATE STOCK
exports.createStock = async (req, res) => {
    try {

        let { product_id, type, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(product_id)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }

        quantity = Number(quantity);

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // STOCK LOGIC
        if (type === "in") {
            product.current_stock += quantity;
        }
        else if (type === "out") {

            if (product.current_stock < quantity) {
                return res.status(400).json({
                    message: "Insufficient stock"
                });
            }

            product.current_stock -= quantity;
        }
        else {
            return res.status(400).json({
                message: "Invalid stock type"
            });
        }

        await product.save();

        const stock = await Stock.create({
            ...req.body,
            quantity
        });

        res.status(201).json({
            success: true,
            message: "Stock created successfully",
            data: stock,
            updated_stock: product.current_stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 GET ALL STOCK
exports.getStocks = async (req, res) => {
    try {

        const stocks = await Stock.find()
            .populate("product_id", "product_name current_stock")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: stocks
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 GET SINGLE STOCK
exports.getStock = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Stock ID" });
        }

        const stock = await Stock.findById(req.params.id)
            .populate("product_id", "product_name current_stock");

        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        res.status(200).json({
            success: true,
            data: stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 UPDATE STOCK
exports.updateStock = async (req, res) => {
    try {

        const stockId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(stockId)) {
            return res.status(400).json({ message: "Invalid Stock ID" });
        }

        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const product = await Product.findById(stock.product_id);

        // Revert old effect
        if (stock.type === "in") {
            product.current_stock -= stock.quantity;
        } else {
            product.current_stock += stock.quantity;
        }

        let { type, quantity } = req.body;
        quantity = Number(quantity);

        // Apply new effect
        if (type === "in") {
            product.current_stock += quantity;
        }
        else if (type === "out") {

            if (product.current_stock < quantity) {
                return res.status(400).json({
                    message: "Insufficient stock after update"
                });
            }

            product.current_stock -= quantity;
        }

        await product.save();

        const updatedStock = await Stock.findByIdAndUpdate(
            stockId,
            { ...req.body, quantity },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: updatedStock,
            updated_stock: product.current_stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 DELETE STOCK
exports.deleteStock = async (req, res) => {
    try {

        const stock = await Stock.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const product = await Product.findById(stock.product_id);

        // Revert stock
        if (stock.type === "in") {
            product.current_stock -= stock.quantity;
        } else {
            product.current_stock += stock.quantity;
        }

        await product.save();
        await stock.deleteOne();

        res.status(200).json({
            success: true,
            message: "Stock deleted successfully",
            updated_stock: product.current_stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
