if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const http = require("http"); // ✅ Add this
const connectDB = require("./config/connect");
const socketManager = require("./socket"); // ✅ Add this

const hotelRouter = require("./routes/hotel");
const customerRouter = require("./routes/customer");
const commonRouter = require("./routes/common");
const riderRouter = require("./routes/rider");
const adminRouter = require("./routes/admin");

const { startWeeklySettlementCron } = require("./cron/weeklySettlement");

const app = express();
app.use(express.json());

// Routers
app.use("/hotel", hotelRouter);
app.use("/customer", customerRouter);
app.use("/common", commonRouter);
app.use("/rider", riderRouter);
app.use("/admin", adminRouter);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("Please visit www.magicmenu.in");
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    startWeeklySettlementCron();

    // ✅ Create HTTP server and pass to socket
    const server = http.createServer(app);
    socketManager.init(server); // 👈 Attach WebSocket

    // ✅ Listen with HTTP server (not app.listen)
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server Startup Error:", error);
  }
};

start();
