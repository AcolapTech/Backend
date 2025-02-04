const upload = async (req, res, next) => {
  if (Object.keys(req.files).length === 0) {
    return next();  // Si no se sube ningún archivo, continúa con la ejecución
  }

  const { image, pdf } = req.files;

  // Validación para las imágenes
  if (image) {
    if (!image.name) {
      return res.status(400).send({ message: "Falta nombre de la imagen" });
    }

    const imageType = image.type;
    const validImageTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
    
    if (!validImageTypes.includes(imageType)) {
      return res.status(400).send({
        message: "Formato de imagen no válido: solo .png, .jpg, .jpeg, .gif",
      });
    }
  }

  // Validación para los PDFs
  if (pdf) {
    if (!pdf.name) {
      return res.status(400).send({ message: "Falta nombre del archivo PDF" });
    }

    const pdfType = pdf.type;
    const validPdfType = "application/pdf";
    
    if (pdfType !== validPdfType) {
      return res.status(400).send({
        message: "Formato de archivo no válido: solo .pdf",
      });
    }
  }

  // Si todo está bien, pasar al siguiente middleware o controlador
  next();
};

export default upload;


