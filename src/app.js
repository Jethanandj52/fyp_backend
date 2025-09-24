require("dotenv").config({ path: "../.env" });
const express = require("express");
const { connectToDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Routers
const appRouter = require("./routes/auth");
const userHD = require("./routes/user");
const libraryRoute = require("./routes/lib");
const apiRoute = require("./routes/api");
const aiRoute = require("./routes/ai");
const storeRouter = require("./routes/store");
const notificationRouter = require("./routes/notification");

const apiRoutes = require("./routes/apiRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const Feedback = require("./routes/feedback");

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS Setup
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/auth", appRouter);
app.use("/user", userHD);
app.use("/lib", libraryRoute);
app.use("/rApi", apiRoute);
app.use("/ai", aiRoute);
app.use("/store", storeRouter);
app.use("/notifications", notificationRouter);
app.use("/apis", apiRoutes);
app.use("/libraries", libraryRoutes);
app.use("/notifications", notificationRoutes);
app.use("/feedback", Feedback);

// ✅ Database Connect
connectToDB()
  .then(() => {
    console.log("✅ Connected to DB successfully!");

    // ⏳ Start health check worker AFTER DB connection
    require("./workers/healthCheckWorker");
  })
  .catch((err) => console.error("❌ DB connection failed:", err));

// ✅ Socket.IO Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // 🔹 Future: userId ke sath mapping ke liye
  socket.on("registerUser", (userId) => {
    socket.join(userId); // har user apne userId ke naam se room join karega
    console.log(`👤 User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Export io for workers
// ✅ Export io instance for workers
module.exports.io = io;


// ✅ Server Start
server.listen(port, () =>
  console.log("🚀 Server running with Socket.IO on port", port)
);
