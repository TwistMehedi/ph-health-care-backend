import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase()
      .replace(".", "");

    let folderName = "ph-health-care/others";

    if (file.mimetype.startsWith("image")) {
      folderName = "ph-health-care/images";
    }

    if (file.mimetype === "application/pdf") {
      folderName = "ph-health-care/pdf";
    }

    const publicId = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    // console.log("Generated public ID for Cloudinary:", publicId);
    return {
      folder: folderName,
      format: extension,
      public_id: publicId,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and PDF allowed"));
    }
  },
});

export default upload;
