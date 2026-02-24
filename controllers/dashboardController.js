const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Stock = require("../models/Stock");

exports.getDashboardData = async (req, res) => {
    try {

        // 1️⃣ Total Counts
        const totalBrands = await Brand.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalProducts = await Product.countDocuments();

        // 2️⃣ Total Stock IN & OUT
        const stockIn = await Stock.aggregate([
            { $match: { type: "in" } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        const stockOut = await Stock.aggregate([
            { $match: { type: "out" } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        const totalStockIn = stockIn.length > 0 ? stockIn[0].total : 0;
        const totalStockOut = stockOut.length > 0 ? stockOut[0].total : 0;

        // 3️⃣ Low Stock Products
        const lowStockProducts = await Product.find({
            $expr: { $lte: ["$current_stock", "$min_stock_level"] }
        }).select("product_name current_stock min_stock_level");

        // 4️⃣ Total Inventory Value
        const inventoryValue = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: {
                        $sum: { $multiply: ["$current_stock", "$cost_price"] }
                    }
                }
            }
        ]);

        const totalInventoryValue =
            inventoryValue.length > 0 ? inventoryValue[0].totalValue : 0;

        // ✅ Final Response
        res.status(200).json({
            success: true,
            data: {
                totalBrands,
                totalCategories,
                totalProducts,
                totalStockIn,
                totalStockOut,
                totalInventoryValue,
                lowStockProducts
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard data"
        });
    }
};