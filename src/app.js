require("dotenv").config(); // Vercel automatically injects env vars
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Database connection
const { connectToDB } = require("./config/database");
connectToDB()
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB connection failed:", err));

// Routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const libRouter = require("./routes/lib");
const apiRouter = require("./routes/api");
const aiRouter = require("./routes/ai");
const storeRouter = require("./routes/store");
const notificationRouter = require("./routes/notification");
const apiRoutes = require("./routes/apiRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const feedbackRouter = require("./routes/feedback");

// Express setup
const app = express();

app.use(
  cors({
    origin: "*", // frontend domain ya "*" for testing
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/lib", libRouter);
app.use("/rApi", apiRouter);
app.use("/ai", aiRouter);
app.use("/store", storeRouter);
app.use("/notifications", notificationRouter);
app.use("/apis", apiRoutes);
app.use("/libraries", libraryRoutes);
app.use("/notifications", notificationRoutes);
app.use("/feedback", feedbackRouter);

// Health check
app.get("/", (req, res) => res.json({ status: "Server is running" }));

// ✅ Export for Vercel
module.exports = app;
