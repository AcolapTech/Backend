import express from "express";
import news from "../controllers/News.js";
import auth from "../middlewares/auth.js";
import multiparty from "connect-multiparty";
const mult = multiparty();
import admin from "../middlewares/admin.js";
import upload from "../middlewares/Format_file.js";


const router = express.Router();

// router.post("/registerNews", auth, admin, news.registerNews);
router.post("/savenewsImg", mult, upload, auth, admin, news.savenewsImg);
router.get("/listnotice", news.listnotice);
router.put("/updatenotice", auth, admin, news.updatenotice);
router.delete("/deletenotice", auth, admin, news.deletenotice);
router.get("/findNew/:titulo", auth, admin, news.findNew);


export default router;