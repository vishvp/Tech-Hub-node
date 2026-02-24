const Brand = require("../models/Brand");

// CREATE
exports.createBrand = async (req, res) => {
    try {
        const brand = await Brand.create(req.body);
        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET ALL
exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ create_at: -1 });
        res.status(200).json({ success: true, data: brands });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SINGLE
exports.getBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE
exports.updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json({ success: true, data: brand });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json({
            success: true,
            message: "Brand deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
