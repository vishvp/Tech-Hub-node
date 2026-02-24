const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true,
            trim: true,
        },

        cat_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        brand_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true,
        },

        sku: {
            type: String,
            required: true,
            unique: true,
        },

        cost_price: {
            type: Number,
            required: true,
        },

        selling_price: {
            type: Number,
            required: true,
        },

        current_stock: {
            type: Number,
            default: 0,
        },

        min_stock_level: {
            type: Number,
            default: 5,
        },

        description: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: { createdAt: "create_update", updatedAt: true },
    }
);

module.exports = mongoose.model("Product", productSchema);
