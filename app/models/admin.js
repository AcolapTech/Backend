import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        nombre: String,
        email: String,
        telefono: String,
        contrasena: String,
        roleId: { type: mongoose.Schema.ObjectId, ref: "roles" },
        registerDate: { type: Date, default: Date.now },
    }
)

const admin = mongoose.model("admins", userSchema);

export default admin;