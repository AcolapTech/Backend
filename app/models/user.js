import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        nombre: String,
        email: String,
        telefono: String,
        contrasena: String,
        cargo: String,
        ciudad: String,
        roleId: { type: mongoose.Schema.ObjectId, ref: "roles" },
        dbStatus: Boolean,
        registerDate: { type: Date, default: Date.now },
        Nombre_comercial: {type: mongoose.Schema.ObjectId, ref: "afiliados"}
    }
)

const user = mongoose.model("usuarios", userSchema);

export default user;