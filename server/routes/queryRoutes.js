const express = require("express");
const mongoose = require("mongoose");
const Query = require("../models/Query");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

function formatQuery(queryDoc) {
  return {
    id: queryDoc._id.toString(),
    title: queryDoc.title,
    description: queryDoc.description,
    status: queryDoc.status,
    userId: queryDoc.userId.toString(),
    createdAt: queryDoc.createdAt,
    updatedAt: queryDoc.updatedAt,
    comments: (queryDoc.comments || []).map((comment) => ({
      id: comment._id.toString(),
      queryId: queryDoc._id.toString(),
      userId: comment.userId.toString(),
      text: comment.text,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }))
  };
}

router.use(requireAuth);

router.get("/", async (_req, res) => {
  const queries = await Query.find().sort({ createdAt: -1 });
  res.json({ queries: queries.map(formatQuery) });
});

router.post("/", async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const query = await Query.create({
    title: title.trim(),
    description: description?.trim() || "",
    status: "open",
    userId: req.user._id
  });

  res.status(201).json({ query: formatQuery(query) });
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid query id" });
  }

  const query = await Query.findById(req.params.id);
  if (!query) {
    return res.status(404).json({ message: "Query not found" });
  }

  res.json({ query: formatQuery(query) });
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  if (!["open", "resolved"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const query = await Query.findById(req.params.id);
  if (!query) {
    return res.status(404).json({ message: "Query not found" });
  }

  if (query.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the owner can update status" });
  }

  query.status = status;
  await query.save();

  res.json({ query: formatQuery(query) });
});

router.delete("/:id", async (req, res) => {
  const query = await Query.findById(req.params.id);
  if (!query) {
    return res.status(404).json({ message: "Query not found" });
  }

  if (query.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the owner can delete this query" });
  }

  await query.deleteOne();
  res.json({ message: "Query deleted" });
});

router.post("/:id/comments", async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  const query = await Query.findById(req.params.id);
  if (!query) {
    return res.status(404).json({ message: "Query not found" });
  }

  query.comments.push({
    userId: req.user._id,
    text: text.trim()
  });
  await query.save();

  const newComment = query.comments[query.comments.length - 1];
  res.status(201).json({
    comment: {
      id: newComment._id.toString(),
      queryId: query._id.toString(),
      userId: newComment.userId.toString(),
      text: newComment.text,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt
    }
  });
});

router.delete("/:queryId/comments/:commentId", async (req, res) => {
  const query = await Query.findById(req.params.queryId);
  if (!query) {
    return res.status(404).json({ message: "Query not found" });
  }

  const comment = query.comments.id(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the owner can delete this comment" });
  }

  comment.deleteOne();
  await query.save();

  res.json({ message: "Comment deleted" });
});

module.exports = router;
