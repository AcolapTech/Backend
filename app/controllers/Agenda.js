import agenda from "../models/Agenda.js";

// Método que permite el registro de aquellos agendados al encuentro

const registerDate = async (req, res) => {
    if (!req.body.nombre_asistente ||
        !req.body.telefono ||
        !req.body.correo_personal ||
        !req.body.razon_social ||
        !req.body.cargo ||
        !req.body.NIT ||
        !req.body.afiliado ||
        !req.body.tipo_participacion ||
        !req.body.condicion_especial_p ||
        !req.body.correo_corporativo ||
        !req.body.Tipo_empresa ||
        req.body.autorizacion === undefined // Validar que `autorizacion` exista
    ) {
        return res.status(400).send({ message: "Datos incompletos" });
    }
    
    // Validar `nombre_factura` y `correo_factura` solo si `autorizacion` es verdadera
    if (req.body.autorizacion && (!req.body.nombre_factura || !req.body.correo_factura)) {
        return res.status(400).send({ message: "Datos de facturación incompletos" });
    }
    

    const existingUser = await agenda.findOne({ correo_personal: req.body.correo_personal });
    if (existingUser)
        return res.status(400).send({ message: "El email ya ha sido registrado" });

    const AgendaRegister = new agenda({
        nombre_asistente: req.body.nombre_asistente,
        telefono: req.body.telefono,
        correo_personal: req.body.correo_personal,
        cargo: req.body.cargo,
        razon_social: req.body.razon_social,
        NIT: req.body.NIT,
        correo_corporativo: req.body.correo_corporativo,
        afiliado: req.body.afiliado,
        tipo_participacion: req.body.tipo_participacion,
        condicion_especial_p: req.body.condicion_especial_p,
        estado_pago: false,
        Tipo_empresa: req.body.Tipo_empresa,
        vigencia: true,
        autorizacion: req.body.autorizacion,
        nombre_factura: req.body.nombre_factura,
        correo_factura: req.body.correo_factura 
    });

    const result = await AgendaRegister.save();
    return !result
        ? res.status(400).send({ message: "Falla al registrar el agendamiento" })
        : res.status(200).send({ result });
};

//   Método que permite consultar todos los agendados al encuentro

const listall = async (req, res) => {
    try {
        const query = {}; // Inicializar un objeto vacío para los filtros

        // Agregar filtros dinámicamente si existen en el cuerpo de la solicitud
        if (req.body.tipo_participacion) query.tipo_participacion = req.body.tipo_participacion;
        if (req.body.condicion_especial_p) query.condicion_especial_p = req.body.condicion_especial_p;
        if (req.body.Tipo_empresa) query.Tipo_empresa = req.body.Tipo_empresa;
        if (req.body.afiliado) query.afiliado = req.body.afiliado;
        if (req.body.autorizacion !== undefined) query.autorizacion = req.body.autorizacion; // Filtra por true o false

        const agendalist = await agenda.find(query); // Realizar la consulta con los filtros

        return agendalist.length === 0
            ? res.status(404).send({ message: "No se encontraron usuarios con los filtros aplicados" })
            : res.status(200).send({ agendalist });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Error al consultar los usuarios" });
    }
};



//   Método que permite actualizar los datos de los agendados

