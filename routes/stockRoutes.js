const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.post("/", stockController.createStock);
router.get("/", stockController.getStocks);
router.get("/:id", stockController.getStock);
router.put("/:id", stockController.updateStock);
router.delete("/:id", stockController.deleteStock);

module.exports = router;
