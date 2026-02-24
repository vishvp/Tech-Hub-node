const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        type: {
            type: String,
            enum: ["in", "out"],
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        reference: {
            type: String,
            required: true,
            trim: true,
        },

        perform_by: {
            type: String,
            required: true,
        },

        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("StockHistory", stockHistorySchema);