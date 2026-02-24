const express = require("express");
const router = express.Router();
const controller = require("../controllers/stockHistoryController");

router.post("/", controller.createStockHistory);
router.get("/", controller.getStockHistory);
router.put("/:id", controller.updateStockHistory);
router.delete("/:id", controller.deleteStockHistory);

module.exports = router;