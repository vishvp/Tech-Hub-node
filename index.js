const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/brands", require("./routes/brandRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/stocks", require("./routes/stockRoutes"));
app.use("/api/sales", require("./routes/stockRoutesin"));
app.use("/api/stock-history", require("./routes/stockHistoryRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));



app.get("/", (req, res) => {
    res.send("Inventory API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
