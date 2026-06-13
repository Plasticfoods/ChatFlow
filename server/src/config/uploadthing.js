const { createUploadthing } = require("uploadthing/express");

const f = createUploadthing();

const uploadRouter = {
  // Define as many endpoints as you want
  chatAttachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    text: { maxFileSize: "64KB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      // This runs on your server after upload is done
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Whatever is returned here is sent to the clientside onClientUploadComplete callback
      return { uploadedBy: metadata.userId, url: file.url };
    })
};

module.exports = { uploadRouter };