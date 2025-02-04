import role from "../models/rol.js";

const registerRole = async (req, res) => {
  if (!req.body.nombre || !req.body.descripcion)
    return res.status(400).send({ message: "Datos incompletos" });

  const existingRole = await role.findOne({ nombre: req.body.nombre });
  if (existingRole)
    return res.status(400).send({ message: "El rol ya existe" });

  const roleSchema = new role({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    dbStatus: true,
  });

  const result = await roleSchema.save();
  return !result
    ? res.status(400).send({ message: "Falla al registrar el rol" })
    : res.status(200).send({ result });
};

const listRole = async (req, res) => {
  const roleList = await role.find();
  return roleList.length == 0
    ? res.status(400).send({ message: "Lista de roles vacia" })
    : res.status(200).send({ roleList });
};

const updateRole = async (req, res) => {
  if (!req.body.descripcion || !req.body.nombre2)
    return res.status(400).send({ message: "Datos incompletos" });

   const existingRole = await role.findOne({
     nombre: req.body.nombre,
     descripcion: req.body.descripcion,
   });
   if (existingRole)
     return res.status(400).send({ message: "No has hecho ningún cambio" });


  const roleUpdate = await role.findOneAndUpdate(
    { nombre: req.body.nombre2 },  // Buscar el rol actual por nombre
    { nombre: req.body.nombre, descripcion: req.body.descripcion || '' }, // Actualizar solo el nombre y la descripción si se pasa
    { new: true }  // Devolver el documento actualizado
  );

  return !roleUpdate
    ? res.status(400).send({ message: "Error al actualizar el rol" })
    : res.status(200).send({ message: "Rol actualizado" });
};

const deleteRole = async (req, res) => {
  const roleDelete = await role.findByIdAndDelete({ _id: req.params["_id"]});
  return !roleDelete
    ? res.status(400).send({ message: "Rol no encontrado" })
    : res.status(200).send({ message: "Rol eliminado" });
};

const findRole = async (req, res) => {
  const roleId = await role.findOne({ nombre: req.params["nombre"] });
  return !roleId
    ? res.status(400).send({ message: "No se encontraron resultados" })
    : res.status(200).send({roleId});
};

export default { registerRole, listRole, updateRole, deleteRole, findRole };