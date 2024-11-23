const express = require("express");
const next = require("next");
const multer = require("multer");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const apikeys = require("./apikeys.json");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();
const SCOPE = ['https://www.googleapis.com/auth/drive'];

async function authorize() {
  try {
    const jwtClient = new google.auth.JWT(
      apikeys.client_email,
      null,
      apikeys.private_key.replace(/\\n/g, '\n'), 
      SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
  } catch (error) {
    console.error("Authorization error:", error);
    throw new Error("Failed to authorize with Google Drive");
  }
}

async function uploadToGoogleDrive(filePath, fileName, mimeType) {
  try {
    const authClient = await authorize();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const fileMetadata = {
      name: fileName,
      parents: ['1F3v_-sp9vIHbOOWup1N08SdbxVMGoJqL']
    };

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath)
    };

    const requestBody = {
      requestBody: fileMetadata,
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(filePath)
      },
      fields: 'id, webViewLink'
    };

    const response = await drive.files.create(requestBody);
    fs.unlinkSync(filePath);
    return response.data.webViewLink;
  } catch (error) {
    console.error("Google Drive upload error:", error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
    }
    throw new Error(`Failed to upload to Google Drive: ${error.message}`);
  }
}
app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  // server.use(
  //   cors({
  //     origin: "http://localhost:3000",
  //     methods: ["GET", "POST", "PATCH", "DELETE"],
  //     allowedHeaders: ["Content-Type"],
  //   })
  // );

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const uploadFile = multer({
    storage,
    limits: { fileSize: Infinity },
    fileFilter: (req, file, cb) => {
      cb(null, true);
    },
  });

  const uploadThumbnail = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      cb(null, file.mimetype.startsWith("image/"));
    },
  });

  server.post("/upload/file", uploadFile.single("file"), async (req, res) => {
    try {
      if (!req.file) throw new Error("No file uploaded");
      const driveUrl = await uploadToGoogleDrive(
        req.file.path,
        req.file.originalname,
        req.file.mimetype
      );
      res.json({
        url: driveUrl,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  server.post(
    "/upload/thumbnail",
    uploadThumbnail.single("thumbnail"),
    async (req, res) => {
      try {
        if (!req.file) throw new Error("No thumbnail uploaded");
        const driveUrl = await uploadToGoogleDrive(
          req.file.path,
          req.file.originalname,
          req.file.mimetype
        );
        res.json({ url: driveUrl });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  server.post("/api/projects", async (req, res) => {
    try {
      const {
        title,
        description,
        year,
        category,
        tags,
        files,
        thumbnailUrl,
        userId,
      } = req.body;

      if (!title || !description || !year || !category || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const project = await prisma.project.create({
        data: {
          title,
          description,
          year,
          category,
          tags,
          thumbnailUrl,
          userId,
          files: {
            create: files.map((file) => ({
              name: file.name,
              url: file.url,
              size: file.size,
              type: file.type,
            })),
          },
        },
        include: { files: true },
      });

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  server.get("/api/projects", async (req, res) => {
    try {
      const projects = await prisma.project.findMany({
        include: { files: true },
      });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.use((err, req, res, next) => {
    res.status(500).json({ error: err.message || "Something went wrong!" });
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});