const updatedate = async (req, res) => {
    if (!req.body.nombre_asistente)
        return res.status(400).send({ message: "Datos incompletos" });

    const existingAgenda = await agenda.findOne({
        nombre_asistente: req.body.nombre_asistente,
        telefono: req.body.telefono,
        correo_personal: req.body.correo_personal,
        cargo: req.body.cargo,
        razon_social: req.body.razon_social,
        NIT: req.body.NIT,
        correo_corporativo: req.body.correo_corporativo,
        afiliado: req.body.afiliado,
        tipo_participacion: req.body.tipo_participacion,
        condicion_especial_p: req.body.condicion_especial_p,
        Tipo_empresa: req.body.Tipo_empresa,
        autorizacion: req.body.autorizacion,
        nombre_factura: req.body.nombre_factura,
        correo_factura: req.body.correo_factura 
    });
    if (existingAgenda)
        return res.status(400).send({ message: "No haz hecho ningún cambio" });
    
    const AgendaUpdate = await agenda.findByIdAndUpdate(req.body._id, {
        nombre_asistente: req.body.nombre_asistente,
        telefono: req.body.telefono,
        correo_personal: req.body.correo_personal,
        cargo: req.body.cargo,
        razon_social: req.body.razon_social,
        NIT: req.body.NIT,
        correo_corporativo: req.body.correo_corporativo,
        afiliado: req.body.afiliado,
        tipo_participacion: req.body.tipo_participacion,
        condicion_especial_p: req.body.condicion_especial_p,
        Tipo_empresa: req.body.Tipo_empresa,
        autorizacion: req.body.autorizacion,
        nombre_factura: req.body.nombre_factura,
        correo_factura: req.body.correo_factura
    });

    return !AgendaUpdate
        ? res.status(400).send({ message: "Error al editar los datos del agendado" })
        : res.status(200).send({ message: "Usuario actualizado" });
};

// Método que permite la eliminación de un agendado por medio del Id

const deletedate = async (req, res) => {
    const agendalete = await agenda.findByIdAndDelete({ _id: req.body._id });
    return !agendalete
      ? res.status(400).send({ message: "usuario no encontrado" })
      : res.status(200).send({ message: "Usuario eliminado" });
  };

// Método que permite consultar un solo agendado por medio del nombre

const findone = async (req, res) => {
    const userfind = await agenda.findOne({ nombre_asistente: req.params["nombre_asistente"] });
    return !userfind
      ? res.status(400).send({ message: "No se encontraron resultados" })
      : res.status(200).send({ userfind });
  };

//   Método que permite actualizar el estado de pago de un agendado

const updateStatus = async (req, res) => {
    if (typeof req.body.estado_pago !== 'boolean') {
        return res.status(400).send({ message: "Datos incompletos" });
    }

    // Verifica si el estado actual es el mismo al nuevo estado
    const agendaToUpdate = await agenda.findById(req.body._id);
    if (!agendaToUpdate) {
        return res.status(400).send({ message: "Agendado no encontrado" });
    }

    if (agendaToUpdate.estado_pago === req.body.estado_pago) {
        return res.status(400).send({ message: "No has hecho ningún cambio" });
    }

    // Actualizar el estado si ha cambiado
    const AgendaUpdate = await agenda.findByIdAndUpdate(req.body._id, {
        estado_pago: req.body.estado_pago
    });

    return !AgendaUpdate
        ? res.status(400).send({ message: "Error al cambiar el estado" })
        : res.status(200).send({ message: "Estado actualizado" });
};


// Método que permite consultar los agendados por estado de pago
// const liststatus = async (req, res) => {
//     if (!req.body.estado_pago)
//         return res.status(400).send({ message: "Datos incompletos" });
//     const agendalist = await agenda.find({
//       estado_pago: req.body.estado_pago
//     });
//     return agendalist.length == 0
//         ? res.status(400).send({ message: "Lista de agendados con estado: "+req.body.estado_pago+" vacia" })
//         : res.status(200).send({ agendalist });
// }

const updateVigence = async (req, res) => {
    if (typeof req.body.vigencia !== 'boolean') {
        return res.status(400).send({ message: "Datos incompletos" });
    }

     // Verifica si el estado actual es el mismo al nuevo estado
     const agendaToUpdate = await agenda.findById(req.body._id);
     if (!agendaToUpdate) {
         return res.status(400).send({ message: "Agendado no encontrado" });
     }
 
     if (agendaToUpdate.vigencia === req.body.vigencia) {
         return res.status(400).send({ message: "No has hecho ningún cambio" });
     }
    const AgendaUpdate = await agenda.findByIdAndUpdate(req.body._id, {
        vigencia: req.body.vigencia
    });

    return !AgendaUpdate
        ? res.status(400).send({ message: "Error al cambiar el estado" })
        : res.status(200).send({ message: "Nueva Vigencia actualizada" });
};


export default {
    registerDate,
    listall,
    updatedate,
    deletedate,
    findone,
    updateStatus,
    // liststatus,
    updateVigence
}