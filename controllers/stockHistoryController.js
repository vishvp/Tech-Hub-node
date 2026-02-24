const mongoose = require("mongoose");
const StockHistory = require("../models/StockHistory");
const Product = require("../models/Product");


// 🔥 CREATE
exports.createStockHistory = async (req, res) => {
    try {

        let { product_id, type, quantity } = req.body;
        quantity = Number(quantity);

        if (!mongoose.Types.ObjectId.isValid(product_id)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }

        const product = await Product.findById(product_id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // STOCK LOGIC
        if (type === "in") {
            product.current_stock += quantity;
        } else {
            if (product.current_stock < quantity) {
                return res.status(400).json({
                    message: "Insufficient stock"
                });
            }
            product.current_stock -= quantity;
        }

        await product.save();

        const stock = await StockHistory.create({
            ...req.body,
            quantity
        });

        res.status(201).json({
            success: true,
            data: stock,
            updated_stock: product.current_stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 GET ALL
exports.getStockHistory = async (req, res) => {
    try {

        const data = await StockHistory.find()
            .populate({
                path: "product_id",
                select: "product_name",
                populate: {
                    path: "brand_id",
                    select: "brand_name"
                }
            })
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 UPDATE
exports.updateStockHistory = async (req, res) => {
    try {

        const record = await StockHistory.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        const product = await Product.findById(record.product_id);

        // revert old
        if (record.type === "in") {
            product.current_stock -= record.quantity;
        } else {
            product.current_stock += record.quantity;
        }

        let { type, quantity } = req.body;
        quantity = Number(quantity);

        if (type === "in") {
            product.current_stock += quantity;
        } else {
            if (product.current_stock < quantity) {
                return res.status(400).json({
                    message: "Insufficient stock after update"
                });
            }
            product.current_stock -= quantity;
        }

        await product.save();

        const updated = await StockHistory.findByIdAndUpdate(
            req.params.id,
            { ...req.body, quantity },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updated
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 DELETE
exports.deleteStockHistory = async (req, res) => {
    try {

        const record = await StockHistory.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        const product = await Product.findById(record.product_id);

        if (record.type === "in") {
            product.current_stock -= record.quantity;
        } else {
            product.current_stock += record.quantity;
        }

        await product.save();
        await record.deleteOne();

        res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};