import  user from '../models/user.js'
import role from "../models/rol.js";
import emp from '../models/emp.js';
import admin from '../models/admin.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import cookie from 'cookie-parser';

// Método que permite registrar los usuarios, añadiendo los datos

const registerUser = async (req, res) => {
    if (!req.body.nombre || !req.body.email || !req.body.contrasena || !req.body.telefono || !req.body.cargo || !req.body.ciudad || !req.body.Nombre_comercial)
      return res.status(400).send({ message: "Datos incompletos" });
  
    const existingUser = await user.findOne({ email: req.body.email,
      nombre: req.body.nombre
    });
    if (existingUser)
      return res.status(400).send({ message: "El Usuario ya ha sido registrado" });
  
    const passHash = await bcrypt.hash(req.body.contrasena, 10);
  
    const roleId = await role.findOne({ nombre: "afiliado" });
    if (!roleId) return res.status(400).send({ message: "No hay un rol asignado" });
  
    const empId = await emp.findOne({ nombre: req.body.Nombre_comercial});
    if(!empId) return res.status(400).send({message: "No se encuentra el afiliado " + req.body.Nombre_comercial});

    const userRegister = new user({
      nombre: req.body.nombre,
      email: req.body.email,
      contrasena: passHash,
      telefono: req.body.telefono,
      roleId: roleId._id,
      cargo: req.body.cargo,
      Nombre_comercial: empId,
      ciudad: req.body.ciudad,
      dbStatus: true,
    });
  
    const result = await userRegister.save();
  
    try {
      return res.status(200).json({
        token: jwt.sign(
          {
            _id: result._id,
            nombre: result.nombre,
            roleId: result.roleId,
            Nombre_comercial: result.empId,
            iat: moment().unix(),
          },
          process.env.SK_JWT
        ),
      })
    } catch (e) {
       res.status(400).send({ message: "Register error" });
    }  
  };

  // Método que permite consultar los usuarios cuyo nombre corresponde al buscado

  const listAllUser = async (req, res) => {
    const userList = await user
      .find({
        $and: [{ nombre: new RegExp(req.body.nombre, "i") }],
      })
      .populate("roleId", "nombre")
      .populate("Nombre_comercial", "nombre Razon_social Tipo_afiliado ")
      .exec();
    return userList.length === 0
      ? res.status(400).send({ message: "lista de usuarios vacia" })
      : res.status(200).send({ userList });
  };

//  Método que permite el registro de usuarios con rol admin

  const registerAdminUser = async (req, res) => {
    if (
      !req.body.nombre ||
      !req.body.email ||
      !req.body.contrasena || 
      !req.body.telefono
    )
      return res.status(400).send({ message: "Datos incompletos" });
  
    const existingUser = await admin.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(400).send({ message: "El correo proporcionado, ya se encuentra registrado" });
  
    const passHash = await bcrypt.hash(req.body.contrasena, 10);

    const roleId = await role.findOne({ nombre: "admin" });
    if (!roleId) return res.status(400).send({ message: "No hay un rol asignado" });
  
    const userRegister = new admin({
      nombre: req.body.nombre,
      email: req.body.email,
      contrasena: passHash,
      telefono: req.body.telefono,
      roleId: roleId._id
    });
  
    const result = await userRegister.save();
      try {
        return res.status(200).json({
          token: jwt.sign(
            {
              _id: result._id,
              nombre: result.nombre,
              roleId: result.roleId,
              Nombre_comercial: result.empId,
              iat: moment().unix(),
            },
            process.env.SK_JWT
          ),
        })
      } catch (e) {
         res.status(400).send({ message: "Register error" });
      }  
  };

