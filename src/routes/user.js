import { Router } from "express";
import { registerUsesr } from "../controllers/user.js";

const router = Router();

router.route("/register").post(registerUsesr)

export default router;