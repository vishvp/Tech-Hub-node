const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
    {
        brand_name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: { createdAt: "create_at", updatedAt: false }
    }
);

module.exports = mongoose.model("Brand", brandSchema);
