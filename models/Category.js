const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: "create_at", updatedAt: false }
});

module.exports = mongoose.model("Category", categorySchema);
