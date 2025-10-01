const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Document title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description for the document"],
      trim: true,
    },
    fileURL: {
      type: String,
      required: [true, "File URL is required"],
      unique: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId, // reference to a user
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;
