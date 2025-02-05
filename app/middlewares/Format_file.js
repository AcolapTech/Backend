import multer from "multer";

const storage = multer.memoryStorage(); // Guardar en memoria, luego escribir en disco manualmente

const fileFilter = (req, file, cb) => {
  const validTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "application/pdf"];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no válido. Solo se permiten imágenes (png, jpg, jpeg, gif) y PDFs."));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
}).fields([
  { name: "image", maxCount: 1 }, // Imagen única
  { name: "pdf", maxCount: 1 }, // PDF único
]);

export default upload;



