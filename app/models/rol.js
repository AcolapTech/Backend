import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  registerDate: { type: Date, default: Date.now },
  dbStatus: Boolean,
});

const role = mongoose.model("roles", roleSchema);

export default role;