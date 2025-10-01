// // const cloudinary = require("cloudinary").v2;
// // const fs = require("fs");
// // const Document = require("../../models/documentmodel.js");

// // exports.uploadFile = async (req, res) => {
// //   try {
// //     console.log("File received:", req.file);

// //     if (!req.file) {
// //       return res.status(400).json({ error: "No file uploaded" });
// //     }

// //     // Upload to Cloudinary
// //     const result = await cloudinary.uploader.upload(req.file.path, {
// //       resource_type: "auto",
// //       folder: "paperless_uploads",
// //     });

// //     // Clean up local temp file
// //     fs.unlinkSync(req.file.path);

// //     // Save document metadata into MongoDB
// //     const newDoc = new Document({
// //       title: req.body.title,
// //       description: req.body.description,
// //       fileURL: result.secure_url,
// //       uploadedBy: req.user.id, // 👈 needs auth middleware
// //       tags: req.body.tags || [],
// //     });

// //     await newDoc.save();

// //     res.status(201).json({
// //       success: true,
// //       message: "File uploaded and saved successfully",
// //       document: newDoc,
// //     });
// //   } catch (err) {
// //     console.error("Upload error:", err);
// //     res.status(500).json({ error: "File upload failed", details: err.message });
// //   } finally {
// //     // Extra safety: try removing file if it still exists
// //     if (req.file && req.file.path) {
// //       fs.unlink(req.file.path, (err) => {
// //         if (err) console.error("Failed to delete temp file:", err);
// //       });
// //     }
// //   }
// // };

// const cloudinary = require("cloudinary").v2;
// const fs = require("fs");
// const Document = require("../../models/documentmodel.js");

// exports.uploadFile = async (req, res) => {
//   try {
//     console.log("File received:", req.file);

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       resource_type: "raw", // 👈 important for non-images
//       folder: "paperless_uploads",
//     });

//     // Clean up local temp file
//     fs.unlinkSync(req.file.path);

//     // Save document metadata into MongoDB
//     const newDoc = new Document({
//       title: req.body.title,
//       description: req.body.description,
//       fileURL: result.secure_url, // 👈 always valid
//       uploadedBy: req.user?.id || null,
//       tags: req.body.tags || [],
//     });

//     await newDoc.save();

//     res.status(201).json({
//       success: true,
//       message: "File uploaded and saved successfully",
//       document: newDoc,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "File upload failed", details: err.message });
//   } finally {
//     if (req.file && req.file.path) {
//       fs.unlink(req.file.path, (err) => {
//         if (err) console.error("Failed to delete temp file:", err);
//       });
//     }
//   }
// };

// const cloudinary = require("cloudinary").v2;
// const fs = require("fs");
// const Document = require("../../models/documentmodel.js");

// exports.uploadFile = async (req, res) => {
//   try {
//     console.log("File received:", req.file);

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       resource_type: "raw", // ✅ supports PDFs, docs, zips, etc.
//       folder: "paperless_uploads",
//     });

//     // Clean up local temp file
//     fs.unlinkSync(req.file.path);

//     // ✅ force inline viewing instead of download
//     const viewableUrl = result.secure_url.replace(
//       "/upload/",
//       "/upload/fl_inline/"
//     );

//     // Save document metadata into MongoDB
//     const newDoc = new Document({
//       title: req.body.title,
//       description: req.body.description,
//       fileURL: viewableUrl, // ✅ use inline url
//       uploadedBy: req.user.id, // needs auth middleware
//       tags: req.body.tags || [],
//     });

//     await newDoc.save();

//     res.status(201).json({
//       success: true,
//       message: "File uploaded and saved successfully",
//       document: newDoc,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "File upload failed", details: err.message });
//   } finally {
//     // Extra safety: try removing file if it still exists
//     if (req.file && req.file.path) {
//       fs.unlink(req.file.path, (err) => {
//         if (err) console.error("Failed to delete temp file:", err);
//       });
//     }
//   }
// };

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Document = require("../../models/documentmodel.js");

// Upload file controller
exports.uploadFile = async (req, res) => {
  try {
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary as raw (supports PDFs, DOCX, etc.)
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // important for non-images
      folder: "paperless_uploads",
    });

    // Clean up local temp file
    fs.unlinkSync(req.file.path);

    // Save document metadata into MongoDB
    const newDoc = new Document({
      title: req.body.title || "Untitled Document",
      description: req.body.description || "",
      fileURL: result.secure_url, // ✅ direct link to the file
      uploadedBy: req.user.id, // requires auth middleware
      tags: req.body.tags || [],
    });

    await newDoc.save();

    res.status(201).json({
      success: true,
      message: "File uploaded and saved successfully",
      document: newDoc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "File upload failed", details: err.message });
  } finally {
    // Extra safety: remove temp file if still exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }
  }
};
