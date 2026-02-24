const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
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

        source: {
            type: String,
            enum: ["purchase", "sale"],
            required: true,
        },

        reference: {
            type: String,
            default: "",
        },

        perform_by: {
            type: String,
            required: true,
        },

        create_by: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Stock", stockSchema);
