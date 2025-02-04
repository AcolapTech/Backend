import express from "express";
import Agenda from "../controllers/Agenda.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/ValidId.js";


const router = express.Router();

router.post("/registerDate", Agenda.registerDate);
router.post("/listall", auth, admin, Agenda.listall);
router.put("/updatedate", auth, admin, Agenda.updatedate);
router.delete("/deletedate", auth, admin, Agenda.deletedate);
router.get("/findone/:nombre_asistente", auth, admin, Agenda.findone);
router.put("/updateStatus", auth, admin, Agenda.updateStatus);
// router.get("/liststatus", auth, admin, Agenda.liststatus);
router.put("/updateVigence", Agenda.updateVigence);

export default router;