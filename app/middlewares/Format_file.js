import multer from "multer";
import path from "path";

// Configuración de multer para imágenes y PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "./uploads_news");
    } else if (file.mimetype === "application/pdf") {
      cb(null, "./uploads_pdfs");
    } else {
      cb(new Error("Formato no permitido"), null);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});

// Filtros de archivos permitidos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no permitido"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload.any();  // Permite múltiples archivos