//  Método que permite hacer la consulta de un usuario (afiliado) por medio del Id

  const findUser = async (req, res) => {
    const userfind = await user
      .findOne({ nombre: req.params["nombre"] })
      .populate("roleId")
      .populate("Nombre_comercial")
      .exec();
    return !userfind
      ? res.status(400).send({ message: "No se encontraron resultados" })
      : res.status(200).send({ userfind });
  };

  // Método que permite buscar un usuario (afiliado) por medio de su mismo Id

  const findUserNew = async (req, res) => {
    const userfind = await user
      .findById({ _id: req.user._id })
      .populate("roleId")
      .populate("Nombre_Comercial")  
      .exec();
    return !userfind
      ? res.status(400).send({ message: "No se encontraron resultados" })
      : res.status(200).send({ userfind });
  };
  
  // Método que permite

  const getUserRole = async (req, res) => {
    let userRole = await user
      .findOne({ email: req.params.email })
      .populate("roleId")
      .exec();
    if (!userRole)
     {
      let userRole = await admin
      .findOne({ email: req.params.email})
      .populate("roleId")
      .exec();
      if(!userRole){
        return res.status(400).send({ message: "No se encontraron resultados" });
      }
      userRole = userRole.roleId.nombre;
      return res.status(200).send({ userRole });
     }
    userRole = userRole.roleId.nombre;
    return res.status(200).send({ userRole });
  };

  // Método que permite actualizar los usuarios por medio del ID requiriendo nombre e email

  const updateUser = async (req, res) => {
    if (!req.body.nombre || !req.body.email || !req.body.roleId)
      return res.status(400).send({ message: "Datos incompletos" });
  
    const searchUser = await user.findById({ _id: req.body._id });
    if (req.body.email !== searchUser.email)
      return res
        .status(400)
        .send({ message: "El email no debería cambiar" });
  
    let pass = "";
  
    if (req.body.contrasena) {
      const passHash = await bcrypt.compare(
        req.body.contrasena,
        searchUser.contrasena
      );
      if (!passHash) {
        pass = await bcrypt.hash(req.body.contrasena, 10);
      } else {
        pass = searchUser.contrasena;
      }
    } else {
      pass = searchUser.contrasena;
    }
  
    const Nombre_c = await emp.findOne({nombre: req.body.Nombre_comercial});
    

    if(!Nombre_c){
      return res.status(400).send({ message: "No se ha encontrado el Afiliado" });
    }
    const Rol = await role.findOne({nombre: req.body.roleId});
    if(!Rol){
      return res.status(400).send({ message: "No se ha encontardo el Rol del usuario" });
    }
    const existingUser = await user.findOne({
      nombre: req.body.nombre,
      contrasena: pass,
      roleId: Rol._id, // Aquí comparamos el ObjectId del rol
      telefono: req.body.telefono,
      cargo: req.body.cargo,
      ciudad: req.body.ciudad,
      Nombre_comercial: Nombre_c._id // Comparamos el ObjectId de Nombre_comercial
    });
    if (existingUser)
      return res.status(400).send({ message: "No haz hecho ningún cambio" });
  
    const userUpdate = await user.findByIdAndUpdate(req.body._id, {
      nombre: req.body.nombre,
      contrasena: pass,
      telefono: req.body.telefono,
      cargo: req.body.cargo,
      ciudad: req.body.ciudad,
      Nombre_comercial: Nombre_c._id,
      roleId: Rol._id
    });
  
    return !userUpdate
      ? res.status(400).send({ message: "Error al editar los datos del usuario" })
      : res.status(200).send({ message: "Usuario actualizado" });
  };

  // Método que permite actualizar el nombre y la contraseña de un usuario por medio del id

  const updateUserNew = async (req, res) => {
    if (!req.body.nombre)
      return res.status(400).send({ message: "Datos incompletos" });
  
    const searchUser = await user.findOne({ _id: req.body._id});
    if (req.body.email !== searchUser.email)
      return res
        .status(400)
        .send({ message: "El email no debería cambiar" });
  
        let pass = "";
  
    if (req.body.contrasena) {
      const passHash = await bcrypt.compare(
        req.body.contrasena,
        searchUser.contrasena
      );
      if (!passHash) {
        pass = await bcrypt.hash(req.body.contrasena, 10);
      } else {
        pass = searchUser.contrasena;
      }
    } else {
      pass = searchUser.contrasena;
    }
  
  
    const userUpdate = await user.findByIdAndUpdate(req.body._id, {
      nombre: req.body.nombre,
      contrasena: pass
    });
  
    return !userUpdate
      ? res.status(400).send({ message: "Error al actaulizar el usuario" })
      : res.status(200).send({ message: "Usuario actualizado" });
  };

  // Método que permite desactivar el usuario por medio del Id

  const deleteUser = async (req, res) => {
    if (!req.body._id) return res.status(400).send("Datos incompletos");
  
    const userDelete = await user.findByIdAndUpdate(req.body._id, {
      dbStatus: false,
    });
    return !userDelete
      ? res.status(400).send({ message: "Usuario no encontrado" })
      : res.status(200).send({ message: "Usuario desactivado" });
  };

  // Método que permite eliminar el usuario por medio del Id

  const deleteUserTotal = async (req, res) => {
    const UserDelete = await user.findByIdAndDelete({_id: req.params["_id"]});
    return !UserDelete
    ? res.status(400).send({ message: "Usuario no encontrado" })
    : res.status(200).send({ message: "Usuario eliminado" });
  };

  // Método que se encarga de permitir el acceso a un usuario ya registrado

  const loginUser = async (req, res) => {
    if (!req.body.email || !req.body.contrasena)
        return res.status(400).send({ message: "Datos incompletos" });

    // Primero buscar en los usuarios
    const userLogin = await user.findOne({ email: req.body.email });
    
    if (!userLogin) {
        // Si no se encuentra el usuario, buscar en los administradores
        const AdminLogin = await admin.findOne({ email: req.body.email });

        if (!AdminLogin)
            return res.status(400).send({ message: "El email o la contraseña son erroneas" });

        const hash = await bcrypt.compare(req.body.contrasena, AdminLogin.contrasena);
        if (!hash)
            return res.status(400).send({ message: "El email o la contraseña son erroneas" });

        try {
            // Generar el token JWT para el admin
            const token = jwt.sign(
                {
                    _id: AdminLogin._id,
                    nombre: AdminLogin.nombre,
                    roleId: AdminLogin.roleId,
                    iat: moment().unix(),
                },
                 process.env.SK_JWT
                 /*,{ expiresIn: '4h' }  El token expirará en 4 hora */
            );

            // Configurar la cookie
            res.cookie('token', token, {
              httpOnly: true, // No accesible desde JavaScript
              secure: process.env.NODE_ENV === 'production', // Solo en producción, debe ser 'true' para HTTPS
              sameSite: 'None', // Crucial para permitir cookies cross-origin
              maxAge: 3600000, // 1 hora en milisegundos
              path: '/', // Asegurarse de que la cookie esté disponible para toda la aplicación
          });          

            return res.status(200).send({ message: "Inicio de sesión exitoso" });

        } catch (e) {
            return res.status(400).send({ message: "Error al iniciar sesión" });
        }
    }

    // Si no es admin, buscar usuario normal
    const hash = await bcrypt.compare(req.body.contrasena, userLogin.contrasena);
    if (!hash)
        return res.status(400).send({ message: "El email o la contraseña son erroneas" });

    try {
        // Generar el token JWT para el usuario
        const token = jwt.sign(
            {
                _id: userLogin._id,
                nombre: userLogin.nombre,
                roleId: userLogin.roleId,
                iat: moment().unix(),
            },
            process.env.SK_JWT,
            { expiresIn: '1h' } // El token expirará en 1 hora
        );

        // Configurar la cookie
        res.cookie('token', token, {
          httpOnly: true, // No accesible desde JavaScript
          secure: process.env.NODE_ENV === 'production', // Solo en producción, debe ser 'true' para HTTPS
          sameSite: 'None', // Crucial para permitir cookies cross-origin
          maxAge: 3600000, // 1 hora en milisegundos
          path: '/', // Asegurarse de que la cookie esté disponible para toda la aplicación
      });      

        return res.status(200).send({ message: "Inicio de sesión exitoso" });

    } catch (e) {
        return res.status(400).send({ message: "Error al iniciar sesión" });
    }
};
const logoutUser = async (req, res) => {
  try {
      // Eliminar la cookie configurando una fecha de expiración pasada
      res.cookie('token', token, {
        httpOnly: true, // No accesible desde JavaScript
        secure: process.env.NODE_ENV === 'production', // Solo en producción, debe ser 'true' para HTTPS
        sameSite: 'None', // Crucial para permitir cookies cross-origin
        maxAge: 3600000, // 1 hora en milisegundos
        path: '/', // Asegurarse de que la cookie esté disponible para toda la aplicación
    });

      return res.status(200).send({ message: "Sesión cerrada correctamente" });
  } catch (error) {
      return res.status(500).send({ message: "Error al cerrar sesión" });
  }
};

  // Método que se encarga de permitir el acceso de administradores ya registrados

  // const loginAdmin = async (req, res) => {
  //   if (!req.body.email || !req.body.contrasena)
  //     return res.status(400).send({ message: "Datos incompletos" });
  
  //   const AdminLogin = await admin.findOne({ email: req.body.email });
  //   if (!AdminLogin)
  //     return res.status(400).send({ message: "El email o la contraseña son erroneas" });
  
  //   const hash = await bcrypt.compare( req.body.contrasena, AdminLogin.contrasena );
  //   if (!hash)
  //     return res.status(400).send({ message: "El email o la contraseña son erroneas" });
  
  //   try {
  //     return res.status(200).json({
  //       token: jwt.sign(
  //         {
  //           _id: AdminLogin._id,
  //           nombre: AdminLogin.nombre,
  //           roleId: AdminLogin.roleId,
  //           iat: moment().unix(),
  //         },
  //         process.env.SK_JWT
  //       ),
  //     });
  //   } catch (e) {
  //     return res.status(400).send({ message: "Error al iniciar sesion" });
  //   }
  // };

  // Método que permite actualizar la información de un admin

  const updateAdmin = async (req, res) => {
    if (!req.body.nombre || !req.body.email || !req.body.roleId)
      return res.status(400).send({ message: "Datos incompletos" });
  
    const searchUser = await admin.findById({ _id: req.body._id });
    if (req.body.email !== searchUser.email)
      return res
        .status(400)
        .send({ message: "El email no debería cambiar" });
  
    let pass = "";
  
    if (req.body.contrasena) {
      const passHash = await bcrypt.compare(
        req.body.contrasena,
        searchUser.contrasena
      );
      if (!passHash) {
        pass = await bcrypt.hash(req.body.contrasena, 10);
      } else {
        pass = searchUser.contrasena;
      }
    } else {
      pass = searchUser.contrasena;
    }

    const Rol = await role.findOne({nombre: req.body.roleId});

    const existingUser = await user.findOne({
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono,
      contrasena: pass,
      roleId: Rol._id, // Aquí comparamos el ObjectId del rol
    });

    if (existingUser)
      return res.status(400).send({ message: "No haz hecho ningún cambio" });
  
    const userUpdate = await admin.findByIdAndUpdate(req.body._id, {
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono,
      contrasena: pass,
      roleId: Rol._id
    });
  
    return !userUpdate
      ? res.status(400).send({ message: "Error al editar los datos del usuario" })
      : res.status(200).send({ message: "Usuario actualizado" });
  };

  // Método que permite eliminar un admin registrado

  const deleteAdmin = async (req, res) => {
    if(!req.body._id) return res.status(400).send("Datos incompletos");

    const UserDelete = await admin.findByIdAndDelete({_id: req.body._id});
    return !UserDelete
    ? res.status(400).send({ message: "Usuario no encontrado" })
    : res.status(200).send({ message: "Usuario eliminado" });
  };
 
  // Método que permite consultar todos los administradores registrados

  const listAdmin = async (req, res) => {
    const userList = await admin
      .find({
        $and: [{ nombre: new RegExp(req.body.nombre, "i") }],
      })
      .populate("roleId", "nombre")
      .exec();
    return userList.length === 0
      ? res.status(400).send({ message: "lista de usuarios vacia" })
      : res.status(200).send({ userList });
  };

  // Método que permite buscar un administrador por su Id

  const findAdmin = async (req, res) => {
    const userfind = await admin
      .findOne({ nombre: req.params["nombre"] })
      .populate("roleId")
      .exec();
    return !userfind
      ? res.status(400).send({ message: "No se encontraron resultados" })
      : res.status(200).send({ userfind });
  };  


export default{
    registerUser,
    listAllUser,
    registerAdminUser,
    findUser,
    findUserNew,
    getUserRole,
    updateUser,
    updateUserNew,
    deleteUser,
    deleteUserTotal,
    loginUser,
    // loginAdmin,
    updateAdmin,
    deleteAdmin,
    listAdmin,
    findAdmin,
    logoutUser
}