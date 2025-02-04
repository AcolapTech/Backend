import express from "express";
import controllers from "../controllers/emp.js";
import upload from "../middlewares/Format_file.js"; // Nueva configuración con multer
import multiparty from "connect-multiparty";
const mult = multiparty();
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";

const router = express.Router();

// router.post("/registeremp", auth, admin, controllers.registeremp);
router.post("/savempImg",mult,upload,auth,controllers.savempImg);
router.get("/listallemp", controllers.listallemp);
router.put("/updateemp", auth, admin, controllers.updateemp);
router.get("/findemp/:nombre", controllers.findemp);
router.delete("/deletemp", auth, admin, controllers.deletemp);

export default router;