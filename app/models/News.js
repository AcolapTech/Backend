import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema(
    {
        titulo: String,
        fecha_publicacion: { type: Date, default: Date.now },
        imagen: String,
        descripcion: String,
        link: String,
        tipo_noticia: String,
        pdfLink: String
    }
)

const news = mongoose.model("Noticias", newsSchema);

export default news;