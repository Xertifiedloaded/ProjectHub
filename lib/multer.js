import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const documentTypes = [
  '.pdf',
  '.doc',
  '.docx'
];

const thumbnailTypes = [
  '.jpg',
  '.jpeg',
  '.png'
];

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    if (file.fieldname === 'thumbnail') {
      if (!thumbnailTypes.includes(ext)) {
        return cb(new Error('Thumbnail must be JPG, JPEG, or PNG'), false);
      }
      
      if (!mimeType.startsWith('image/')) {
        return cb(new Error('Invalid thumbnail format'), false);
      }
    }
    
    if (file.fieldname === 'file') {
      if (!documentTypes.includes(ext)) {
        return cb(new Error('File must be PDF, DOC, or DOCX'), false);
      }

      const allowedDocMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedDocMimes.includes(mimeType)) {
        return cb(new Error('Invalid document format'), false);
      }
    }

    cb(null, true);
  }
});


export const uploadProject = upload.fields([
  { name: 'thumbnail', maxCount: 1 }, 
  { name: 'file', maxCount: 1 }     
]);

export default upload;