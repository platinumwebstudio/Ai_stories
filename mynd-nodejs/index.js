const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const cron = require("node-cron");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const aiRoutes = require("./routes/ai");
const meditationRoutes = require("./routes/meditation");
const randomMeditation = require("./services/randomMeditation");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "127.0.0.1";

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());

// Serve static files from the "/uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/uploads");
// Serve static files from the "/media" directory
app.use("/media", express.static(path.join(__dirname, "media")));
app.get("/media");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/meditation", meditationRoutes);

cron.schedule("0 0 * * *", () => {
  for (let i = 0; i < 3; i++) {
    randomMeditation();
  }
});

app.listen(PORT, HOST, async () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
