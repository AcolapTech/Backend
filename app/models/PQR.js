import mongoose from 'mongoose'

const pqrSchema = new mongoose.Schema(
    {
        nombre: String,
        fecha_publicacion: { type: Date, default: Date.now },
        correo: String,
        telefono: String,
        motivo: String,
        descripcion: String,
    }
)

const pqr = mongoose.model("pqrs", pqrSchema);

export default pqr;