import express from "express";
import user from "../controllers/user.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/ValidId.js";


const router = express.Router();

router.post("/registerUser", user.registerUser);
router.get("/listUsers", auth, admin, user.listAllUser);
router.post("/registerAdminUser", auth, admin, user.registerAdminUser);
router.get("/findUser/:nombre", auth, admin, user.findUser);
router.get("/findUser", auth, user.findUserNew);
router.get("/getRole/:email", user.getUserRole);
router.put("/updateUser", auth, admin, user.updateUser);
router.put("/updateUserNew", auth, user.updateUserNew);
router.put("/deleteUser", auth, admin, user.deleteUser);
router.delete("/deleteUserTotal/:_id", auth, admin, validId, user.deleteUserTotal);
router.post("/loginUser", user.loginUser);
// router.post("/loginAdmin", user.loginAdmin);
router.put("/updateadmin", auth, admin, user.updateAdmin);
router.delete("/deleteAdmin", auth, admin, user.deleteAdmin);
router.get("/listAdmin", auth, admin, user.listAdmin);
router.get("/findAdmin/:nombre", auth, admin, user.findAdmin);
router.post("/logout", auth, user.logoutUser);

export default router 

