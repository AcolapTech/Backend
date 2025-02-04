import pqr from "../models/PQR.js";

// Método que permite crear o registrar PQR's

const registerpqr = async (req, res) => {
     if (!req.body.nombre ||
         !req.body.descripcion ||
         !req.body.motivo ||
         !req.body.correo ||
         !req.body.telefono
     )
         return res.status(400).send({ message: "Datos incompletos" });
    
         
     const PQRRegister = new pqr({
         nombre: req.body.nombre,
         descripcion: req.body.descripcion,
         motivo: req.body.motivo,
         correo: req.body.correo,
         telefono: req.body.telefono
     });

    
     const result = await PQRRegister.save();
     return !result
         ? res.status(400).send({ message: "Falla al publicar la PQR" })
         : res.status(200).send({ result });
 };

 // Método que permite consultar las PQR's registradas

 const listpqr = async (req, res) => {
    const PQRList = await pqr.find();
    return PQRList.length == 0
    ? res.status(400).send({ message: "Lista de PQR's vacia" })
    : res.status(200).send({ PQRList }); 
  };

//  Método que permite la eliminación de las noticias por Id

const deletepqr = async (req, res) => {
    const pqrDelete = await pqr.findByIdAndDelete({ _id: req.params["_id"] });
  return !pqrDelete
    ? res.status(400).send({ message: "PQR no encontrada" })
    : res.status(200).send({ message: "PQR eliminada" });
  }  

export default { registerpqr, listpqr, deletepqr };