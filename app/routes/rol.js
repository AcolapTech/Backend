import express from "express";
import controllers from "../controllers/rol.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/ValidId.js";

const router = express.Router();


router.post("/registerRole", auth, admin, controllers.registerRole);
router.get("/listRole", auth, admin, controllers.listRole);
router.get("/findRole/:nombre", auth, admin, controllers.findRole);
router.put("/updateRole", auth, admin, controllers.updateRole);
router.delete("/deleteRole/:_id", auth, validId, admin, controllers.deleteRole);

export default router;