import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        nombre: String,
        Razon_social: String,
        Tipo_afiliado: String,
        Pais: String,
        Ciudad: String,
        Num_sedes: Number,
        Tipo_parque: String,
        LogoURL: String,
        UrlParque: String
    }
)

const emp = mongoose.model("afiliados", userSchema);

export default emp;