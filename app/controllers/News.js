import news from "../models/News.js";
import fs from "fs";
import path from "path";
import moment from "moment";

// Método que me permite publicar/registrar una noticia

// const registerNews = async (req, res) => {
//     if (!req.body.titulo ||
//         !req.body.descripcion ||
//         !req.body.link
//     )
//         return res.status(400).send({ message: "Datos incompletos" });

//     const existingnews = await news.findOne({ 
//         titulo: req.body.titulo,
//         descripcion: req.body.descripcion
//     });
//     if (existingnews)
//         return res.status(400).send({ message: "El titulo o descripción de la noticia ya ha sido publicada" });

//     const NewsRegister = new news({
//         titulo: req.body.titulo,
//         descripcion: req.body.descripcion,
//         link: req.body.link
//     });

//     const result = await NewsRegister.save();
//     return !result
//         ? res.status(400).send({ message: "Falla al publicar la noticia" })
//         : res.status(200).send({ result });
// };

// Método que permite publicar/registrar la imagen de la noticia

const savenewsImg = async (req, res) => {
  try {
    const { titulo, descripcion, link, tipo_noticia } = req.body;
    if (!titulo || !descripcion) {
      return res.status(400).send({ message: "Datos incompletos" });
    }

    let imageUrl = "";
    let pdfUrl = "";

    const timestamp = moment().unix();  // Se usa la misma marca de tiempo para evitar nombres diferentes

    if (req.files) {
      // Manejo de la imagen
      if (req.files.image) {
        const extension = path.extname(req.files.image.name);
        const imagePath = `./uploads_news/${timestamp}${extension}`;
        await fs.writeFile(imagePath, await fs.readFile(req.files.image.path));
        imageUrl = `${req.protocol}://${req.get("host")}/uploads_news/${timestamp}${extension}`;
      }

      // Manejo del archivo PDF
      if (req.files.pdf) {
        const extension = path.extname(req.files.pdf.name);
        const pdfPath = `./uploads_pdfs/${timestamp}${extension}`;
        await fs.writeFile(pdfPath, await fs.readFile(req.files.pdf.path));
        pdfUrl = `${req.protocol}://${req.get("host")}/uploads_pdfs/${timestamp}${extension}`;
      }
    }

    // Crear y guardar la noticia en la base de datos
    const newsSchema = new news({
      titulo,
      descripcion,
      link,
      tipo_noticia,
      imagen: imageUrl,
      pdfLink: pdfUrl,
    });

    const result = await newsSchema.save();
    return res.status(200).send({ result });

  } catch (error) {
    console.error("Error en savenewsImg:", error);
    return res.status(500).send({ message: "Error interno del servidor", error: error.message });
  }
};


  // Método que permite consultar las noticias registradas

  const listnotice = async (req, res) => {
    const newsList = await news.find();
    return newsList.length == 0
    ? res.status(400).send({ message: "Lista de noticias vacia" })
    : res.status(200).send({ newsList }); 
  };

  // Método que permite actualizar o modificar la información de las noticias

  const updatenotice = async (req, res) => {
    if (!req.body.titulo || !req.body.descripcion)
      return res.status(400).send({ message: "Datos incompletos" });

    const empUpdate = await news.findByIdAndUpdate(
      { _id: req.body._id },  // Buscar el rol actual por nombre
      { titulo: req.body.titulo, descripcion: req.body.descripcion, link: req.body.link, Tipo_noticia: req.body.Tipo_noticia},
      { new: true }  // Devolver el documento actualizado
    );
  
    return !empUpdate
      ? res.status(400).send({ message: "Error al actualizar el afiliado" })
      : res.status(200).send({ message: "afiliado actualizado" });
  };

  //  Método que permite la eliminación de las noticias por Id

  const deletenotice = async (req, res) => {
    const newDelete = await news.findByIdAndDelete({ _id: req.body._id });
  return !newDelete
    ? res.status(400).send({ message: "Noticia no encontrada" })
    : res.status(200).send({ message: "Noticia eliminada" });
  }

  const findNew = async (req, res) => {
    const newtittle = await news.findOne({ titulo: req.params["titulo"] });
    return !newtittle
      ? res.status(400).send({ message: "No se encontraron resultados" })
      : res.status(200).send({ newtittle });
  };

export default{
    // registerNews,
    savenewsImg,
    listnotice,
    updatenotice,
    deletenotice,
    findNew
}