import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // File system module

// Configuration
cloudinary.config({
  cloud_name: "dueak8hva",
  api_key: "935258375945522",
  api_secret: "C5MWRTWdTUCoRylefhJSKoEujvg", // Click 'View API Keys' above to copy your API secret
});

const uploadToCloudinary = async (photoPath: string, photoName: string) => {
  let uploadResult;
  try {
    // Check if the photo already exists
    const existingPhoto = await cloudinary.api.resource(photoName).catch(() => null);

    // If the photo exists, delete it to prevent duplication
    if (existingPhoto) {
      console.log(`Photo with name ${photoName} already exists. Deleting old version...`);
      await cloudinary.uploader.destroy(photoName);
    }

    // Upload the new photo to Cloudinary
    uploadResult = await cloudinary.uploader.upload(photoPath, {
      public_id: photoName,
      overwrite: true,
    });

    // Generate optimized URL (auto-format and auto-quality)
    const optimizedUrl = cloudinary.url(photoName, {
      fetch_format: "auto",
      quality: "auto",
    });

    // Generate auto-cropped URL (500x500 auto-crop)
    const autoCropUrl = cloudinary.url(photoName, {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });

    // Return the upload result and URLs
    return {
      url: uploadResult.secure_url,
      optimizedUrl,
      autoCropUrl,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Could not upload image to Cloudinary");
  } finally {
    // Delete the local file regardless of the upload outcome
    fs.unlink(photoPath, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      } else {
        console.log("Local file deleted successfully:", photoPath);
      }
    });
  }
};


export default uploadToCloudinary;
