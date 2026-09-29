import express from "express";

const router = express.Router();

// Define your routes here
router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

export default router;
