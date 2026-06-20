const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { protect } = require("./middleware/authMiddleware");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Workspace API Running");
});

const PORT = process.env.PORT || 5000;
app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});