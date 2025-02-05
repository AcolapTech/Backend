// Librerias necesarias para poder crear los metodos necesarios

import emp from '../models/emp.js'
import fs from "fs";
import path from "path";
import moment from "moment";

// Método que realiza el registro de los afiliados

// const registeremp = async (req, res) => {
//   if (!req.body.nombre || !req.body.Pais || !req.body.Tipo_afiliado || !req.body.Razon_social || !req.body.Ciudad || !req.body.Num_sedes)
//     return res.status(400).send({ message: "Datos incompletos" });

//   const existingEmp = await emp.findOne({ nombre: req.body.nombre });
//   if (existingEmp)
//     return res.status(400).send({ message: "Este afiliado ya ha sido registrado" });

//   const empRegister = new emp({
//     nombre: req.body.nombre,
//     Razon_social: req.body.Razon_social,
//     Tipo_afiliado: req.body.Tipo_afiliado,
//     Pais: req.body.Pais,
//     Ciudad: req.body.Ciudad,
//     Num_sedes: req.body.Num_sedes,
//     Tipo_parque: req.body.Tipo_parque,
//     LogoURL: "",
//   });

//   const result = await empRegister.save();
//   return !result
//     ? res.status(400).send({ message: "Falla al registrar el afiliado" })
//     : res.status(200).send({ result });
// };

// Método que permite el guardado de la imagen del afiliado al crearlo

const savempImg = async (req, res) => {
  try {
    const { nombre, Razon_social, Tipo_afiliado, Pais, Ciudad, Num_sedes, Tipo_parque, URL } = req.body;

    if (!nombre || !Pais || !Tipo_afiliado || !Razon_social || !Ciudad || !Num_sedes) {
      return res.status(400).send({ message: "Datos incompletos" });
    }

    let imageUrl = "";

    // Verificar si hay una imagen adjunta
    if (req.files && req.files.image) {
      const image = req.files.image[0]; // `multer` almacena los archivos en un array

      // Construir la ruta del archivo
      const uploadDir = "./uploads/";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${moment().unix()}${path.extname(image.originalname)}`;
      const filePath = path.join(uploadDir, filename);

      // Guardar el archivo en la carpeta `uploads`
      fs.writeFileSync(filePath, image.buffer);

      // Construir la URL pública de la imagen
      const url = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
      imageUrl = url;
    }

    // Crear el registro en la base de datos
    const empSchema = new emp({
      nombre,
      Razon_social,
      Tipo_afiliado,
      Pais,
      Ciudad,
      Num_sedes,
      Tipo_parque,
      LogoURL: imageUrl,
      UrlParque: URL,
    });

    const result = await empSchema.save();
    return res.status(200).send({ result });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error interno del servidor", error: error.message });
  }
};




// Método que permite consultar todos los afiliados

const listallemp = async (req, res) => {
  const emplist = await emp.find();
  return emplist.length == 0
    ? res.status(400).send({ message: "Lista de afiliados vacia" })
    : res.status(200).send({ emplist });
};

// Método que permite actualizar los datos del afiliado, buscandolo por medio del nombre

const updateemp = async (req, res) => {
  if (!req.body.nombre2)
    return res.status(400).send({ message: "Datos incompletos" });

  const empUpdate = await emp.findOneAndUpdate(
    { nombre: req.body.nombre2 },  // Buscar el rol actual por nombre
    { nombre: req.body.nombre, Razon_social: req.body.Razon_social, Tipo_afiliado: req.body.Tipo_afiliado, Pais: req.body.Pais, Ciudad: req.body.Ciudad, Num_sedes: req.body.Num_sedes, Tipo_parque: req.body.Tipo_parque, UrlParque: req.body.URL || '' },
    { new: true }  // Devolver el documento actualizado
  );

  return !empUpdate
    ? res.status(400).send({ message: "Error al actualizar el afiliado" })
    : res.status(200).send({ message: "afiliado actualizado" });
};

// Método que se encarga de la eliminación del método por medio del ID

const deletemp = async (req, res) => {
  try {
    // Buscar el afiliado por ID
    let empData = await emp.findById({ _id: req.body._id });
    if (!empData) {
      return res.status(400).send({ message: "Afiliado no encontrado" });
    }

    // Obtener la URL de la imagen
    let empImg = empData.LogoURL; // Asegúrate de usar la propiedad correcta
    if (empImg) {
      // Extraer el nombre del archivo de la URL
      empImg = path.basename(empImg);

      // Ruta del archivo en el servidor
      let serverImg = path.join("./uploads/", empImg);

      // Eliminar el archivo si existe
      if (fs.existsSync(serverImg)) {
        fs.unlinkSync(serverImg);
      } else {
        console.log("El archivo no existe en el servidor");
      }
    }

    // Eliminar el registro en la base de datos
    const empDelete = await emp.findByIdAndDelete({ _id: req.body._id });
    if (!empDelete) {
      return res.status(400).send({ message: "Afiliado no encontrado en la base de datos" });
    }

    return res.status(200).send({ message: "Afiliado eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el afiliado:", error);
    return res.status(500).send({ message: "Error interno del servidor", error: error.message });
  }
};

// Método que permite consultar un afiliado por medio del nombre

const findemp = async (req, res) => {
  const empNombre = await emp.findOne({ nombre: req.params["nombre"] });
  return !empNombre
    ? res.status(400).send({ message: "No se encontraron resultados" })
    : res.status(200).send({ empNombre });
};

export default {
  // registeremp,
  savempImg,
  listallemp,
  updateemp,
  deletemp,
  findemp
}
