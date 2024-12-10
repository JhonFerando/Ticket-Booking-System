const Vendor = require("../models/Vendor");

const createVendor = async (req, res) => {
    try {
        const { name, email } = req.body;
        const vendor = await Vendor.create({ name, email });
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createVendor, getVendors };
