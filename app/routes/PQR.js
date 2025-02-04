import express from "express";
import pqr from "../controllers/PQR.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";


const router = express.Router();


router.post("/registerpqr", pqr.registerpqr);
router.get("/listpqr", auth, admin, pqr.listpqr);
router.delete("/deletepqr/:_id", auth, admin, pqr.deletepqr);

export default router;