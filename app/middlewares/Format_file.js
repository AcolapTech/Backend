import multer from "multer";
import path from "path";

// Configuración para almacenar en memoria y luego guardar en disco
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const validTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "application/pdf"];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no válido. Solo se permiten imágenes (png, jpg, jpeg, gif) y PDFs."));
  }
};

// Límite de tamaño de archivo (5MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "image", maxCount: 1 }, // Imagen única
  { name: "pdf", maxCount: 1 },   // PDF único
]);

export default upload;




