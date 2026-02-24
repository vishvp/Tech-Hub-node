const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.post("/", stockController.createStock);
router.get("/", stockController.getStocks);
router.delete("/:id", stockController.deleteStock);

module.exports = router;
