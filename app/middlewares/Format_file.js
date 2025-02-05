import multer from "multer";

// Configurar almacenamiento en memoria (puedes cambiarlo a 'diskStorage' si prefieres guardar en disco)
const storage = multer.memoryStorage();

// Filtrar archivos por tipo
const fileFilter = (req, file, cb) => {
  const validImageTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
  const validPdfType = "application/pdf";

  if (validImageTypes.includes(file.mimetype) || file.mimetype === validPdfType) {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no válido. Solo se permiten imágenes (png, jpg, jpeg, gif) y PDFs."));
  }
};

// Configurar multer con almacenamiento y filtro de archivos
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB límite por archivo
  fileFilter,
}).fields([
  { name: "image", maxCount: 1 }, // Un solo archivo de imagen
  { name: "pdf", maxCount: 1 } // Un solo archivo PDF
]);

export default upload;


