import express from "express";
import controllers from "../controllers/emp.js";
import upload from "../middlewares/Format_file.js"; // Middleware actualizado
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";

const router = express.Router();

router.post("/savenewsImg", upload, auth, admin, async (req, res) => {
    console.log(req.files);  // Muestra los archivos subidos en la terminal
    console.log(req.body);   // Muestra los datos del formulario
  
    res.send({ message: "Archivos recibidos correctamente" });  // Prueba si multer funciona bien
  });
router.get("/listallemp", controllers.listallemp);
router.put("/updateemp", auth, admin, controllers.updateemp);
router.get("/findemp/:nombre", controllers.findemp);
router.delete("/deletemp", auth, admin, controllers.deletemp);

export default router;