const mongoose = require("mongoose");
const Stock = require("../models/Stock");
const Product = require("../models/Product");

// 🔥 CREATE
exports.createStock = async (req, res) => {
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

        await product.save();

        const stock = await Stock.create({
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


// 🔥 READ ALL
exports.getStocks = async (req, res) => {
    try {

        const stocks = await Stock.find()
            .populate({
                path: "product_id",
                select: "product_name",
                populate: {
                    path: "brand_id",
                    select: "brand_name"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: stocks
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 UPDATE
exports.updateStock = async (req, res) => {
    try {

        const stock = await Stock.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const product = await Product.findById(stock.product_id);

        // revert old
        if (stock.type === "in") {
            product.current_stock -= stock.quantity;
        } else {
            product.current_stock += stock.quantity;
        }

        let { type, quantity } = req.body;
        quantity = Number(quantity);

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

        const updated = await Stock.findByIdAndUpdate(
            req.params.id,
            { ...req.body, quantity },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updated,
            updated_stock: product.current_stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 DELETE
exports.deleteStock = async (req, res) => {
    try {

        const stock = await Stock.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const product = await Product.findById(stock.product_id);

        if (stock.type === "in") {
            product.current_stock -= stock.quantity;
        } else {
            product.current_stock += stock.quantity;
        }

        await product.save();
        await stock.deleteOne();

        res.status(200).json({
            success: true,
            message: "Deleted successfully",
            updated_stock: product.current_stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
