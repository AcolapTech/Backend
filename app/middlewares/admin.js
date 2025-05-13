import role from "../models/rol.js";

const admin = async (req, res, next) => {
  const adminRole = await role.findById(req.user.roleId);
  if (!adminRole) return res.status(400).send({ message: "Rol no encontrado" });

  return adminRole.nombre === "admin"
    ? next()
    : res.status(400).send({ message: "Usuario no autorizado" });
};


export default admin;