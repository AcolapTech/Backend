import multer from "multer";
import path from "path";
import fs from "fs";

// Asegurar que las carpetas de destino existen
const createFolderIfNotExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

// Definir almacenamiento para imágenes y PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "./uploads_news";
    if (file.mimetype === "application/pdf") {
      folder = "./uploads_pdfs";
    }
    
    createFolderIfNotExists(folder); // Asegurar que la carpeta existe
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});

// Filtrar archivos permitidos (solo imágenes y PDFs)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no permitido"), false);
  }
};

// Middleware de multer
const upload = multer({ storage, fileFilter });

export default upload.fields([
  { name: "image", maxCount: 1 },  // Asegura que solo se sube 1 imagen
  { name: "pdf", maxCount: 1 }     // Asegura que solo se sube 1 PDF
]);



