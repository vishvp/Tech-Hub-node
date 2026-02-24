const mongoose = require("mongoose");
const Stock = require("../models/Stock");
const Product = require("../models/Product");

// 🔥 CREATE STOCK (IN & OUT)
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
            data: stock,
            updated_stock: product.current_stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔥 GET ALL
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


// 🔥 DELETE (Revert)
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
            message: "Stock deleted successfully",
            updated_stock: product.current_stock
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
