import mongoose from 'mongoose'

const AgendaSchema = new mongoose.Schema(
    {
        //    Datos personales
        nombre_asistente: String,
        telefono: String,
        correo_personal: String,
        cargo: String,
        //   Datos Empresa
        razon_social: String,
        NIT: String,
        correo_corporativo: String,
        afiliado: String,
        tipo_participacion: String,
        condicion_especial_p: String,
        estado_pago: Boolean,
        Tipo_empresa: String,
        vigencia: Boolean,
        autorizacion: Boolean,
        nombre_factura: String,
        correo_factura: String
    }
)

const agenda = mongoose.model("Agendados", AgendaSchema);

export default agenda;