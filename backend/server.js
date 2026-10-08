const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "SBOM Risk Auditor backend is running",
    status: "OK"
  });
});

// Test API endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend connection is working"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`SBOM Risk Auditor backend running on http://localhost:${PORT}`);
});